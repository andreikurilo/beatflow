package com.beatflow.analytics.repository;

import com.beatflow.analytics.domain.PlaybackHistory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface PlaybackHistoryRepository extends JpaRepository<PlaybackHistory, UUID> {
    Page<PlaybackHistory> findByUserId(UUID userId, Pageable pageable);
}
