package com.beatflow.playback.repository;

import com.beatflow.playback.domain.PlaybackSession;
import com.beatflow.playback.domain.PlaybackSessionStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface PlaybackSessionRepository extends JpaRepository<PlaybackSession, UUID> {

    List<PlaybackSession> findByUserIdAndStatus(UUID userId, PlaybackSessionStatus status);

    Optional<PlaybackSession> findByIdAndUserId(UUID id, UUID userId);
}
