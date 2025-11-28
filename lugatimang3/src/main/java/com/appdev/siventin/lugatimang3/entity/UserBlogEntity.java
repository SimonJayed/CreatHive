package com.appdev.siventin.lugatimang3.entity;

import java.io.Serializable;
import java.util.Objects;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Entity
@Table(name = "user_blog")
public class UserBlogEntity {

    @EmbeddedId
    private UserBlogKey id;

    public UserBlogEntity() {
    }

    public UserBlogEntity(int blogId, int userId) {
        this.id = new UserBlogKey(blogId, userId);
    }

    public UserBlogKey getId() {
        return id;
    }

    public void setId(UserBlogKey id) {
        this.id = id;
    }

    @Embeddable
    public static class UserBlogKey implements Serializable {
        @Column(name = "blog_id")
        private int blogId;

        @Column(name = "user_id")
        private int userId;

        public UserBlogKey() {
        }

        public UserBlogKey(int blogId, int userId) {
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
            UserBlogKey that = (UserBlogKey) o;
            return blogId == that.blogId && userId == that.userId;
        }

        @Override
        public int hashCode() {
            return Objects.hash(blogId, userId);
        }
    }
}
