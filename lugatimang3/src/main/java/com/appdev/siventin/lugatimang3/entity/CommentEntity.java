package com.appdev.siventin.lugatimang3.entity;

import java.time.LocalDateTime;

import jakarta.persistence.*;

@Entity
@Table(name = "comment")

public class CommentEntity {

    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    private int commentId;

    private String content;
    private LocalDateTime datePosted;

    public CommentEntity() {
    }

    public CommentEntity(int commentId, String content, LocalDateTime datePosted) {
        super();
        this.commentId = commentId;
        this.content = content;
        this.datePosted = datePosted;
    }

    public int getCommentId() {
        return commentId;
    }

    public String getContent() {
        return content;
    }

    public LocalDateTime getDatePosted() {
        return datePosted;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public void setDatePosted(LocalDateTime datePosted) {
        this.datePosted = datePosted;
    }

}
