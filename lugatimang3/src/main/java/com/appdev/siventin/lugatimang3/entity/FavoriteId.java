package com.appdev.siventin.lugatimang3.entity;

import java.io.Serializable;

public class FavoriteId implements Serializable {

    private int artist;
    private int artwork;

    public FavoriteId() {
    }

    public FavoriteId(int artist, int artwork) {
        this.artist = artist;
        this.artwork = artwork;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o)
            return true;
        if (o == null || getClass() != o.getClass())
            return false;

        FavoriteId that = (FavoriteId) o;

        if (artist != that.artist)
            return false;
        return artwork == that.artwork;
    }

    @Override
    public int hashCode() {
        int result = artist;
        result = 31 * result + artwork;
        return result;
    }
}
