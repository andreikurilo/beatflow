package com.beatflow.playback.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "playback_sessions")
@Getter
@Setter
public class PlaybackSession {

    @Id
    private UUID id;

    @Column(nullable = false, name = "user_id")
    private UUID userId;

    @Column(nullable = false, name = "track_id")
    private UUID trackId;

    @Column(nullable = false, name = "device_id")
    private String deviceId;

    @Column(nullable = false, name = "audio_key")
    private String audioKey;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PlaybackSessionStatus status;

    @Column(nullable = false, name = "started_at")
    private LocalDateTime startedAt;

    @Column(nullable = false, name = "last_seen_at")
    private LocalDateTime lastSeenAt;

    @Column(nullable = false, name = "expires_at")
    private LocalDateTime expiresAt;
}
