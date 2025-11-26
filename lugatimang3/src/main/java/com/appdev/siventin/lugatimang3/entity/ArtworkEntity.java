package com.appdev.siventin.lugatimang3.entity;

import java.time.LocalDateTime;

import jakarta.persistence.*;

@Entity
@Table(name = "artwork")

public class ArtworkEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int artworkId;

    private String title;
    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String image; // Base64 string
    private String description;
    private LocalDateTime creationDate;
    private String category;
    private String tags;
    private String visibility;
    private int artistId; // Link to the artist

    public ArtworkEntity() {
    }

    public ArtworkEntity(int artworkId, String title, String image, String description, LocalDateTime creationDate,
            String category, String tags, String visibility, int artistId) {
        super();
        this.artworkId = artworkId;
        this.title = title;
        this.image = image;
        this.description = description;
        this.creationDate = creationDate;
        this.category = category;
        this.tags = tags;
        this.visibility = visibility;
        this.artistId = artistId;
    }

    public int getArtworkId() {
        return artworkId;
    }

    public String getTitle() {
        return title;
    }

    public String getImage() {
        return image;
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

    public String getTags() {
        return tags;
    }

    public String getVisibility() {
        return visibility;
    }

    public int getArtistId() {
        return artistId;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public void setImage(String image) {
        this.image = image;
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

    public void setTags(String tags) {
        this.tags = tags;
    }

    public void setVisibility(String visibility) {
        this.visibility = visibility;
    }

    public void setArtistId(int artistId) {
        this.artistId = artistId;
    }
}
