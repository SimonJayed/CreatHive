package com.appdev.siventin.lugatimang3.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "tag")
public class TagEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int tagId;

    @Column(name = "name")
    private String name;

    @Column(name = "description")
    private String description;

    public TagEntity() {
    }

    public TagEntity(int tagId, String name, String description) {
        super();
        this.tagId = tagId;
        this.name = name;
        this.description = description;
    }

    public int getTagId() {
        return tagId;
    }

    public String getName() {
        return name;
    }

    public String getDescription() {
        return description;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    @jakarta.persistence.Transient
    private int submissionCount;

    @jakarta.persistence.Transient
    private boolean isLiked;

    @jakarta.persistence.Transient
    private String firstArtworkImage;

    public int getSubmissionCount() {
        return submissionCount;
    }

    public void setSubmissionCount(int submissionCount) {
        this.submissionCount = submissionCount;
    }

    public boolean isLiked() {
        return isLiked;
    }

    public void setLiked(boolean liked) {
        isLiked = liked;
    }

    public String getFirstArtworkImage() {
        return firstArtworkImage;
    }

    public void setFirstArtworkImage(String firstArtworkImage) {
        this.firstArtworkImage = firstArtworkImage;
    }
}
