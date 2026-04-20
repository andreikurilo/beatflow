package com.beatflow.playback.service;

import com.beatflow.common.security.JwtTokenService;
import com.beatflow.playback.client.CatalogClient;
import com.beatflow.playback.domain.PlaybackSession;
import com.beatflow.playback.domain.PlaybackSessionStatus;
import com.beatflow.playback.dto.StartPlaybackResponse;
import com.beatflow.playback.dto.TrackPlaybackResponse;
import com.beatflow.playback.repository.PlaybackSessionRepository;
import io.jsonwebtoken.Claims;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PlaybackServiceTest {

    @Mock
    private PlaybackSessionRepository playbackSessionRepository;

    @Mock
    private PlaybackAnalyticsProducer playbackAnalyticsProducer;

    @Mock
    private CatalogClient catalogClient;

    @Mock
    private JwtTokenService jwtTokenService;

    @InjectMocks
    private PlaybackService playbackService;

    @BeforeEach
    void setUp() {
        ReflectionTestUtils.setField(playbackService, "publicBaseUrl", "http://localhost:8183");
    }

    @Test
    void startPlayback_shouldSupersedeOldSessions_createNewSession_publishEvent_andReturnResponse() {
        UUID userId = UUID.randomUUID();
        UUID trackId = UUID.randomUUID();
        String deviceId = "device-1";

        Claims claims = mock(Claims.class);
        when(claims.getSubject()).thenReturn(userId.toString());
        when(jwtTokenService.parseClaims("token-value")).thenReturn(claims);

        PlaybackSession old1 = new PlaybackSession();
        old1.setId(UUID.randomUUID());
        old1.setUserId(userId);
        old1.setStatus(PlaybackSessionStatus.ACTIVE);

        PlaybackSession old2 = new PlaybackSession();
        old2.setId(UUID.randomUUID());
        old2.setUserId(userId);
        old2.setStatus(PlaybackSessionStatus.ACTIVE);

        when(playbackSessionRepository.findByUserIdAndStatus(userId, PlaybackSessionStatus.ACTIVE)).thenReturn(List.of(
            old1,
            old2));

        TrackPlaybackResponse trackPlayback = new TrackPlaybackResponse();
        trackPlayback.setAudioKey("tracks/test.mp3");
        when(catalogClient.getTrackPlayback(trackId)).thenReturn(trackPlayback);

        ArgumentCaptor<PlaybackSession> newSessionCaptor = ArgumentCaptor.forClass(PlaybackSession.class);

        StartPlaybackResponse response = playbackService.startPlayback("Bearer token-value", trackId, deviceId);

        assertThat(old1.getStatus()).isEqualTo(PlaybackSessionStatus.SUPERSEDED);
        assertThat(old2.getStatus()).isEqualTo(PlaybackSessionStatus.SUPERSEDED);
        verify(playbackSessionRepository).saveAll(List.of(old1, old2));

        verify(playbackSessionRepository).save(newSessionCaptor.capture());
        PlaybackSession savedSession = newSessionCaptor.getValue();

        assertThat(savedSession.getId()).isNotNull();
        assertThat(savedSession.getUserId()).isEqualTo(userId);
        assertThat(savedSession.getTrackId()).isEqualTo(trackId);
        assertThat(savedSession.getDeviceId()).isEqualTo(deviceId);
        assertThat(savedSession.getAudioKey()).isEqualTo("tracks/test.mp3");
        assertThat(savedSession.getStatus()).isEqualTo(PlaybackSessionStatus.ACTIVE);
        assertThat(savedSession.getStartedAt()).isNotNull();
        assertThat(savedSession.getLastSeenAt()).isNotNull();
        assertThat(savedSession.getExpiresAt()).isAfter(savedSession.getStartedAt());

        verify(playbackAnalyticsProducer).publishTrackPlaybackStarted(any());

        assertThat(response.getSessionId()).isEqualTo(savedSession.getId());
        assertThat(response.getStreamUrl()).isEqualTo("http://localhost:8183/api/playback/streams/" + savedSession.getId());
    }

    @Test
    void startPlayback_shouldThrow_whenAuthorizationHeaderMissing() {
        UUID trackId = UUID.randomUUID();

        assertThatThrownBy(() -> playbackService.startPlayback(null,
                                                               trackId,
                                                               "device-1")).isInstanceOf(RuntimeException.class)
                                                                           .hasMessage("Missing Authorization header");

        assertThatThrownBy(() -> playbackService.startPlayback("Basic abc", trackId, "device-1")).isInstanceOf(
            RuntimeException.class).hasMessage("Missing Authorization header");
    }

    @Test
    void getActiveSession_shouldReturnAndUpdateLastSeen_whenSessionIsActiveAndNotExpired() {
        UUID sessionId = UUID.randomUUID();

        PlaybackSession session = new PlaybackSession();
        session.setId(sessionId);
        session.setStatus(PlaybackSessionStatus.ACTIVE);
        session.setExpiresAt(LocalDateTime.now().plusMinutes(10));
        session.setLastSeenAt(LocalDateTime.now().minusMinutes(5));

        when(playbackSessionRepository.findById(sessionId)).thenReturn(Optional.of(session));

        PlaybackSession result = playbackService.getActiveSession(sessionId);

        assertThat(result).isEqualTo(session);
        assertThat(result.getLastSeenAt()).isNotNull();
        verify(playbackSessionRepository).save(session);
    }

    @Test
    void getActiveSession_shouldThrow_whenSessionNotFound() {
        UUID sessionId = UUID.randomUUID();
        when(playbackSessionRepository.findById(sessionId)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> playbackService.getActiveSession(sessionId)).isInstanceOf(RuntimeException.class)
                                                                             .hasMessage("Playback session not found");
    }

    @Test
    void getActiveSession_shouldThrow_whenSessionNotActive() {
        UUID sessionId = UUID.randomUUID();

        PlaybackSession session = new PlaybackSession();
        session.setId(sessionId);
        session.setStatus(PlaybackSessionStatus.SUPERSEDED);
        session.setExpiresAt(LocalDateTime.now().plusMinutes(10));

        when(playbackSessionRepository.findById(sessionId)).thenReturn(Optional.of(session));

        assertThatThrownBy(() -> playbackService.getActiveSession(sessionId)).isInstanceOf(RuntimeException.class)
                                                                             .hasMessage(
                                                                                 "Playback session is not active");

        verify(playbackSessionRepository, never()).save(any());
    }

    @Test
    void getActiveSession_shouldExpireAndThrow_whenSessionExpired() {
        UUID sessionId = UUID.randomUUID();

        PlaybackSession session = new PlaybackSession();
        session.setId(sessionId);
        session.setStatus(PlaybackSessionStatus.ACTIVE);
        session.setExpiresAt(LocalDateTime.now().minusMinutes(1));

        when(playbackSessionRepository.findById(sessionId)).thenReturn(Optional.of(session));

        assertThatThrownBy(() -> playbackService.getActiveSession(sessionId)).isInstanceOf(RuntimeException.class)
                                                                             .hasMessage("Playback session expired");

        assertThat(session.getStatus()).isEqualTo(PlaybackSessionStatus.EXPIRED);
        verify(playbackSessionRepository).save(session);
    }
}
