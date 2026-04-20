package com.beatflow.analytics.kafka;

import com.beatflow.analytics.domain.PlaybackHistory;
import com.beatflow.analytics.repository.PlaybackHistoryRepository;
import com.beatflow.common.kafka.event.TrackPlaybackStartedEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.UUID;

@Component
@RequiredArgsConstructor
@Slf4j
public class PlaybackAnalyticsListener {

    private final PlaybackHistoryRepository playbackHistoryRepository;

    @SuppressWarnings("unused")
    @KafkaListener(topics = "track-playback-started", groupId = "beatflow-analytics-v2")
    public void handleTrackPlaybackStarted(TrackPlaybackStartedEvent event) {
        log.info("Received playback event: sessionId={}, userId={}, trackId={}",
                 event.getSessionId(),
                 event.getUserId(),
                 event.getTrackId());

        PlaybackHistory history = new PlaybackHistory();
        history.setId(UUID.randomUUID());
        history.setSessionId(event.getSessionId());
        history.setUserId(event.getUserId());
        history.setTrackId(event.getTrackId());
        history.setDeviceId(event.getDeviceId());
        history.setStartedAt(event.getStartedAt());
        history.setCreatedAt(LocalDateTime.now());

        playbackHistoryRepository.save(history);

        log.info("Saved playback history for session {}", event.getSessionId());
    }
}
