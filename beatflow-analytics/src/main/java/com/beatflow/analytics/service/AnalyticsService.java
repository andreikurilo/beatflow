package com.beatflow.analytics.service;

import com.beatflow.analytics.client.CatalogClient;
import com.beatflow.analytics.domain.PlaybackHistory;
import com.beatflow.analytics.dto.PlaybackHistoryResponse;
import com.beatflow.analytics.dto.TrackSummaryResponse;
import com.beatflow.analytics.repository.PlaybackHistoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AnalyticsService {

    private final PlaybackHistoryRepository playbackHistoryRepository;
    private final CatalogClient catalogClient;

    public Page<PlaybackHistoryResponse> getUserPlaybackHistory(UUID userId, Pageable pageable) {
        Page<PlaybackHistory> historyPage = playbackHistoryRepository.findByUserId(userId, pageable);

        List<UUID> trackIds = historyPage.getContent().stream().map(PlaybackHistory::getTrackId).distinct().toList();

        Map<UUID, TrackSummaryResponse> trackMap = getTrackMap(trackIds);
        
        return historyPage.map(history -> {
            TrackSummaryResponse track = trackMap.get(history.getTrackId());

            return new PlaybackHistoryResponse(history.getId(),
                                               history.getSessionId(),
                                               history.getUserId(),
                                               history.getTrackId(),
                                               track != null ? track.title() : null,
                                               track != null ? track.artistName() : null,
                                               track != null ? track.albumTitle() : null,
                                               history.getDeviceId(),
                                               history.getStartedAt(),
                                               history.getCreatedAt());
        });
    }

    private Map<UUID, TrackSummaryResponse> getTrackMap(List<UUID> trackIds) {
        try {
            return catalogClient.getTracksByIds(trackIds)
                                .stream()
                                .collect(Collectors.toMap(TrackSummaryResponse::id, Function.identity()));
        } catch (Exception e) {
            return Map.of();
        }
    }
}
