package com.beatflow.analytics.dto;

import java.util.UUID;

public record TrackSummaryResponse(UUID id, String title, String artistName, String albumTitle) {
}
