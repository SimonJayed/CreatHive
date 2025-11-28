package com.appdev.siventin.lugatimang3.entity;

import java.io.Serializable;
import java.util.Objects;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Entity
@Table(name = "comment_on_artwork")
public class CommentOnArtworkEntity {

    @EmbeddedId
    private CommentOnArtworkKey id;

    public CommentOnArtworkEntity() {
    }

    public CommentOnArtworkEntity(int commentId, int artworkId) {
        this.id = new CommentOnArtworkKey(commentId, artworkId);
    }

    public CommentOnArtworkKey getId() {
        return id;
    }

    public void setId(CommentOnArtworkKey id) {
        this.id = id;
    }

    @Embeddable
    public static class CommentOnArtworkKey implements Serializable {
        @Column(name = "comment_id")
        private int commentId;

        @Column(name = "artwork_id")
        private int artworkId;

        public CommentOnArtworkKey() {
        }

        public CommentOnArtworkKey(int commentId, int artworkId) {
            this.commentId = commentId;
            this.artworkId = artworkId;
        }

        public int getCommentId() {
            return commentId;
        }

        public void setCommentId(int commentId) {
            this.commentId = commentId;
        }

        public int getArtworkId() {
            return artworkId;
        }

        public void setArtworkId(int artworkId) {
            this.artworkId = artworkId;
        }

        @Override
        public boolean equals(Object o) {
            if (this == o)
                return true;
            if (o == null || getClass() != o.getClass())
                return false;
            CommentOnArtworkKey that = (CommentOnArtworkKey) o;
            return commentId == that.commentId && artworkId == that.artworkId;
        }

        @Override
        public int hashCode() {
            return Objects.hash(commentId, artworkId);
        }
    }
}
