package com.beatflow.playback.service;

import com.beatflow.common.kafka.event.TrackPlaybackStartedEvent;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PlaybackAnalyticsProducer {

    private static final String TOPIC = "track-playback-started";

    private final KafkaTemplate<String, TrackPlaybackStartedEvent> kafkaTemplate;

    public void publishTrackPlaybackStarted(TrackPlaybackStartedEvent event) {
        kafkaTemplate.send(TOPIC, event.getUserId().toString(), event);
    }
}
