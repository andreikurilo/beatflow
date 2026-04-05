package com.beatflow.analytics.controller;

import com.beatflow.analytics.domain.PlaybackHistory;
import com.beatflow.analytics.service.AnalyticsService;
import com.beatflow.common.security.JwtTokenService;
import io.jsonwebtoken.Claims;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/analytics")
@RequiredArgsConstructor
public class AnalyticsController {

    private final AnalyticsService analyticsService;
    private final JwtTokenService jwtTokenService;

    @GetMapping("/me/history")
    public List<PlaybackHistory> getMyPlaybackHistory(@RequestHeader(HttpHeaders.AUTHORIZATION) String authorization) {
        UUID userId = extractUserId(authorization);
        return analyticsService.getUserPlaybackHistory(userId);
    }

    private UUID extractUserId(String authorization) {
        if (authorization == null || !authorization.startsWith("Bearer ")) {
            throw new RuntimeException("Missing Authorization header");
        }

        String token = authorization.substring(7);
        Claims claims = jwtTokenService.parseClaims(token);
        return UUID.fromString(claims.getSubject());
    }
}
