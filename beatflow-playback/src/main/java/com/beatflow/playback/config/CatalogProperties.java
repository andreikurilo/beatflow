package com.beatflow.playback.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "catalog")
@Getter
@Setter
public class CatalogProperties {
    private String baseUrl;
    private String internalApiKey;
}
