package com.beatflow.catalog.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Entity
@Table(name = "artists")
@Getter
@Setter
public class Artist {

    @Id
    private UUID id;

    @Column(nullable = false)
    private String name;
}