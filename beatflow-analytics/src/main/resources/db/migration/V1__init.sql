create table playback_history
(
    id         uuid primary key,
    session_id uuid      not null,
    user_id    uuid      not null,
    track_id   uuid      not null,
    device_id  varchar(255),
    started_at timestamp not null,
    created_at timestamp not null
);

create index idx_playback_history_user_id on playback_history (user_id);
create index idx_playback_history_track_id on playback_history (track_id);
create index idx_playback_history_started_at on playback_history (started_at);