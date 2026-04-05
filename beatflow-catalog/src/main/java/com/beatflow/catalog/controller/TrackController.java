package com.beatflow.catalog.controller;

import com.beatflow.catalog.dto.TrackPlaybackResponse;
import com.beatflow.catalog.dto.TrackResponse;
import com.beatflow.catalog.service.TrackService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/tracks")
@RequiredArgsConstructor
public class TrackController {

    private final TrackService trackService;

    @Value("${internal.api-key}")
    private String internalApiKey;

    @GetMapping
    public List<TrackResponse> getAllTracks() {
        return trackService.getAllTracks();
    }

    @GetMapping("/{id}")
    public TrackResponse getTrackById(@PathVariable UUID id) {
        return trackService.getTrackById(id);
    }

    @GetMapping("/{id}/playback")
    public TrackPlaybackResponse getTrackPlaybackById(@PathVariable UUID id,
                                                      @RequestHeader("X-Internal-Api-Key") String apiKey) {
        if (!internalApiKey.equals(apiKey)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Forbidden");
        }

        return trackService.getTrackPlaybackById(id);
    }
}
