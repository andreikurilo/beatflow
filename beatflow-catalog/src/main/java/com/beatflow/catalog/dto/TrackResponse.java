package com.beatflow.catalog.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.List;
import java.util.UUID;

@Getter
@AllArgsConstructor
public class TrackResponse {
    private UUID id;
    private String title;
    private Integer durationSeconds;

    private UUID albumId;
    private String albumTitle;

    private UUID artistId;
    private String artistName;

    private List<String> genres;
}
