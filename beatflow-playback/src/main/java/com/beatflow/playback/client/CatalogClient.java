package com.beatflow.playback.client;

import com.beatflow.playback.config.CatalogProperties;
import com.beatflow.playback.dto.TrackPlaybackResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import java.util.UUID;

@Component
@RequiredArgsConstructor
public class CatalogClient {

    private final CatalogProperties catalogProperties;

    public TrackPlaybackResponse getTrackPlayback(UUID trackId) {
        RestClient client = RestClient.builder()
                                      .baseUrl(catalogProperties.getBaseUrl())
                                      .defaultHeader("X-Internal-Api-Key", catalogProperties.getInternalApiKey())
                                      .build();

        return client.get().uri("/api/tracks/{id}/playback", trackId).retrieve().body(TrackPlaybackResponse.class);
    }
}
