package com.beatflow.catalog.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Entity
@Table(name = "genres")
@Getter
@Setter
public class Genre {

    @Id
    private UUID id;

    @Column(nullable = false, unique = true)
    private String name;
}
