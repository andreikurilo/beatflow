package com.beatflow.analytics.domain;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "playback_history")
@Getter
@Setter
public class PlaybackHistory {

    @Id
    private UUID id;

    private UUID sessionId;
    private UUID userId;
    private UUID trackId;
    private String deviceId;
    private LocalDateTime startedAt;
    private LocalDateTime createdAt;
}