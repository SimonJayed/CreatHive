package com.appdev.siventin.lugatimang3.service;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;

import javax.naming.NameNotFoundException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.appdev.siventin.lugatimang3.entity.ArtworkEntity;
import com.appdev.siventin.lugatimang3.repository.ArtworkRepository;
import com.appdev.siventin.lugatimang3.repository.UserArtworkRepository;
import com.appdev.siventin.lugatimang3.entity.UserArtworkEntity;

@Service
public class ArtworkService {

    @Autowired
    ArtworkRepository awrepo;

    @Autowired
    UserArtworkRepository userArtworkRepository;

    public ArtworkService() {
    }

    // Create
    public ArtworkEntity insertArtwork(ArtworkEntity artwork, int artistId) {
        try {
            // 1. Save the Artwork
            ArtworkEntity savedArtwork = awrepo.save(artwork);

            // 2. Create the Association
            UserArtworkEntity userArtwork = new UserArtworkEntity();
            UserArtworkEntity.UserArtworkKey id = new UserArtworkEntity.UserArtworkKey(savedArtwork.getArtworkId(),
                    artistId);
            userArtwork.setId(id);
            userArtworkRepository.save(userArtwork);

            return savedArtwork;
        } catch (Exception e) {
            e.printStackTrace();
            throw e;
        }
    }

    // Read
    public List<ArtworkEntity> getAllArtworks() {
        return awrepo.findAll();
    }

    public List<ArtworkEntity> getArtworksByArtistId(int artistId) {
        try {
            // Find all artwork IDs associated with the artist
            List<Integer> artworkIds = userArtworkRepository.findAll().stream()
                    .filter(ua -> ua.getId().getArtistId() == artistId)
                    .map(ua -> ua.getId().getArtworkId())
                    .collect(Collectors.toList());

            // Fetch artworks by IDs
            return awrepo.findAllById(artworkIds);
        } catch (Exception e) {
            e.printStackTrace();
            return java.util.Collections.emptyList();
        }
    }

    public ArtworkEntity getArtworkBydescription(String description) throws NameNotFoundException {
        if (awrepo.findByDescription(description) != null)
            return awrepo.findByDescription(description);
        else
            throw new NameNotFoundException(
                    "There is no Artwork having that description " + description + " in the records.");

    }

    // Update
    @SuppressWarnings("finally")
    public ArtworkEntity updateArtwork(int artworkId, ArtworkEntity newArtworkDetails) {
        ArtworkEntity Artwork = new ArtworkEntity();
        try {
            Artwork = awrepo.findById(artworkId).get();
            Artwork.setDescription(newArtworkDetails.getDescription());
            Artwork.setCreationDate(newArtworkDetails.getCreationDate());

        } catch (NoSuchElementException ex) {
            throw new NoSuchElementException("Artwork " + artworkId + " does not exist.");
        } finally {
            return awrepo.save(Artwork);
        }
    }

    // Delete
    @SuppressWarnings("unused")
    public String deleteArtwork(int artworkId) {
        String msg = "";
        if (awrepo.findById(artworkId) != null) {
            awrepo.deleteById(artworkId);
            msg = "Artwork " + artworkId + "is successfully deleted!";
        } else
            msg = "Artwork " + artworkId + " does not exist.";
        return msg;
    }

    // Interactions
    @Autowired
    com.appdev.siventin.lugatimang3.repository.ArtworkLikesRepository artworkLikesRepository;

    @Autowired
    com.appdev.siventin.lugatimang3.repository.FavoritesRepository favoritesRepository;

    public ArtworkEntity likeArtwork(int artworkId, int userId) {
        ArtworkEntity artwork = awrepo.findById(artworkId)
                .orElseThrow(() -> new NoSuchElementException("Artwork " + artworkId + " does not exist."));

        com.appdev.siventin.lugatimang3.entity.ArtworkLikesEntity.ArtworkLikesKey key = new com.appdev.siventin.lugatimang3.entity.ArtworkLikesEntity.ArtworkLikesKey(
                artworkId, userId);

        if (artworkLikesRepository.existsById(key)) {
            // Unlike
            artworkLikesRepository.deleteById(key);
            int currentLikes = artwork.getLikeCount() == null ? 0 : artwork.getLikeCount();
            artwork.setLikeCount(Math.max(0, currentLikes - 1));
        } else {
            // Like
            com.appdev.siventin.lugatimang3.entity.ArtworkLikesEntity like = new com.appdev.siventin.lugatimang3.entity.ArtworkLikesEntity(
                    artworkId, userId);
            artworkLikesRepository.save(like);
            int currentLikes = artwork.getLikeCount() == null ? 0 : artwork.getLikeCount();
            artwork.setLikeCount(currentLikes + 1);
        }

        return awrepo.save(artwork);
    }

    public void favoriteArtwork(int artworkId, int userId) {
        // userId is treated as artistId in FavoritesEntity
        com.appdev.siventin.lugatimang3.entity.FavoritesEntity.FavoritesKey key = new com.appdev.siventin.lugatimang3.entity.FavoritesEntity.FavoritesKey(
                artworkId, userId);

        if (favoritesRepository.existsById(key)) {
            // Unfavorite
            favoritesRepository.deleteById(key);
        } else {
            // Favorite
            com.appdev.siventin.lugatimang3.entity.FavoritesEntity favorite = new com.appdev.siventin.lugatimang3.entity.FavoritesEntity(
                    artworkId, userId);
            favoritesRepository.save(favorite);
        }
    }

    public List<ArtworkEntity> getFavoriteArtworks(int userId) {
        List<Integer> artworkIds = favoritesRepository.findAll().stream()
                .filter(fav -> fav.getId().getArtistId() == userId)
                .map(fav -> fav.getId().getArtworkId())
                .collect(Collectors.toList());

        return awrepo.findAllById(artworkIds);
    }

}
