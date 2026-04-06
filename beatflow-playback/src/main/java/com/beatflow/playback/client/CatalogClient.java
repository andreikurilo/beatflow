package com.beatflow.playback.client;

import com.beatflow.playback.config.CatalogProperties;
import com.beatflow.playback.dto.TrackPlaybackResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import java.util.UUID;

@Component
public class CatalogClient {

    private final RestClient restClient;

    public CatalogClient(CatalogProperties catalogProperties) {
        this.restClient = RestClient.builder()
                                    .baseUrl(catalogProperties.getBaseUrl())
                                    .defaultHeader("X-Internal-Api-Key", catalogProperties.getInternalApiKey())
                                    .build();
    }

    public TrackPlaybackResponse getTrackPlayback(UUID trackId) {
        return restClient.get().uri("/api/tracks/{id}/playback", trackId).retrieve().body(TrackPlaybackResponse.class);
    }
}
