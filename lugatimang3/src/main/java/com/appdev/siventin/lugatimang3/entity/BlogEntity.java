package com.appdev.siventin.lugatimang3.entity;

import java.sql.Date;

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
    private Date date_posted;

    public BlogEntity(){
        super();
    }
    public BlogEntity(int blogId, String title, String content, Date date_posted){
        super();
        this.blogId = blogId;
        this.title = title;
        this.content = content;
        this.date_posted = date_posted;
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
    public Date getDate_posted() {
        return date_posted;
    }

    public void setTitle(String title) {
        this.title = title;
    }
    public void setContent(String content) {
        this.content = content;
    }
}
