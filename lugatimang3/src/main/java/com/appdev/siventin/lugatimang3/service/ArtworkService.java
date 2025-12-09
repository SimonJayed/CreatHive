package com.appdev.siventin.lugatimang3.service;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;

import javax.naming.NameNotFoundException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.appdev.siventin.lugatimang3.entity.ArtworkEntity;

import com.appdev.siventin.lugatimang3.entity.UserArtworkEntity;
import com.appdev.siventin.lugatimang3.repository.ArtworkRepository;
import com.appdev.siventin.lugatimang3.repository.UserArtworkRepository;
import com.appdev.siventin.lugatimang3.repository.ArtistRepository;
import com.appdev.siventin.lugatimang3.repository.TagRepository;
import com.appdev.siventin.lugatimang3.repository.ArtworkTagRepository;
import com.appdev.siventin.lugatimang3.repository.ArtworkLikesRepository;
import com.appdev.siventin.lugatimang3.repository.FavoritesRepository;
import com.appdev.siventin.lugatimang3.repository.CommentOnArtworkRepository;

@Service
public class ArtworkService {

    @Autowired
    ArtworkRepository awrepo;

    @Autowired
    UserArtworkRepository userArtworkRepository;

    @Autowired
    ArtistRepository artistRepository;

    @Autowired
    TagRepository tagRepository;

    @Autowired
    ArtworkTagRepository artworkTagRepository;

    @Autowired
    ArtworkLikesRepository artworkLikesRepository;

    @Autowired
    FavoritesRepository favoritesRepository;

    @Autowired
    CommentOnArtworkRepository commentOnArtworkRepository;

    @Autowired
    ChallengeService challengeService;

    public ArtworkService() {
    }

