package com.appdev.siventin.lugatimang3.entity;

import java.io.Serializable;
import java.util.Objects;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Entity
@Table(name = "artist_interest")
public class ArtistInterestEntity {

    @EmbeddedId
    private ArtistInterestKey id;

    public ArtistInterestEntity() {
    }

    public ArtistInterestEntity(int artistId, int tagId) {
        this.id = new ArtistInterestKey(artistId, tagId);
    }

    public ArtistInterestKey getId() {
        return id;
    }

    public void setId(ArtistInterestKey id) {
        this.id = id;
    }

    @Embeddable
    public static class ArtistInterestKey implements Serializable {
        @Column(name = "artist_id")
        private int artistId;

        @Column(name = "tag_id")
        private int tagId;

        public ArtistInterestKey() {
        }

        public ArtistInterestKey(int artistId, int tagId) {
            this.artistId = artistId;
            this.tagId = tagId;
        }

        public int getArtistId() {
            return artistId;
        }

        public void setArtistId(int artistId) {
            this.artistId = artistId;
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
            ArtistInterestKey that = (ArtistInterestKey) o;
            return artistId == that.artistId && tagId == that.tagId;
        }

        @Override
        public int hashCode() {
            return Objects.hash(artistId, tagId);
        }
    }
}
