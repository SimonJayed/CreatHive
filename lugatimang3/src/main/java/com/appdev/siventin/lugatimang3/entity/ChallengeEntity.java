package com.appdev.siventin.lugatimang3.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "challenge")
public class ChallengeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int challengeId;

    @Column(nullable = false)
    private String theme;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "start_date")
    private LocalDateTime startDate;

    @Column(name = "end_date")
    private LocalDateTime endDate;

    @Column(name = "is_active")
    private boolean isActive;

    @Column(name = "tags")
    private String tags; // JSON or comma-separated tags required for the challenge

    // Bidirectional relationship: One challenge has many artworks
    @OneToMany(mappedBy = "challenge")
    private List<ArtworkEntity> artworks;

    public ChallengeEntity() {
        super();
    }

    public ChallengeEntity(String theme, String description, LocalDateTime startDate, LocalDateTime endDate,
            String tags) {
        this.theme = theme;
        this.description = description;
        this.startDate = startDate;
        this.endDate = endDate;
        this.tags = tags;
        this.isActive = true;
    }

    public int getChallengeId() {
        return challengeId;
    }

    public void setChallengeId(int challengeId) {
        this.challengeId = challengeId;
    }

    public String getTheme() {
        return theme;
    }

    public void setTheme(String theme) {
        this.theme = theme;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public LocalDateTime getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDateTime startDate) {
        this.startDate = startDate;
    }

    public LocalDateTime getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDateTime endDate) {
        this.endDate = endDate;
    }

    public boolean isActive() {
        return isActive;
    }

    public void setActive(boolean active) {
        isActive = active;
    }

    public String getTags() {
        return tags;
    }

    public void setTags(String tags) {
        this.tags = tags;
    }

    public List<ArtworkEntity> getArtworks() {
        return artworks;
    }

    public void setArtworks(List<ArtworkEntity> artworks) {
        this.artworks = artworks;
    }
}
