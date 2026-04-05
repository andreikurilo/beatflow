package com.beatflow.playback.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Getter
@Setter
@Configuration
@ConfigurationProperties(prefix = "catalog")
public class CatalogProperties {
    private String baseUrl;
    private String internalApiKey;
}
