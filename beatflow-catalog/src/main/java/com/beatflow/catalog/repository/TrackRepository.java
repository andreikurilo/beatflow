package com.beatflow.catalog.repository;

import com.beatflow.catalog.domain.Track;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface TrackRepository extends JpaRepository<Track, UUID> {
}