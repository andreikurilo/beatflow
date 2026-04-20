package com.beatflow.catalog.service;

import com.beatflow.catalog.domain.Album;
import com.beatflow.catalog.domain.Artist;
import com.beatflow.catalog.domain.Genre;
import com.beatflow.catalog.domain.Track;
import com.beatflow.catalog.dto.TrackPlaybackResponse;
import com.beatflow.catalog.dto.TrackResponse;
import com.beatflow.catalog.dto.TrackSummaryResponse;
import com.beatflow.catalog.repository.TrackRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class TrackServiceTest {

    @Mock
    private TrackRepository trackRepository;

    @InjectMocks
    private TrackService trackService;

    @Test
    void getTracksByIds_shouldReturnEmptyList_whenIdsNull() {
        List<TrackSummaryResponse> result = trackService.getTracksByIds(null);
        assertThat(result).isEmpty();
    }

    @Test
    void getTracksByIds_shouldReturnEmptyList_whenIdsEmpty() {
        List<TrackSummaryResponse> result = trackService.getTracksByIds(List.of());
        assertThat(result).isEmpty();
    }

    @Test
    void getTracksByIds_shouldReturnMappedSummaries() {
        Track track = createTrack();

        when(trackRepository.findAllById(List.of(track.getId()))).thenReturn(List.of(track));

        List<TrackSummaryResponse> result = trackService.getTracksByIds(List.of(track.getId()));

        assertThat(result).hasSize(1);
        TrackSummaryResponse item = result.getFirst();
        assertThat(item.id()).isEqualTo(track.getId());
        assertThat(item.title()).isEqualTo("Track Title");
        assertThat(item.artistName()).isEqualTo("Artist Name");
        assertThat(item.albumTitle()).isEqualTo("Album Title");
    }

    @Test
    void getAllTracks_shouldReturnMappedTracks() {
        Track track = createTrack();

        when(trackRepository.findAll()).thenReturn(List.of(track));

        List<TrackResponse> result = trackService.getAllTracks();

        assertThat(result).hasSize(1);
        TrackResponse item = result.getFirst();
        assertThat(item.getId()).isEqualTo(track.getId());
        assertThat(item.getTitle()).isEqualTo("Track Title");
        assertThat(item.getDurationSeconds()).isEqualTo(210);
        assertThat(item.getAlbumId()).isEqualTo(track.getAlbum().getId());
        assertThat(item.getAlbumTitle()).isEqualTo("Album Title");
        assertThat(item.getArtistId()).isEqualTo(track.getAlbum().getArtist().getId());
        assertThat(item.getArtistName()).isEqualTo("Artist Name");
        assertThat(item.getGenres()).containsExactlyInAnyOrder("House", "Electronic");
    }

    @Test
    void getTrackById_shouldReturnMappedTrack() {
        Track track = createTrack();

        when(trackRepository.findById(track.getId())).thenReturn(Optional.of(track));

        TrackResponse result = trackService.getTrackById(track.getId());

        assertThat(result.getId()).isEqualTo(track.getId());
        assertThat(result.getTitle()).isEqualTo("Track Title");
        assertThat(result.getDurationSeconds()).isEqualTo(210);
        assertThat(result.getAlbumId()).isEqualTo(track.getAlbum().getId());
        assertThat(result.getAlbumTitle()).isEqualTo("Album Title");
        assertThat(result.getArtistId()).isEqualTo(track.getAlbum().getArtist().getId());
        assertThat(result.getArtistName()).isEqualTo("Artist Name");
        assertThat(result.getGenres()).containsExactlyInAnyOrder("House", "Electronic");
    }

    @Test
    void getTrackById_shouldThrow_whenTrackMissing() {
        UUID trackId = UUID.randomUUID();
        when(trackRepository.findById(trackId)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> trackService.getTrackById(trackId)).isInstanceOf(RuntimeException.class)
                                                                    .hasMessage("Track not found");
    }

    @Test
    void getTrackPlaybackById_shouldReturnMappedPlaybackResponse() {
        Track track = createTrack();

        when(trackRepository.findById(track.getId())).thenReturn(Optional.of(track));

        TrackPlaybackResponse result = trackService.getTrackPlaybackById(track.getId());

        assertThat(result.getId()).isEqualTo(track.getId());
        assertThat(result.getTitle()).isEqualTo("Track Title");
        assertThat(result.getDurationSeconds()).isEqualTo(210);
        assertThat(result.getAudioKey()).isEqualTo("tracks/test.mp3");
    }

    @Test
    void getTrackPlaybackById_shouldThrow_whenTrackMissing() {
        UUID trackId = UUID.randomUUID();
        when(trackRepository.findById(trackId)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> trackService.getTrackPlaybackById(trackId)).isInstanceOf(RuntimeException.class)
                                                                            .hasMessage("Track not found");
    }

    private Track createTrack() {
        Artist artist = new Artist();
        artist.setId(UUID.randomUUID());
        artist.setName("Artist Name");

        Album album = new Album();
        album.setId(UUID.randomUUID());
        album.setTitle("Album Title");
        album.setArtist(artist);

        Genre genre1 = new Genre();
        genre1.setId(UUID.randomUUID());
        genre1.setName("House");

        Genre genre2 = new Genre();
        genre2.setId(UUID.randomUUID());
        genre2.setName("Electronic");

        Track track = new Track();
        track.setId(UUID.randomUUID());
        track.setTitle("Track Title");
        track.setDurationSeconds(210);
        track.setAlbum(album);
        track.setGenres(Set.of(genre1, genre2));
        track.setAudioUrl("tracks/test.mp3");

        return track;
    }
}
