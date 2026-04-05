package com.beatflow.catalog.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

@Entity
@Table(name = "tracks")
@Getter
@Setter
public class Track {

    @Id
    private UUID id;

    @Column(nullable = false)
    private String title;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "album_id", nullable = false)
    private Album album;

    @Column(nullable = false, name = "duration_seconds")
    private Integer durationSeconds;

    @Column(name = "audio_url")
    private String audioUrl;

    @Column(name = "license_source")
    private String licenseSource;

    @Column(name = "license_url")
    private String licenseUrl;

    @Column(name = "source_url")
    private String sourceUrl;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(name = "track_genres", joinColumns = @JoinColumn(name = "track_id"), inverseJoinColumns = @JoinColumn(name = "genre_id"))
    private Set<Genre> genres = new HashSet<>();
}
