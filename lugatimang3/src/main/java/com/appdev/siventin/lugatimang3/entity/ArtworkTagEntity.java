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
@Table(name = "artwork_tag")
public class ArtworkTagEntity {

    @EmbeddedId
    private ArtworkTagKey id;

    @Column(name = "date_assigned")
    private LocalDateTime dateAssigned;

    public ArtworkTagEntity() {
        this.dateAssigned = LocalDateTime.now();
    }

    public ArtworkTagEntity(int artworkId, int tagId) {
        this.id = new ArtworkTagKey(artworkId, tagId);
        this.dateAssigned = LocalDateTime.now();
    }

    public ArtworkTagKey getId() {
        return id;
    }

    public void setId(ArtworkTagKey id) {
        this.id = id;
    }

    public LocalDateTime getDateAssigned() {
        return dateAssigned;
    }

    public void setDateAssigned(LocalDateTime dateAssigned) {
        this.dateAssigned = dateAssigned;
    }

    @Embeddable
    public static class ArtworkTagKey implements Serializable {
        @Column(name = "artwork_id")
        private int artworkId;

        @Column(name = "tag_id")
        private int tagId;

        public ArtworkTagKey() {
        }

        public ArtworkTagKey(int artworkId, int tagId) {
            this.artworkId = artworkId;
            this.tagId = tagId;
        }

        public int getArtworkId() {
            return artworkId;
        }

        public void setArtworkId(int artworkId) {
            this.artworkId = artworkId;
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
            ArtworkTagKey that = (ArtworkTagKey) o;
            return artworkId == that.artworkId && tagId == that.tagId;
        }

        @Override
        public int hashCode() {
            return Objects.hash(artworkId, tagId);
        }
    }
}
