package com.beatflow.catalog.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.UUID;

@Getter
@AllArgsConstructor
public class TrackPlaybackResponse {
    private UUID id;
    private String title;
    private Integer durationSeconds;
    private String audioKey;
}
