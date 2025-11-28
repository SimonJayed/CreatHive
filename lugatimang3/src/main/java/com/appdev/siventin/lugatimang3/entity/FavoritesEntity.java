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
@Table(name = "favorites")
public class FavoritesEntity {

    @EmbeddedId
    private FavoritesKey id;

    @Column(name = "date_favorited")
    private LocalDateTime dateFavorited;

    public FavoritesEntity() {
        this.dateFavorited = LocalDateTime.now();
    }

    public FavoritesEntity(int artworkId, int artistId) {
        this.id = new FavoritesKey(artworkId, artistId);
        this.dateFavorited = LocalDateTime.now();
    }

    public FavoritesKey getId() {
        return id;
    }

    public void setId(FavoritesKey id) {
        this.id = id;
    }

    public LocalDateTime getDateFavorited() {
        return dateFavorited;
    }

    public void setDateFavorited(LocalDateTime dateFavorited) {
        this.dateFavorited = dateFavorited;
    }

    @Embeddable
    public static class FavoritesKey implements Serializable {
        @Column(name = "artwork_id")
        private int artworkId;

        @Column(name = "artist_id")
        private int artistId;

        public FavoritesKey() {
        }

        public FavoritesKey(int artworkId, int artistId) {
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
            FavoritesKey that = (FavoritesKey) o;
            return artworkId == that.artworkId && artistId == that.artistId;
        }

        @Override
        public int hashCode() {
            return Objects.hash(artworkId, artistId);
        }
    }
}
