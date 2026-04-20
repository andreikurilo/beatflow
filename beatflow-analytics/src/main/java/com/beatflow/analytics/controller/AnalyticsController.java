package com.beatflow.analytics.controller;

import com.beatflow.analytics.dto.PlaybackHistoryResponse;
import com.beatflow.analytics.service.AnalyticsService;
import com.beatflow.common.security.JwtTokenService;
import io.jsonwebtoken.Claims;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/analytics")
@RequiredArgsConstructor
public class AnalyticsController {

    private final AnalyticsService analyticsService;
    private final JwtTokenService jwtTokenService;

    @GetMapping("/me/history")
    public Page<PlaybackHistoryResponse> getMyPlaybackHistory(@RequestHeader(HttpHeaders.AUTHORIZATION) String authorization,
                                                              @PageableDefault(size = 20, sort = "startedAt", direction = Sort.Direction.DESC) Pageable pageable) {
        UUID userId = extractUserId(authorization);
        return analyticsService.getUserPlaybackHistory(userId, pageable);
    }

    private UUID extractUserId(String authorization) {
        if (authorization == null || !authorization.startsWith("Bearer ")) {
            throw new BadCredentialsException("Missing Authorization header");
        }

        String token = authorization.substring(7);
        Claims claims = jwtTokenService.parseClaims(token);
        return UUID.fromString(claims.getSubject());
    }
}
