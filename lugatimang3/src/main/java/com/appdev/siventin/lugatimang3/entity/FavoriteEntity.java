package com.appdev.siventin.lugatimang3.entity;

import java.time.LocalDateTime;

import jakarta.persistence.*;

@Entity
@IdClass(FavoriteId.class)
@Table(name = "favorite")
public class FavoriteEntity {

    @Id
    @ManyToOne
    @JoinColumn(name = "artistId")
    private ArtistEntity artist;

    @Id
    @ManyToOne
    @JoinColumn(name = "artworkId")
    private ArtworkEntity artwork;

    private LocalDateTime dateFavorited;

    public FavoriteEntity() {
    }

    public FavoriteEntity(ArtistEntity artist, ArtworkEntity artwork, LocalDateTime dateFavorited) {
        this.artist = artist;
        this.artwork = artwork;
        this.dateFavorited = dateFavorited;
    }

    public ArtistEntity getArtist() {
        return artist;
    }

    public ArtworkEntity getArtwork() {
        return artwork;
    }

    public LocalDateTime getDateFavorited() {
        return dateFavorited;
    }

    public void setArtist(ArtistEntity artist) {
        this.artist = artist;
    }

    public void setArtwork(ArtworkEntity artwork) {
        this.artwork = artwork;
    }

    public void setDateFavorited(LocalDateTime dateFavorited) {
        this.dateFavorited = dateFavorited;
    }
}
