package com.appdev.siventin.lugatimang3.service;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;

import javax.naming.NameNotFoundException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.appdev.siventin.lugatimang3.entity.ArtworkEntity;

import com.appdev.siventin.lugatimang3.repository.ArtworkRepository;
import com.appdev.siventin.lugatimang3.repository.ArtistRepository;
import com.appdev.siventin.lugatimang3.repository.TagRepository;
import com.appdev.siventin.lugatimang3.repository.ArtworkTagRepository;
import com.appdev.siventin.lugatimang3.repository.ArtworkLikesRepository;
import com.appdev.siventin.lugatimang3.repository.FavoritesRepository;
import com.appdev.siventin.lugatimang3.repository.CommentRepository;

import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class ArtworkService {

    @Autowired
    ArtworkRepository awrepo;

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
    CommentRepository commentRepository;

    @Autowired
    com.appdev.siventin.lugatimang3.repository.ReportRepository reportRepository;

    @Autowired
    ChallengeService challengeService;

    public ArtworkService() {
    }

    // Migration method (Restored)
    @jakarta.annotation.PostConstruct
    public void migrateLegacyData() {
        List<ArtworkEntity> allArtworks = awrepo.findAll();
        int migratedCount = 0;
        for (ArtworkEntity artwork : allArtworks) {
            if (artwork.getArtist() == null) {
                Integer artistId = awrepo.getLegacyArtistId(artwork.getArtworkId());
                if (artistId != null) {
                    try {
                        com.appdev.siventin.lugatimang3.entity.ArtistEntity artist = artistRepository
                                .findById(artistId).orElse(null);
                        if (artist != null) {
                            artwork.setArtist(artist);
                            awrepo.save(artwork);
                            migratedCount++;
                        }
                    } catch (Exception e) {
                        System.err
                                .println("Failed to migrate artwork " + artwork.getArtworkId() + ": " + e.getMessage());
                    }
                }
            }
        }
        if (migratedCount > 0) {
            System.out.println("Successfully migrated " + migratedCount + " artworks to direct relationships.");
        }
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

            // 1. Fetch Artist and Set Author
            com.appdev.siventin.lugatimang3.entity.ArtistEntity artist = artistRepository.findById(artistId)
                    .orElseThrow(() -> new NoSuchElementException("Artist " + artistId + " not found"));
            artwork.setArtist(artist);

            // 2. Save the Artwork
            return awrepo.save(artwork);
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
            java.util.Set<Integer> likedArtworkIds = new java.util.HashSet<>(
                    artworkLikesRepository.findLikedArtworkIdsByUserId(userId));
            java.util.Set<Integer> favoriteArtworkIds = new java.util.HashSet<>(
                    favoritesRepository.findFavoriteArtworkIdsByUserId(userId));

            for (ArtworkEntity artwork : artworks) {
                artwork.setIsLiked(likedArtworkIds.contains(artwork.getArtworkId()));
                artwork.setIsFavorited(favoriteArtworkIds.contains(artwork.getArtworkId()));
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
        // No need for manual population if lazy loading / EAGER fetch works, but
        // ensuring strictly via getter if needed.
        // JPA handles it via getArtist()
        // Fallback or explicit check if needed for legacy compatibility during
        // migration phase:
        if (artwork.getArtist() == null) {
            // Fallback logic removed.
            // Ensure data integrity via direct relationships.
        }

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
            // Direct fetch by Artist
            List<ArtworkEntity> artworks = awrepo.findByArtist_ArtistId(artistId).stream()
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
                java.util.Set<Integer> likedArtworkIds = new java.util.HashSet<>(
                        artworkLikesRepository.findLikedArtworkIdsByUserId(userId));
                java.util.Set<Integer> favoriteArtworkIds = new java.util.HashSet<>(
                        favoritesRepository.findFavoriteArtworkIdsByUserId(userId));

                for (ArtworkEntity artwork : artworks) {
                    artwork.setIsLiked(likedArtworkIds.contains(artwork.getArtworkId()));
                    artwork.setIsFavorited(favoriteArtworkIds.contains(artwork.getArtworkId()));
                }
            }

            return artworks;
        } catch (Exception e) {
            e.printStackTrace();
            return java.util.Collections.emptyList();
        }
    }

    public List<ArtworkEntity> getArchivedArtworksByArtistId(int artistId, int userId) {
        try {
            // Fetch artworks by Artist and filter archived
            List<ArtworkEntity> disabledArtworks = awrepo.findByArtist_ArtistId(artistId).stream()
                    .filter(a -> Boolean.TRUE.equals(a.isArchived()))
                    .collect(Collectors.toList());

            // Populate displayTags
            for (ArtworkEntity artwork : disabledArtworks) {
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
                java.util.Set<Integer> likedArtworkIds = new java.util.HashSet<>(
                        artworkLikesRepository.findLikedArtworkIdsByUserId(userId));
                java.util.Set<Integer> favoriteArtworkIds = new java.util.HashSet<>(
                        favoritesRepository.findFavoriteArtworkIdsByUserId(userId));

                for (ArtworkEntity artwork : disabledArtworks) {
                    artwork.setIsLiked(likedArtworkIds.contains(artwork.getArtworkId()));
                    artwork.setIsFavorited(favoriteArtworkIds.contains(artwork.getArtworkId()));
                }
            }

            return disabledArtworks;
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
        ArtworkEntity artwork = awrepo.findById(artworkId)
                .orElseThrow(() -> new NoSuchElementException("Artwork " + artworkId + " does not exist."));

        // Verify ownership
        if (artwork.getArtist() == null || artwork.getArtist().getArtistId() != requestingArtistId) {
            throw new IllegalArgumentException(
                    "Unauthorized: User " + requestingArtistId + " does not own artwork " + artworkId);
        }

        artwork.setArchived(isArchived);
        return awrepo.save(artwork);
    }

    // Delete
    public String deleteArtwork(int artworkId, int requestingArtistId) {
        try {
            ArtworkEntity artwork = awrepo.findById(artworkId).orElse(null);

            if (artwork == null) {
                return "Artwork " + artworkId + " does not exist.";
            }

            // Verify ownership
            if (requestingArtistId > 0) {
                boolean isOwner = artwork.getArtist() != null
                        && artwork.getArtist().getArtistId() == requestingArtistId;
                if (!isOwner) {
                    return "Unauthorized: User " + requestingArtistId + " does not own artwork " + artworkId;
                }
            }

            // 1. Delete Reports (Must be first to avoid FK issues with Reported Item)
            List<com.appdev.siventin.lugatimang3.entity.ReportEntity> reports = reportRepository
                    .findByReportedItemIdAndItemType(artworkId,
                            com.appdev.siventin.lugatimang3.entity.ReportEntity.ReportItemType.ARTWORK);
            if (!reports.isEmpty()) {
                reportRepository.deleteAll(reports);
            }

            // 2. Delete Legacy UserArtwork Entry (Native Query)
            awrepo.deleteLegacyUserArtwork(artworkId);

            // Streak Rollback Logic: If this artwork is a challenge entry, decrement user
            // streak
            if (artwork.getChallenge() != null) {
                com.appdev.siventin.lugatimang3.entity.ArtistEntity artist = artwork.getArtist();
                if (artist != null) {
                    int currentStreak = artist.getStreak() != null ? artist.getStreak() : 0;
                    if (currentStreak > 0) {
                        artist.setStreak(currentStreak - 1);
                        artistRepository.save(artist);
                    }
                }
            }

            // 3. Delete from Favorites
            List<com.appdev.siventin.lugatimang3.entity.FavoritesEntity> favorites = favoritesRepository.findAll()
                    .stream()
                    .filter(f -> f.getId().getArtworkId() == artworkId)
                    .collect(Collectors.toList());
            if (!favorites.isEmpty()) {
                favoritesRepository.deleteAll(favorites);
            }

            // 4. Delete from ArtworkLikes
            List<com.appdev.siventin.lugatimang3.entity.ArtworkLikesEntity> likes = artworkLikesRepository.findAll()
                    .stream()
                    .filter(l -> l.getId().getArtworkId() == artworkId)
                    .collect(Collectors.toList());
            if (!likes.isEmpty()) {
                artworkLikesRepository.deleteAll(likes);
            }

            // 5. Delete from ArtworkTags
            List<com.appdev.siventin.lugatimang3.entity.ArtworkTagEntity> tags = artworkTagRepository.findAll()
                    .stream()
                    .filter(t -> t.getId().getArtworkId() == artworkId)
                    .collect(Collectors.toList());
            if (!tags.isEmpty()) {
                artworkTagRepository.deleteAll(tags);
            }

            // 6. Delete Comments (And their legacy table entries if any)
            List<com.appdev.siventin.lugatimang3.entity.CommentEntity> comments = commentRepository
                    .findByArtwork_ArtworkId(artworkId);
            if (!comments.isEmpty()) {
                // We need to clean up legacy user_comment entries for these comments too
                for (com.appdev.siventin.lugatimang3.entity.CommentEntity comment : comments) {
                    commentRepository.deleteLegacyUserComment(comment.getCommentId());
                }
                commentRepository.deleteAll(comments);
            }

            // 7. Delete the Artwork itself
            awrepo.deleteById(artworkId);
            return "Artwork " + artworkId + " is successfully deleted!";
        } catch (Exception e) {
            e.printStackTrace();
            return "Error deleting artwork: " + e.getMessage();
        }
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

        // Populate artist for each artwork (Managed by JPA)
        // No manual lookup needed as direct relationship exists.
        for (ArtworkEntity artwork : artworks) {
            // Ensure artist loaded if needed (though JPA does this)
            if (artwork.getArtist() == null) {
                // logging or handling if needed
            }

            // Also populate displayTags as usual
            if (artwork.getArtworkTags() != null) {
                List<com.appdev.siventin.lugatimang3.entity.TagEntity> tags = artwork.getArtworkTags().stream()
                        .map(at -> at.getTag()).collect(Collectors.toList());
                artwork.setDisplayTags(tags);
            } else {
                artwork.setDisplayTags(java.util.Collections.emptyList());
            }

            // And isLiked status
            // Batch fetch logic outside loop for optimization
        }

        if (userId > 0) {
            java.util.Set<Integer> likedArtworkIds = new java.util.HashSet<>(
                    artworkLikesRepository.findLikedArtworkIdsByUserId(userId));
            for (ArtworkEntity artwork : artworks) {
                artwork.setIsLiked(likedArtworkIds.contains(artwork.getArtworkId()));
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
                java.util.Set<Integer> likedArtworkIds = new java.util.HashSet<>(
                        artworkLikesRepository.findLikedArtworkIdsByUserId(userId));
                java.util.Set<Integer> favoriteArtworkIds = new java.util.HashSet<>(
                        favoritesRepository.findFavoriteArtworkIdsByUserId(userId));

                for (ArtworkEntity artwork : artworks) {
                    artwork.setIsLiked(likedArtworkIds.contains(artwork.getArtworkId()));
                    artwork.setIsFavorited(favoriteArtworkIds.contains(artwork.getArtworkId()));
                }
            }
            return artworks;

        } catch (Exception e) {
            e.printStackTrace();
            return java.util.Collections.emptyList();
        }
    }

    public List<ArtworkEntity> getRelatedArtworks(int artworkId, int userId) {
        try {
            ArtworkEntity currentArtwork = awrepo.findById(artworkId).orElse(null);
            if (currentArtwork == null)
                return java.util.Collections.emptyList();

            int artistId = currentArtwork.getArtist() != null ? currentArtwork.getArtist().getArtistId() : -1;
            List<Integer> tagIds = java.util.Collections.emptyList();
            if (currentArtwork.getArtworkTags() != null) {
                tagIds = currentArtwork.getArtworkTags().stream()
                        .map(at -> at.getTag().getTagId())
                        .collect(Collectors.toList());
            }

            // If no tags and no artist, can't find related
            if (artistId == -1 && tagIds.isEmpty())
                return java.util.Collections.emptyList();

            // Handle empty tag list to avoid SQL IN empty set error if JPA doesn't handle
            // it
            if (tagIds.isEmpty())
                tagIds = java.util.Collections.singletonList(-1);

            List<ArtworkEntity> related = awrepo.findRelatedArtworks(
                    artistId,
                    tagIds,
                    artworkId,
                    org.springframework.data.domain.PageRequest.of(0, 5));

            // Populate transient fields (tags, likes, favs)
            for (ArtworkEntity artwork : related) {
                // Tags
                if (artwork.getArtworkTags() != null) {
                    List<com.appdev.siventin.lugatimang3.entity.TagEntity> tags = artwork.getArtworkTags().stream()
                            .map(at -> at.getTag()).collect(Collectors.toList());
                    artwork.setDisplayTags(tags);
                } else {
                    artwork.setDisplayTags(java.util.Collections.emptyList());
                }
            }

            if (userId > 0) {
                java.util.Set<Integer> likedArtworkIds = new java.util.HashSet<>(
                        artworkLikesRepository.findLikedArtworkIdsByUserId(userId));
                java.util.Set<Integer> favoriteArtworkIds = new java.util.HashSet<>(
                        favoritesRepository.findFavoriteArtworkIdsByUserId(userId));

                for (ArtworkEntity artwork : related) {
                    artwork.setIsLiked(likedArtworkIds.contains(artwork.getArtworkId()));
                    artwork.setIsFavorited(favoriteArtworkIds.contains(artwork.getArtworkId()));
                }
            }

            return related;
        } catch (Exception e) {
            e.printStackTrace();
            return java.util.Collections.emptyList();
        }
    }
}
