package com.beatflow.playback.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.UUID;

@Getter
@AllArgsConstructor
public class StartPlaybackResponse {
    private UUID sessionId;
    private String streamUrl;
}
