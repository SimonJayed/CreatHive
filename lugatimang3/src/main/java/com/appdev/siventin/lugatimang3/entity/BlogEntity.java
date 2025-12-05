package com.appdev.siventin.lugatimang3.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "blog")
public class BlogEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int blogId;

    @Column(name = "title")
    private String title;

    @Column(name = "content")
    private String content;

    @Column(name = "date_posted")
    private java.sql.Timestamp datePosted;

    public BlogEntity() {
        super();
    }

    public BlogEntity(int blogId, String title, String content, java.sql.Timestamp datePosted) {
        super();
        this.blogId = blogId;
        this.title = title;
        this.content = content;
        this.datePosted = datePosted;
    }

    public int getBlogId() {
        return blogId;
    }

    public String getTitle() {
        return title;
    }

    public String getContent() {
        return content;
    }

    public java.sql.Timestamp getDatePosted() {
        return datePosted;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public void setDatePosted(java.sql.Timestamp datePosted) {
        this.datePosted = datePosted;
    }

    @Column(name = "like_count")
    private Integer likeCount = 0;

    public Integer getLikeCount() {
        return likeCount;
    }

    public void setLikeCount(Integer likeCount) {
        this.likeCount = likeCount;
    }

    @jakarta.persistence.Transient
    private boolean isLiked;

    public boolean getIsLiked() {
        return isLiked;
    }

    public void setIsLiked(boolean isLiked) {
        this.isLiked = isLiked;
    }
}
