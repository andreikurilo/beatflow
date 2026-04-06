package com.beatflow.analytics.dto;

import java.time.LocalDateTime;
import java.util.UUID;

public record PlaybackHistoryResponse(UUID id, UUID sessionId, UUID userId, UUID trackId, String trackTitle,
                                      String artistName, String albumTitle, String deviceId, LocalDateTime startedAt,
                                      LocalDateTime createdAt) {
}