    // Create
    public ArtworkEntity insertArtwork(ArtworkEntity artwork, int artistId) {
        try {
            // Check for challenge submission
            if (artwork.getChallenge() != null) {
                int challengeId = artwork.getChallenge().getChallengeId();
                // This validates if already submitted
                challengeService.submitChallengeEntry(challengeId, artistId, artwork);
            }

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

    public void insertArtworkTag(int artworkId, int tagId) {
        try {
            com.appdev.siventin.lugatimang3.entity.ArtworkTagEntity artworkTag = new com.appdev.siventin.lugatimang3.entity.ArtworkTagEntity();
            com.appdev.siventin.lugatimang3.entity.ArtworkTagEntity.ArtworkTagKey id = new com.appdev.siventin.lugatimang3.entity.ArtworkTagEntity.ArtworkTagKey(
                    artworkId, tagId);
            artworkTag.setId(id);

            // Fetch and set relationships
            ArtworkEntity artwork = awrepo.findById(artworkId).orElseThrow();
            com.appdev.siventin.lugatimang3.entity.TagEntity tag = com.appdev.siventin.lugatimang3.repository.TagRepository.class
                    .cast(tagRepository).findById(tagId).orElseThrow();

            artworkTag.setArtwork(artwork);
            artworkTag.setTag(tag);

            artworkTagRepository.save(artworkTag);
        } catch (Exception e) {
            e.printStackTrace();
            throw e;
        }
    }

    // Read
    public List<ArtworkEntity> getAllArtworks(int userId) {
        List<ArtworkEntity> artworks = awrepo.findAll().stream()
                .filter(a -> !Boolean.TRUE.equals(a.isArchived()))
                .collect(Collectors.toList());

        if (userId > 0) {
            for (ArtworkEntity artwork : artworks) {
                com.appdev.siventin.lugatimang3.entity.ArtworkLikesEntity.ArtworkLikesKey key = new com.appdev.siventin.lugatimang3.entity.ArtworkLikesEntity.ArtworkLikesKey(
                        artwork.getArtworkId(), userId);
                artwork.setIsLiked(artworkLikesRepository.existsById(key));

                com.appdev.siventin.lugatimang3.entity.FavoritesEntity.FavoritesKey favKey = new com.appdev.siventin.lugatimang3.entity.FavoritesEntity.FavoritesKey(
                        artwork.getArtworkId(), userId);
                artwork.setIsFavorited(favoritesRepository.existsById(favKey));
            }
        }

        // Populate displayTags for all artworks
        for (ArtworkEntity artwork : artworks) {
            if (artwork.getArtworkTags() != null) {
                List<com.appdev.siventin.lugatimang3.entity.TagEntity> tags = artwork.getArtworkTags().stream()
                        .map(at -> at.getTag())
                        .collect(Collectors.toList());
                artwork.setDisplayTags(tags);
            } else {
                artwork.setDisplayTags(java.util.Collections.emptyList());
            }
        }

        return artworks;
    }

    public ArtworkEntity getArtworkById(int artworkId, int userId) {
        ArtworkEntity artwork = awrepo.findById(artworkId)
                .orElseThrow(() -> new NoSuchElementException("Artwork " + artworkId + " does not exist."));

        // Populate artist
        userArtworkRepository.findAll().stream().filter(ua -> ua.getId().getArtworkId() == artwork.getArtworkId())
                .findFirst().ifPresent(ua -> {
                    artistRepository.findById(ua.getId().getArtistId())
                            .ifPresent(artist -> artwork.setArtist(artist));
                });

        // Populate displayTags
        if (artwork.getArtworkTags() != null) {
            List<com.appdev.siventin.lugatimang3.entity.TagEntity> tags = artwork.getArtworkTags().stream()
                    .map(at -> at.getTag()).collect(Collectors.toList());
            artwork.setDisplayTags(tags);
        } else {
            artwork.setDisplayTags(java.util.Collections.emptyList());
        }

        // Like and Favorite status
        if (userId > 0) {
            com.appdev.siventin.lugatimang3.entity.ArtworkLikesEntity.ArtworkLikesKey key = new com.appdev.siventin.lugatimang3.entity.ArtworkLikesEntity.ArtworkLikesKey(
                    artwork.getArtworkId(), userId);
            artwork.setIsLiked(artworkLikesRepository.existsById(key));

            com.appdev.siventin.lugatimang3.entity.FavoritesEntity.FavoritesKey favKey = new com.appdev.siventin.lugatimang3.entity.FavoritesEntity.FavoritesKey(
                    artwork.getArtworkId(), userId);
            artwork.setIsFavorited(favoritesRepository.existsById(favKey));
        }

        return artwork;
    }

    public List<ArtworkEntity> getArtworksByArtistId(int artistId, int userId) {
        try {
            // Find all artwork IDs associated with the artist
            List<Integer> artworkIds = userArtworkRepository.findAll().stream()
                    .filter(ua -> ua.getId().getArtistId() == artistId)
                    .map(ua -> ua.getId().getArtworkId())
                    .collect(Collectors.toList());

            // Fetch artworks by IDs and filter out archived ones
            List<ArtworkEntity> artworks = awrepo.findAllById(artworkIds).stream()
                    .filter(a -> !Boolean.TRUE.equals(a.isArchived()))
                    .collect(Collectors.toList());

            // Populate displayTags
            for (ArtworkEntity artwork : artworks) {
                if (artwork.getArtworkTags() != null) {
                    List<com.appdev.siventin.lugatimang3.entity.TagEntity> tags = artwork.getArtworkTags().stream()
                            .map(at -> at.getTag())
                            .collect(Collectors.toList());
                    artwork.setDisplayTags(tags);
                } else {
                    artwork.setDisplayTags(java.util.Collections.emptyList());
                }
            }

            if (userId > 0) {
                for (ArtworkEntity artwork : artworks) {
                    com.appdev.siventin.lugatimang3.entity.ArtworkLikesEntity.ArtworkLikesKey key = new com.appdev.siventin.lugatimang3.entity.ArtworkLikesEntity.ArtworkLikesKey(
                            artwork.getArtworkId(), userId);
                    artwork.setIsLiked(artworkLikesRepository.existsById(key));

                    com.appdev.siventin.lugatimang3.entity.FavoritesEntity.FavoritesKey favKey = new com.appdev.siventin.lugatimang3.entity.FavoritesEntity.FavoritesKey(
                            artwork.getArtworkId(), userId);
                    artwork.setIsFavorited(favoritesRepository.existsById(favKey));
                }
            }

            return artworks;
        } catch (Exception e) {
            e.printStackTrace();
            return java.util.Collections.emptyList();
        }
    }

    public List<ArtworkEntity> getArchivedArtworksByArtistId(int artistId) {
        try {
            // Find all artwork IDs associated with the artist
            List<Integer> artworkIds = userArtworkRepository.findAll().stream()
                    .filter(ua -> ua.getId().getArtistId() == artistId)
                    .map(ua -> ua.getId().getArtworkId())
                    .collect(Collectors.toList());

            // Fetch artworks by IDs and filter ONLY archived ones
            return awrepo.findAllById(artworkIds).stream()
                    .filter(a -> Boolean.TRUE.equals(a.isArchived()))
                    .collect(Collectors.toList());
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

    public ArtworkEntity archiveArtwork(int artworkId, boolean isArchived, int requestingArtistId) {
        // Verify ownership
        com.appdev.siventin.lugatimang3.entity.UserArtworkEntity.UserArtworkKey key = new com.appdev.siventin.lugatimang3.entity.UserArtworkEntity.UserArtworkKey(
                artworkId, requestingArtistId);

        if (!userArtworkRepository.existsById(key)) {
            throw new IllegalArgumentException(
                    "Unauthorized: User " + requestingArtistId + " does not own artwork " + artworkId);
        }

        ArtworkEntity artwork = awrepo.findById(artworkId)
                .orElseThrow(() -> new NoSuchElementException("Artwork " + artworkId + " does not exist."));
        artwork.setArchived(isArchived);
        return awrepo.save(artwork);
    }

    // Delete
    @SuppressWarnings("unused")
    // Delete
    // Delete
    public String deleteArtwork(int artworkId, int requestingArtistId) {
        String msg = "";

        if (requestingArtistId > 0) {
            com.appdev.siventin.lugatimang3.entity.UserArtworkEntity.UserArtworkKey key = new com.appdev.siventin.lugatimang3.entity.UserArtworkEntity.UserArtworkKey(
                    artworkId, requestingArtistId);
            if (!userArtworkRepository.existsById(key)) {
                return "Unauthorized: User " + requestingArtistId + " does not own artwork " + artworkId;
            }
        }

        if (awrepo.existsById(artworkId)) {
            // 1. Delete from UserArtwork (Link to Artist)
            List<UserArtworkEntity> userArtworks = userArtworkRepository.findAll().stream()
                    .filter(ua -> ua.getId().getArtworkId() == artworkId)
                    .collect(Collectors.toList());
            userArtworkRepository.deleteAll(userArtworks);

            // 2. Delete from Favorites
            List<com.appdev.siventin.lugatimang3.entity.FavoritesEntity> favorites = favoritesRepository.findAll()
                    .stream()
                    .filter(f -> f.getId().getArtworkId() == artworkId)
                    .collect(Collectors.toList());
            favoritesRepository.deleteAll(favorites);

            // 3. Delete from ArtworkLikes
            List<com.appdev.siventin.lugatimang3.entity.ArtworkLikesEntity> likes = artworkLikesRepository.findAll()
                    .stream()
                    .filter(l -> l.getId().getArtworkId() == artworkId)
                    .collect(Collectors.toList());
            artworkLikesRepository.deleteAll(likes);

            // 4. Delete from ArtworkTags
            List<com.appdev.siventin.lugatimang3.entity.ArtworkTagEntity> tags = artworkTagRepository.findAll()
                    .stream()
                    .filter(t -> t.getId().getArtworkId() == artworkId)
                    .collect(Collectors.toList());
            artworkTagRepository.deleteAll(tags);

            // 5. Delete from CommentOnArtwork (Link to Comments)
            List<com.appdev.siventin.lugatimang3.entity.CommentOnArtworkEntity> commentLinks = commentOnArtworkRepository
                    .findAll().stream().filter(c -> c.getId().getArtworkId() == artworkId)
                    .collect(Collectors.toList());
            commentOnArtworkRepository.deleteAll(commentLinks);

            // 6. Delete the Artwork itself
            awrepo.deleteById(artworkId);
            msg = "Artwork " + artworkId + " is successfully deleted!";
        } else {
            msg = "Artwork " + artworkId + " does not exist.";
        }
        return msg;
    }

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
            artwork.setIsLiked(false);
        } else {
            // Like
            com.appdev.siventin.lugatimang3.entity.ArtworkLikesEntity like = new com.appdev.siventin.lugatimang3.entity.ArtworkLikesEntity(
                    artworkId, userId);
            artworkLikesRepository.save(like);
            int currentLikes = artwork.getLikeCount() == null ? 0 : artwork.getLikeCount();
            artwork.setLikeCount(currentLikes + 1);
            artwork.setIsLiked(true);
        }

        ArtworkEntity savedArtwork = awrepo.save(artwork);
        savedArtwork.setIsLiked(artwork.getIsLiked());
        // Ensure isFavorited is preserved or fetched if needed, though this method
        // returns saved object which might lose transient fields if not careful.
        // Re-populating transient fields for return
        if (userId > 0) {
            com.appdev.siventin.lugatimang3.entity.FavoritesEntity.FavoritesKey favKey = new com.appdev.siventin.lugatimang3.entity.FavoritesEntity.FavoritesKey(
                    savedArtwork.getArtworkId(), userId);
            savedArtwork.setIsFavorited(favoritesRepository.existsById(favKey));
        }
        return savedArtwork;
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
                .filter(fav -> fav.getId().getArtistId() == userId).map(fav -> fav.getId().getArtworkId())
                .collect(Collectors.toList());

        List<ArtworkEntity> artworks = awrepo.findAllById(artworkIds);

        // Populate artist for each artwork
        for (ArtworkEntity artwork : artworks) {
            // Find artist ID from UserArtwork
            userArtworkRepository.findAll().stream().filter(ua -> ua.getId().getArtworkId() == artwork.getArtworkId())
                    .findFirst().ifPresent(ua -> {
                        artistRepository.findById(ua.getId().getArtistId())
                                .ifPresent(artist -> artwork.setArtist(artist));
                    });

            // Also populate displayTags as usual
            if (artwork.getArtworkTags() != null) {
                List<com.appdev.siventin.lugatimang3.entity.TagEntity> tags = artwork.getArtworkTags().stream()
                        .map(at -> at.getTag()).collect(Collectors.toList());
                artwork.setDisplayTags(tags);
            } else {
                artwork.setDisplayTags(java.util.Collections.emptyList());
            }

            // And isLiked status
            if (userId > 0) {
                com.appdev.siventin.lugatimang3.entity.ArtworkLikesEntity.ArtworkLikesKey key = new com.appdev.siventin.lugatimang3.entity.ArtworkLikesEntity.ArtworkLikesKey(
                        artwork.getArtworkId(), userId);
                artwork.setIsLiked(artworkLikesRepository.existsById(key));

                // Since this IS the favorite list of 'userId', isFavorited is true.
                artwork.setIsFavorited(true);
            }
        }

        return artworks;
    }

    public List<ArtworkEntity> getArtworksByTagId(int tagId, int userId) {
        try {
            // Find all artwork IDs associated with the tag
            List<Integer> artworkIds = artworkTagRepository.findAll().stream()
                    .filter(at -> at.getId().getTagId() == tagId).map(at -> at.getId().getArtworkId())
                    .collect(Collectors.toList());

            // Fetch artworks by IDs and filter out archived ones
            List<ArtworkEntity> artworks = awrepo.findAllById(artworkIds).stream()
                    .filter(a -> !Boolean.TRUE.equals(a.isArchived())).collect(Collectors.toList());

            // Populate displayTags
            for (ArtworkEntity artwork : artworks) {
                if (artwork.getArtworkTags() != null) {
                    List<com.appdev.siventin.lugatimang3.entity.TagEntity> tags = artwork.getArtworkTags().stream()
                            .map(at -> at.getTag()).collect(Collectors.toList());
                    artwork.setDisplayTags(tags);
                } else {
                    artwork.setDisplayTags(java.util.Collections.emptyList());
                }
            }

            if (userId > 0) {
                for (ArtworkEntity artwork : artworks) {
                    com.appdev.siventin.lugatimang3.entity.ArtworkLikesEntity.ArtworkLikesKey key = new com.appdev.siventin.lugatimang3.entity.ArtworkLikesEntity.ArtworkLikesKey(
                            artwork.getArtworkId(), userId);
                    artwork.setIsLiked(artworkLikesRepository.existsById(key));

                    com.appdev.siventin.lugatimang3.entity.FavoritesEntity.FavoritesKey favKey = new com.appdev.siventin.lugatimang3.entity.FavoritesEntity.FavoritesKey(
                            artwork.getArtworkId(), userId);
                    artwork.setIsFavorited(favoritesRepository.existsById(favKey));
                }
            }
            return artworks;

        } catch (Exception e) {
            e.printStackTrace();
            return java.util.Collections.emptyList();
        }
    }

}
