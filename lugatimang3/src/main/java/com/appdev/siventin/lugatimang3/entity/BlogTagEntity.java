package com.appdev.siventin.lugatimang3.entity;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.Objects;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Entity
@Table(name = "blog_tag")
public class BlogTagEntity {

    @EmbeddedId
    private BlogTagKey id;

    @jakarta.persistence.ManyToOne
    @jakarta.persistence.MapsId("blogId")
    @jakarta.persistence.JoinColumn(name = "blog_id")
    @com.fasterxml.jackson.annotation.JsonIgnore
    private BlogEntity blog;

    @jakarta.persistence.ManyToOne
    @jakarta.persistence.MapsId("tagId")
    @jakarta.persistence.JoinColumn(name = "tag_id")
    private TagEntity tag;

    @Column(name = "date_assigned")
    private LocalDateTime dateAssigned;

    public BlogTagEntity() {
        this.dateAssigned = LocalDateTime.now();
    }

    public BlogTagEntity(int blogId, int tagId) {
        this.id = new BlogTagKey(blogId, tagId);
        this.dateAssigned = LocalDateTime.now();
    }

    public BlogTagKey getId() {
        return id;
    }

    public void setId(BlogTagKey id) {
        this.id = id;
    }

    public LocalDateTime getDateAssigned() {
        return dateAssigned;
    }

    public void setDateAssigned(LocalDateTime dateAssigned) {
        this.dateAssigned = dateAssigned;
    }

    public BlogEntity getBlog() {
        return blog;
    }

    public void setBlog(BlogEntity blog) {
        this.blog = blog;
    }

    public TagEntity getTag() {
        return tag;
    }

    public void setTag(TagEntity tag) {
        this.tag = tag;
    }

    @Embeddable
    public static class BlogTagKey implements Serializable {
        @Column(name = "blog_id")
        private int blogId;

        @Column(name = "tag_id")
        private int tagId;

        public BlogTagKey() {
        }

        public BlogTagKey(int blogId, int tagId) {
            this.blogId = blogId;
            this.tagId = tagId;
        }

        public int getBlogId() {
            return blogId;
        }

        public void setBlogId(int blogId) {
            this.blogId = blogId;
        }

        public int getTagId() {
            return tagId;
        }

        public void setTagId(int tagId) {
            this.tagId = tagId;
        }

        @Override
        public boolean equals(Object o) {
            if (this == o)
                return true;
            if (o == null || getClass() != o.getClass())
                return false;
            BlogTagKey that = (BlogTagKey) o;
            return blogId == that.blogId && tagId == that.tagId;
        }

        @Override
        public int hashCode() {
            return Objects.hash(blogId, tagId);
        }
    }
}
