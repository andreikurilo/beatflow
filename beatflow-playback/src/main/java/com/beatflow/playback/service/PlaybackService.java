package com.beatflow.playback.service;

import com.beatflow.common.kafka.event.TrackPlaybackStartedEvent;
import com.beatflow.common.security.JwtTokenService;
import com.beatflow.playback.client.CatalogClient;
import com.beatflow.playback.domain.PlaybackSession;
import com.beatflow.playback.domain.PlaybackSessionStatus;
import com.beatflow.playback.dto.StartPlaybackResponse;
import com.beatflow.playback.dto.TrackPlaybackResponse;
import com.beatflow.playback.repository.PlaybackSessionRepository;
import io.jsonwebtoken.Claims;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PlaybackService {

    private final PlaybackSessionRepository playbackSessionRepository;
    private final PlaybackAnalyticsProducer playbackAnalyticsProducer;
    private final CatalogClient catalogClient;
    private final JwtTokenService jwtTokenService;


    @Value("${app.public-base-url}")
    private String publicBaseUrl;

    public StartPlaybackResponse startPlayback(String bearerToken, UUID trackId, String deviceId) {
        UUID userId = extractUserId(bearerToken);

        List<PlaybackSession> activeSessions = playbackSessionRepository.findByUserIdAndStatus(userId,
                                                                                               PlaybackSessionStatus.ACTIVE);

        for (PlaybackSession session : activeSessions) {
            session.setStatus(PlaybackSessionStatus.SUPERSEDED);
        }
        playbackSessionRepository.saveAll(activeSessions);

        TrackPlaybackResponse trackPlayback = catalogClient.getTrackPlayback(trackId);

        PlaybackSession session = new PlaybackSession();
        session.setId(UUID.randomUUID());
        session.setUserId(userId);
        session.setTrackId(trackId);
        session.setDeviceId(deviceId);
        session.setAudioKey(trackPlayback.getAudioKey());
        session.setStatus(PlaybackSessionStatus.ACTIVE);
        session.setStartedAt(LocalDateTime.now());
        session.setLastSeenAt(LocalDateTime.now());
        session.setExpiresAt(LocalDateTime.now().plusHours(2));

        playbackSessionRepository.save(session);

        playbackAnalyticsProducer.publishTrackPlaybackStarted(new TrackPlaybackStartedEvent(session.getId(),
                                                                                            session.getUserId(),
                                                                                            session.getTrackId(),
                                                                                            session.getDeviceId(),
                                                                                            session.getStartedAt()));

        String streamUrl = publicBaseUrl + "/api/playback/streams/" + session.getId();

        return new StartPlaybackResponse(session.getId(), streamUrl);
    }

    public PlaybackSession getActiveSession(UUID sessionId) {
        PlaybackSession session = playbackSessionRepository.findById(sessionId)
                                                           .orElseThrow(() -> new RuntimeException(
                                                               "Playback session not found"));

        if (session.getStatus() != PlaybackSessionStatus.ACTIVE) {
            throw new RuntimeException("Playback session is not active");
        }

        if (session.getExpiresAt().isBefore(LocalDateTime.now())) {
            session.setStatus(PlaybackSessionStatus.EXPIRED);
            playbackSessionRepository.save(session);
            throw new RuntimeException("Playback session expired");
        }

        session.setLastSeenAt(LocalDateTime.now());
        playbackSessionRepository.save(session);

        return session;
    }

    private UUID extractUserId(String bearerToken) {
        if (bearerToken == null || !bearerToken.startsWith("Bearer ")) {
            throw new RuntimeException("Missing Authorization header");
        }

        String token = bearerToken.substring(7);
        Claims claims = jwtTokenService.parseClaims(token);
        return UUID.fromString(claims.getSubject());
    }
}
