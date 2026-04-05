package com.beatflow.analytics.repository;

import com.beatflow.analytics.domain.PlaybackHistory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface PlaybackHistoryRepository extends JpaRepository<PlaybackHistory, UUID> {
    List<PlaybackHistory> findByUserIdOrderByStartedAtDesc(UUID userId);
}