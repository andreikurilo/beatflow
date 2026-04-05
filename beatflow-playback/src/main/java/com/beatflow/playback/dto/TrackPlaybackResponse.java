package com.beatflow.playback.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
public class TrackPlaybackResponse {
    private UUID id;
    private String title;
    private Integer durationSeconds;
    private String audioKey;
}
