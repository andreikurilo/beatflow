package com.beatflow.analytics.kafka;

import com.beatflow.analytics.domain.PlaybackHistory;
import com.beatflow.analytics.repository.PlaybackHistoryRepository;
import com.beatflow.common.kafka.event.TrackPlaybackStartedEvent;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
class PlaybackAnalyticsListenerTest {

    @Mock
    private PlaybackHistoryRepository playbackHistoryRepository;

    @InjectMocks
    private PlaybackAnalyticsListener playbackAnalyticsListener;

    @Captor
    private ArgumentCaptor<PlaybackHistory> historyCaptor;

    @Test
    void handleTrackPlaybackStarted_savesPlaybackHistory() {
        UUID sessionId = UUID.randomUUID();
        UUID userId = UUID.randomUUID();
        UUID trackId = UUID.randomUUID();
        LocalDateTime startedAt = LocalDateTime.now().minusMinutes(1);

        TrackPlaybackStartedEvent event = new TrackPlaybackStartedEvent(sessionId,
                                                                        userId,
                                                                        trackId,
                                                                        "device-1",
                                                                        startedAt);

        playbackAnalyticsListener.handleTrackPlaybackStarted(event);

        verify(playbackHistoryRepository).save(historyCaptor.capture());

        PlaybackHistory saved = historyCaptor.getValue();
        assertThat(saved.getId()).isNotNull();
        assertThat(saved.getSessionId()).isEqualTo(sessionId);
        assertThat(saved.getUserId()).isEqualTo(userId);
        assertThat(saved.getTrackId()).isEqualTo(trackId);
        assertThat(saved.getDeviceId()).isEqualTo("device-1");
        assertThat(saved.getStartedAt()).isEqualTo(startedAt);
        assertThat(saved.getCreatedAt()).isNotNull();
    }
}
