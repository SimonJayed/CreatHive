package com.appdev.siventin.lugatimang3.entity;

import java.io.Serializable;
import java.util.Objects;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Entity
@Table(name = "artwork_likes")
public class ArtworkLikesEntity {

    @EmbeddedId
    private ArtworkLikesKey id;

    public ArtworkLikesEntity() {
    }

    public ArtworkLikesEntity(int artworkId, int userId) {
        this.id = new ArtworkLikesKey(artworkId, userId);
    }

    public ArtworkLikesKey getId() {
        return id;
    }

    public void setId(ArtworkLikesKey id) {
        this.id = id;
    }

    @Embeddable
    public static class ArtworkLikesKey implements Serializable {
        @Column(name = "artwork_id")
        private int artworkId;

        @Column(name = "user_id")
        private int userId;

        public ArtworkLikesKey() {
        }

        public ArtworkLikesKey(int artworkId, int userId) {
            this.artworkId = artworkId;
            this.userId = userId;
        }

        public int getArtworkId() {
            return artworkId;
        }

        public void setArtworkId(int artworkId) {
            this.artworkId = artworkId;
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
            ArtworkLikesKey that = (ArtworkLikesKey) o;
            return artworkId == that.artworkId && userId == that.userId;
        }

        @Override
        public int hashCode() {
            return Objects.hash(artworkId, userId);
        }
    }
}
