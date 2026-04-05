package com.beatflow.playback.controller;

import com.beatflow.playback.domain.PlaybackSession;
import com.beatflow.playback.dto.StartPlaybackResponse;
import com.beatflow.playback.service.MinioPlaybackService;
import com.beatflow.playback.service.PlaybackService;
import io.minio.StatObjectResponse;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.InputStream;
import java.util.UUID;

@RestController
@RequestMapping("/api/playback")
@RequiredArgsConstructor
public class PlaybackController {

    private final PlaybackService playbackService;
    private final MinioPlaybackService minioPlaybackService;

    @PostMapping("/start/{trackId}")
    public StartPlaybackResponse startPlayback(@RequestHeader(HttpHeaders.AUTHORIZATION) String authorization,
                                               @RequestHeader(value = "X-Device-Id", defaultValue = "web-browser") String deviceId,
                                               @PathVariable UUID trackId) {
        return playbackService.startPlayback(authorization, trackId, deviceId);
    }

    @GetMapping("/streams/{sessionId}")
    public ResponseEntity<byte[]> stream(@PathVariable UUID sessionId, HttpServletRequest request) {
        try {
            PlaybackSession session = playbackService.getActiveSession(sessionId);

            StatObjectResponse stat = minioPlaybackService.stat(session.getAudioKey());
            long fileSize = stat.size();

            String rangeHeader = request.getHeader(HttpHeaders.RANGE);

            if (rangeHeader == null || !rangeHeader.startsWith("bytes=")) {
                try (InputStream inputStream = minioPlaybackService.getObject(session.getAudioKey(), 0, fileSize)) {
                    byte[] data = inputStream.readAllBytes();

                    return ResponseEntity.ok()
                                         .header(HttpHeaders.CONTENT_TYPE, "audio/mpeg")
                                         .header(HttpHeaders.ACCEPT_RANGES, "bytes")
                                         .header(HttpHeaders.CONTENT_LENGTH, String.valueOf(fileSize))
                                         .body(data);
                }
            }

            String rangeValue = rangeHeader.substring("bytes=".length());
            String[] parts = rangeValue.split("-", 2);

            long start = Long.parseLong(parts[0]);
            long end = parts[1].isBlank() ? Math.min(start + 1024 * 1024 - 1, fileSize - 1) : Long.parseLong(parts[1]);

            if (end >= fileSize) {
                end = fileSize - 1;
            }

            long contentLength = end - start + 1;

            try (InputStream inputStream = minioPlaybackService.getObject(session.getAudioKey(),
                                                                          start,
                                                                          contentLength)) {
                byte[] data = inputStream.readAllBytes();

                return ResponseEntity.status(HttpStatus.PARTIAL_CONTENT)
                                     .header(HttpHeaders.CONTENT_TYPE, "audio/mpeg")
                                     .header(HttpHeaders.ACCEPT_RANGES, "bytes")
                                     .header(HttpHeaders.CONTENT_LENGTH, String.valueOf(contentLength))
                                     .header(HttpHeaders.CONTENT_RANGE, "bytes " + start + "-" + end + "/" + fileSize)
                                     .body(data);
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
    }
}
