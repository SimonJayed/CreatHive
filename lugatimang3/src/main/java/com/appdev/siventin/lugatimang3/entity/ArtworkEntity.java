package com.appdev.siventin.lugatimang3.entity;

import java.time.LocalDateTime;
import java.util.List;

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
    private String tags;

    @Column(name = "like_count")
    private Integer likeCount = 0;

    @OneToMany(mappedBy = "artwork", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ArtworkTagEntity> artworkTags;

    public ArtworkEntity() {
    }

    public ArtworkEntity(int artworkId, String title, String image, String description, LocalDateTime creationDate,
            String tags) {
        super();
        this.artworkId = artworkId;
        this.title = title;
        this.image = image;
        this.description = description;
        this.creationDate = creationDate;
        this.tags = tags;
        this.likeCount = 0;
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

    public String getTags() {
        return tags;
    }

    public Integer getLikeCount() {
        return likeCount;
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

    public void setTags(String tags) {
        this.tags = tags;
    }

    public void setLikeCount(Integer likeCount) {
        this.likeCount = likeCount;
    }

    public List<ArtworkTagEntity> getArtworkTags() {
        return artworkTags;
    }

    public void setArtworkTags(List<ArtworkTagEntity> artworkTags) {
        this.artworkTags = artworkTags;
    }
}
