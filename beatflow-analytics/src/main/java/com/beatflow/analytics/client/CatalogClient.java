package com.beatflow.analytics.client;

import com.beatflow.analytics.config.CatalogProperties;
import com.beatflow.analytics.dto.TrackSummaryResponse;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import java.util.Collections;
import java.util.List;
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

    public List<TrackSummaryResponse> getTracksByIds(List<UUID> trackIds) {
        if (trackIds == null || trackIds.isEmpty()) {
            return Collections.emptyList();
        }

        List<TrackSummaryResponse> response = restClient.post()
                                                        .uri("/api/tracks/internal/by-ids")
                                                        .body(trackIds)
                                                        .retrieve()
                                                        .body(new ParameterizedTypeReference<>() {
                                                        });

        return response != null ? response : Collections.emptyList();
    }
}
