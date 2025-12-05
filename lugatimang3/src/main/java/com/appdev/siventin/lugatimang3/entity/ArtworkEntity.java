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

    @Column(name = "is_archived")
    private Boolean isArchived = false;

    @OneToMany(mappedBy = "artwork", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ArtworkTagEntity> artworkTags;

    @Transient
    private boolean isLiked;

    @Transient
    private List<TagEntity> displayTags;

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
        this.isArchived = false;
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

    public Boolean isArchived() {
        return isArchived;
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

    public void setArchived(Boolean isArchived) {
        this.isArchived = isArchived;
    }

    public List<ArtworkTagEntity> getArtworkTags() {
        return artworkTags;
    }

    public void setArtworkTags(List<ArtworkTagEntity> artworkTags) {
        this.artworkTags = artworkTags;
    }

    public boolean getIsLiked() {
        return isLiked;
    }

    public void setIsLiked(boolean isLiked) {
        this.isLiked = isLiked;
    }

    public List<TagEntity> getDisplayTags() {
        return displayTags;
    }

    public void setDisplayTags(List<TagEntity> displayTags) {
        this.displayTags = displayTags;
    }
}
