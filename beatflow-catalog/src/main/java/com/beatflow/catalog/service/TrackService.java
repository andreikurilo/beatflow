package com.beatflow.catalog.service;

import com.beatflow.catalog.domain.Genre;
import com.beatflow.catalog.domain.Track;
import com.beatflow.catalog.dto.TrackPlaybackResponse;
import com.beatflow.catalog.dto.TrackResponse;
import com.beatflow.catalog.repository.TrackRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class TrackService {

    private final TrackRepository trackRepository;

    public List<TrackResponse> getAllTracks() {
        return trackRepository.findAll().stream().map(this::toResponse).toList();
    }

    public TrackResponse getTrackById(UUID id) {
        Track track = trackRepository.findById(id).orElseThrow(() -> new RuntimeException("Track not found"));

        return toResponse(track);
    }

    public TrackPlaybackResponse getTrackPlaybackById(UUID id) {
        Track track = trackRepository.findById(id).orElseThrow(() -> new RuntimeException("Track not found"));

        return toPlaybackResponse(track);
    }

    private TrackResponse toResponse(Track track) {
        return new TrackResponse(track.getId(),
                                 track.getTitle(),
                                 track.getDurationSeconds(),
                                 track.getAlbum().getId(),
                                 track.getAlbum().getTitle(),
                                 track.getAlbum().getArtist().getId(),
                                 track.getAlbum().getArtist().getName(),
                                 track.getGenres().stream().map(Genre::getName).toList());
    }

    private TrackPlaybackResponse toPlaybackResponse(Track track) {
        return new TrackPlaybackResponse(track.getId(),
                                         track.getTitle(),
                                         track.getDurationSeconds(),
                                         track.getAudioUrl());
    }
}
