CREATE TABLE playback_sessions
(
    id           UUID PRIMARY KEY,
    user_id      UUID         NOT NULL,
    track_id     UUID         NOT NULL,
    device_id    VARCHAR(255) NOT NULL,
    audio_key    TEXT         NOT NULL,
    status       VARCHAR(50)  NOT NULL,
    started_at   TIMESTAMP    NOT NULL,
    last_seen_at TIMESTAMP    NOT NULL,
    expires_at   TIMESTAMP    NOT NULL
);

CREATE INDEX idx_playback_sessions_user_id ON playback_sessions (user_id);
CREATE INDEX idx_playback_sessions_status ON playback_sessions (status);
CREATE INDEX idx_playback_sessions_track_id ON playback_sessions (track_id);
