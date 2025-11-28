package com.appdev.siventin.lugatimang3.entity;

import java.io.Serializable;
import java.util.Objects;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Entity
@Table(name = "user_comment")
public class UserCommentEntity {

    @EmbeddedId
    private UserCommentKey id;

    public UserCommentEntity() {
    }

    public UserCommentEntity(int artistId, int commentId) {
        this.id = new UserCommentKey(artistId, commentId);
    }

    public UserCommentKey getId() {
        return id;
    }

    public void setId(UserCommentKey id) {
        this.id = id;
    }

    @Embeddable
    public static class UserCommentKey implements Serializable {
        @Column(name = "artist_id")
        private int artistId;

        @Column(name = "comment_id")
        private int commentId;

        public UserCommentKey() {
        }

        public UserCommentKey(int artistId, int commentId) {
            this.artistId = artistId;
            this.commentId = commentId;
        }

        public int getArtistId() {
            return artistId;
        }

        public void setArtistId(int artistId) {
            this.artistId = artistId;
        }

        public int getCommentId() {
            return commentId;
        }

        public void setCommentId(int commentId) {
            this.commentId = commentId;
        }

        @Override
        public boolean equals(Object o) {
            if (this == o)
                return true;
            if (o == null || getClass() != o.getClass())
                return false;
            UserCommentKey that = (UserCommentKey) o;
            return artistId == that.artistId && commentId == that.commentId;
        }

        @Override
        public int hashCode() {
            return Objects.hash(artistId, commentId);
        }
    }
}
