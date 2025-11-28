package com.appdev.siventin.lugatimang3.entity;

import java.io.Serializable;
import java.util.Objects;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Entity
@Table(name = "comment_on_blog")
public class CommentOnBlogEntity {

    @EmbeddedId
    private CommentOnBlogKey id;

    public CommentOnBlogEntity() {
    }

    public CommentOnBlogEntity(int commentId, int blogId) {
        this.id = new CommentOnBlogKey(commentId, blogId);
    }

    public CommentOnBlogKey getId() {
        return id;
    }

    public void setId(CommentOnBlogKey id) {
        this.id = id;
    }

    @Embeddable
    public static class CommentOnBlogKey implements Serializable {
        @Column(name = "comment_id")
        private int commentId;

        @Column(name = "blog_id")
        private int blogId;

        public CommentOnBlogKey() {
        }

        public CommentOnBlogKey(int commentId, int blogId) {
            this.commentId = commentId;
            this.blogId = blogId;
        }

        public int getCommentId() {
            return commentId;
        }

        public void setCommentId(int commentId) {
            this.commentId = commentId;
        }

        public int getBlogId() {
            return blogId;
        }

        public void setBlogId(int blogId) {
            this.blogId = blogId;
        }

        @Override
        public boolean equals(Object o) {
            if (this == o)
                return true;
            if (o == null || getClass() != o.getClass())
                return false;
            CommentOnBlogKey that = (CommentOnBlogKey) o;
            return commentId == that.commentId && blogId == that.blogId;
        }

        @Override
        public int hashCode() {
            return Objects.hash(commentId, blogId);
        }
    }
}
