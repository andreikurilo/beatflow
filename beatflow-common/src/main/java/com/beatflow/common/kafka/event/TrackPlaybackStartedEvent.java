package com.beatflow.common.kafka.event;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class TrackPlaybackStartedEvent {
    private UUID sessionId;
    private UUID userId;
    private UUID trackId;
    private String deviceId;
    private LocalDateTime startedAt;
}
