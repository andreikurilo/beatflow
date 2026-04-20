package com.beatflow.analytics.service;

import com.beatflow.analytics.client.CatalogClient;
import com.beatflow.analytics.domain.PlaybackHistory;
import com.beatflow.analytics.dto.PlaybackHistoryResponse;
import com.beatflow.analytics.dto.TrackSummaryResponse;
import com.beatflow.analytics.repository.PlaybackHistoryRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AnalyticsServiceTest {

    @Mock
    private PlaybackHistoryRepository playbackHistoryRepository;

    @Mock
    private CatalogClient catalogClient;

    @InjectMocks
    private AnalyticsService analyticsService;

    @Test
    void getUserPlaybackHistory_returnsEnrichedHistory() {
        UUID userId = UUID.randomUUID();
        UUID historyId = UUID.randomUUID();
        UUID sessionId = UUID.randomUUID();
        UUID trackId = UUID.randomUUID();

        PlaybackHistory history = new PlaybackHistory();
        history.setId(historyId);
        history.setSessionId(sessionId);
        history.setUserId(userId);
        history.setTrackId(trackId);
        history.setDeviceId("device-1");
        history.setStartedAt(LocalDateTime.now().minusMinutes(5));
        history.setCreatedAt(LocalDateTime.now());

        Pageable pageable = PageRequest.of(0, 20, Sort.by("startedAt").descending());
        Page<PlaybackHistory> page = new PageImpl<>(List.of(history), pageable, 1);

        TrackSummaryResponse track = new TrackSummaryResponse(trackId, "Track Title", "Artist Name", "Album Title");

        when(playbackHistoryRepository.findByUserId(userId, pageable)).thenReturn(page);
        when(catalogClient.getTracksByIds(List.of(trackId))).thenReturn(List.of(track));

        Page<PlaybackHistoryResponse> result = analyticsService.getUserPlaybackHistory(userId, pageable);

        assertThat(result.getTotalElements()).isEqualTo(1);
        PlaybackHistoryResponse item = result.getContent().getFirst();
        assertThat(item.trackId()).isEqualTo(trackId);
        assertThat(item.trackTitle()).isEqualTo("Track Title");
        assertThat(item.artistName()).isEqualTo("Artist Name");
        assertThat(item.albumTitle()).isEqualTo("Album Title");
    }

    @Test
    void getUserPlaybackHistory_returnsNullTrackFields_whenCatalogFails() {
        UUID userId = UUID.randomUUID();
        UUID trackId = UUID.randomUUID();

        PlaybackHistory history = new PlaybackHistory();
        history.setId(UUID.randomUUID());
        history.setSessionId(UUID.randomUUID());
        history.setUserId(userId);
        history.setTrackId(trackId);
        history.setDeviceId("device-1");
        history.setStartedAt(LocalDateTime.now().minusMinutes(5));
        history.setCreatedAt(LocalDateTime.now());

        Pageable pageable = PageRequest.of(0, 20);
        Page<PlaybackHistory> page = new PageImpl<>(List.of(history), pageable, 1);

        when(playbackHistoryRepository.findByUserId(userId, pageable)).thenReturn(page);
        when(catalogClient.getTracksByIds(List.of(trackId))).thenThrow(new RuntimeException("Catalog down"));

        Page<PlaybackHistoryResponse> result = analyticsService.getUserPlaybackHistory(userId, pageable);

        PlaybackHistoryResponse item = result.getContent().getFirst();
        assertThat(item.trackTitle()).isNull();
        assertThat(item.artistName()).isNull();
        assertThat(item.albumTitle()).isNull();
    }
}
