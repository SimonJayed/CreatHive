package com.appdev.siventin.lugatimang3.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "comment")
public class CommentEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int commentId;

    @Column(name = "content", columnDefinition = "TEXT")
    private String content;

    @jakarta.persistence.ManyToOne
    @jakarta.persistence.JoinColumn(name = "artist_id")
    private ArtistEntity author;

    public ArtistEntity getAuthor() {
        return author;
    }

    public void setAuthor(ArtistEntity author) {
        this.author = author;
    }

    @jakarta.persistence.ManyToOne
    @jakarta.persistence.JoinColumn(name = "blog_id")
    @com.fasterxml.jackson.annotation.JsonIgnoreProperties("comments")
    private BlogEntity blog;

    @jakarta.persistence.ManyToOne
    @jakarta.persistence.JoinColumn(name = "artwork_id")
    @com.fasterxml.jackson.annotation.JsonIgnoreProperties("comments")
    private ArtworkEntity artwork;

    public BlogEntity getBlog() {
        return blog;
    }

    public void setBlog(BlogEntity blog) {
        this.blog = blog;
    }

    public ArtworkEntity getArtwork() {
        return artwork;
    }

    public void setArtwork(ArtworkEntity artwork) {
        this.artwork = artwork;
    }

    @Column(name = "date_posted")
    private LocalDateTime datePosted;

    public CommentEntity() {
        super();
        this.datePosted = LocalDateTime.now();
    }

    public CommentEntity(int commentId, String content) {
        super();
        this.commentId = commentId;
        this.content = content;
        this.datePosted = LocalDateTime.now();
    }

    public int getCommentId() {
        return commentId;
    }

    public void setCommentId(int commentId) {
        this.commentId = commentId;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public LocalDateTime getDatePosted() {
        return datePosted;
    }

    public void setDatePosted(LocalDateTime datePosted) {
        this.datePosted = datePosted;
    }
}
