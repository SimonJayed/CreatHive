package com.appdev.siventin.lugatimang3.entity;

import java.time.LocalDateTime;

import jakarta.persistence.*;

@Entity
@Table(name = "artwork")

public class ArtworkEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)

    private int artworkId;
    private String description;
    private LocalDateTime creationDate;
    private String category;

    public ArtworkEntity() {
    }

    public ArtworkEntity(int artworkId, String description, LocalDateTime creationDate, String category) {
        super();
        this.artworkId = artworkId;
        this.description = description;
        this.creationDate = creationDate;
        this.category = category;
    }

    public int geArtworkId() {
        return artworkId;
    }

    public String getDescription() {
        return description;
    }

    public LocalDateTime getCreationDate() {
        return creationDate;
    }

    public String getCategory() {
        return category;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setCreationDate(LocalDateTime creationDate) {
        this.creationDate = creationDate;
    }

    public void setCategory(String category) {
        this.category = category;
    }

}
