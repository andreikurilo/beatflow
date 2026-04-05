package com.beatflow.analytics.service;

import com.beatflow.analytics.domain.PlaybackHistory;
import com.beatflow.analytics.repository.PlaybackHistoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AnalyticsService {

    private final PlaybackHistoryRepository playbackHistoryRepository;

    public List<PlaybackHistory> getUserPlaybackHistory(UUID userId) {
        return playbackHistoryRepository.findByUserIdOrderByStartedAtDesc(userId);
    }
}