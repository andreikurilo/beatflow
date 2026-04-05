package com.beatflow.analytics.controller;

import com.beatflow.analytics.domain.PlaybackHistory;
import com.beatflow.analytics.service.AnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/analytics")
@RequiredArgsConstructor
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    @GetMapping("/users/{userId}/history")
    public List<PlaybackHistory> getUserPlaybackHistory(@PathVariable UUID userId) {
        return analyticsService.getUserPlaybackHistory(userId);
    }
}