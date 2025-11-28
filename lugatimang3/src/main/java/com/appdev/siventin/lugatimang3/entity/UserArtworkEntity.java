package com.appdev.siventin.lugatimang3.entity;

import java.io.Serializable;
import java.util.Objects;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Entity
@Table(name = "user_artwork")
public class UserArtworkEntity {

    @EmbeddedId
    private UserArtworkKey id;

    public UserArtworkEntity() {
    }

    public UserArtworkEntity(int artworkId, int artistId) {
        this.id = new UserArtworkKey(artworkId, artistId);
    }

    public UserArtworkKey getId() {
        return id;
    }

    public void setId(UserArtworkKey id) {
        this.id = id;
    }

    @Embeddable
    public static class UserArtworkKey implements Serializable {
        @Column(name = "artwork_id")
        private int artworkId;

        @Column(name = "artist_id")
        private int artistId;

        public UserArtworkKey() {
        }

        public UserArtworkKey(int artworkId, int artistId) {
            this.artworkId = artworkId;
            this.artistId = artistId;
        }

        public int getArtworkId() {
            return artworkId;
        }

        public void setArtworkId(int artworkId) {
            this.artworkId = artworkId;
        }

        public int getArtistId() {
            return artistId;
        }

        public void setArtistId(int artistId) {
            this.artistId = artistId;
        }

        @Override
        public boolean equals(Object o) {
            if (this == o)
                return true;
            if (o == null || getClass() != o.getClass())
                return false;
            UserArtworkKey that = (UserArtworkKey) o;
            return artworkId == that.artworkId && artistId == that.artistId;
        }

        @Override
        public int hashCode() {
            return Objects.hash(artworkId, artistId);
        }
    }
}
