package com.appdev.siventin.lugatimang3.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.NoSuchElementException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.appdev.siventin.lugatimang3.entity.*;
import com.appdev.siventin.lugatimang3.repository.*;

@Service
public class FavoriteService {

    @Autowired
    FavoriteRepository frepo;

    @Autowired
    ArtistRepository arepo;

    @Autowired
    ArtworkRepository wrepo;

    // Create Favorite
    public FavoriteEntity addFavorite(int artistId, int artworkId) {
        ArtistEntity artist = arepo.findById(artistId)
                .orElseThrow(() -> new NoSuchElementException("Artist not found"));

        ArtworkEntity artwork = wrepo.findById(artworkId)
                .orElseThrow(() -> new NoSuchElementException("Artwork not found"));

        FavoriteEntity favorite = new FavoriteEntity(
                artist,
                artwork,
                LocalDateTime.now());

        return frepo.save(favorite);
    }

    // Get all
    public List<FavoriteEntity> getAllFavorites() {
        return frepo.findAll();
    }

    // Delete Favorite
    public String removeFavorite(int artistId, int artworkId) {
        FavoriteEntity fav = frepo.findByArtistArtistIdAndArtworkArtworkId(artistId, artworkId);

        if (fav != null) {
            frepo.delete(fav);
            return "Favorite removed successfully!";
        }
        return "Favorite not found.";
    }
}
