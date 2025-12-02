package com.appdev.siventin.lugatimang3.entity;

import java.io.Serializable;
import java.util.Objects;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Entity
@Table(name = "blog_likes")
public class BlogLikesEntity {

    @EmbeddedId
    private BlogLikesKey id;

    public BlogLikesEntity() {
    }

    public BlogLikesEntity(int blogId, int userId) {
        this.id = new BlogLikesKey(blogId, userId);
    }

    public BlogLikesKey getId() {
        return id;
    }

    public void setId(BlogLikesKey id) {
        this.id = id;
    }

    @Embeddable
    public static class BlogLikesKey implements Serializable {
        @Column(name = "blog_id")
        private int blogId;

        @Column(name = "user_id")
        private int userId;

        public BlogLikesKey() {
        }

        public BlogLikesKey(int blogId, int userId) {
            this.blogId = blogId;
            this.userId = userId;
        }

        public int getBlogId() {
            return blogId;
        }

        public void setBlogId(int blogId) {
            this.blogId = blogId;
        }

        public int getUserId() {
            return userId;
        }

        public void setUserId(int userId) {
            this.userId = userId;
        }

        @Override
        public boolean equals(Object o) {
            if (this == o)
                return true;
            if (o == null || getClass() != o.getClass())
                return false;
            BlogLikesKey that = (BlogLikesKey) o;
            return blogId == that.blogId && userId == that.userId;
        }

        @Override
        public int hashCode() {
            return Objects.hash(blogId, userId);
        }
    }
}
