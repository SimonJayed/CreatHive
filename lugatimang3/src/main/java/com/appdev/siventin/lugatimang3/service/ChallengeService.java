package com.appdev.siventin.lugatimang3.service;

import com.appdev.siventin.lugatimang3.entity.ArtworkEntity;
import com.appdev.siventin.lugatimang3.entity.ChallengeEntity;
import com.appdev.siventin.lugatimang3.entity.ArtistEntity;
import com.appdev.siventin.lugatimang3.repository.ArtworkRepository;
import com.appdev.siventin.lugatimang3.repository.ChallengeRepository;
import com.appdev.siventin.lugatimang3.repository.ArtistRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Random;
import java.util.Arrays;
import java.util.Optional;

@Service
public class ChallengeService {

    @Autowired
    private ChallengeRepository challengeRepository;

    @Autowired
    private ArtistRepository artistRepository;

    @Autowired
    private com.appdev.siventin.lugatimang3.repository.UserArtworkRepository userArtworkRepository;

    @Autowired
    private com.appdev.siventin.lugatimang3.repository.ArtworkLikesRepository artworkLikesRepository;

    @Autowired
    private com.appdev.siventin.lugatimang3.repository.FavoritesRepository favoritesRepository;

    private final List<String> THEMES = Arrays.asList(
            "Cyberpunk City", "Enchanted Forest", "Space Explorer", "Underwater World",
            "Steampunk Gadget", "Mythical Creature", "Future Fashion", "Retro Diner",
            "Floating Islands", "Lost Civilization", "Robot Pet", "Magical Library",
            "Crystal Cave", "Neon Noir", "Desert Oasis", "Haunted Mansion");

    private final List<String> TAGS = Arrays.asList(
            "Sci-Fi", "Fantasy", "Character Design", "Environment", "Pixel Art",
            "Concept Art", "Illustration", "Digital Painting", "Sketch", "Abstract");

    public ChallengeEntity getCurrentChallenge() {
        LocalDateTime now = LocalDateTime.now();
        Optional<ChallengeEntity> activeChallenge = challengeRepository.findActiveChallenge(now);

        if (activeChallenge.isPresent()) {
            return activeChallenge.get();
        }

        // If no active challenge, create a new one
        return createNewWeeklyChallenge(now);
    }

    private ChallengeEntity createNewWeeklyChallenge(LocalDateTime startDate) {
        Random random = new Random();
        String theme = THEMES.get(random.nextInt(THEMES.size()));
        String tag = TAGS.get(random.nextInt(TAGS.size()));
        String description = "Draw something related to " + theme + " using the style/tag: " + tag + "!";

        // Ensure new challenge starts after the last one ends if exists
        Optional<ChallengeEntity> lastChallenge = challengeRepository.findTopByOrderByEndDateDesc();
        LocalDateTime effectiveStart = startDate;

        if (lastChallenge.isPresent() && lastChallenge.get().getEndDate().isAfter(startDate)) {
            effectiveStart = lastChallenge.get().getEndDate().plusSeconds(1);
            // Logic adjustment: If the last one is still active but we called this,
            // it means we failed to find it via findActiveChallenge or we want to force
            // next.
            // For simplicity, let's start "now" and end in 7 days.
            effectiveStart = LocalDateTime.now();
        }

        LocalDateTime endDate = effectiveStart.plusDays(7);

        ChallengeEntity newChallenge = new ChallengeEntity(
                theme,
                description,
                effectiveStart,
                endDate,
                tag);

        return challengeRepository.save(newChallenge);
    }

    public ArtworkEntity submitChallengeEntry(int challengeId, int artistId, ArtworkEntity artwork) {
        ChallengeEntity challenge = challengeRepository.findById(challengeId)
                .orElseThrow(() -> new RuntimeException("Challenge not found"));

        // Check if user already submitted for this challenge
        boolean alreadySubmitted = challenge.getArtworks().stream()
                .anyMatch(a -> a.getArtist() != null && a.getArtist().getArtistId() == artistId);

        if (alreadySubmitted) {
            throw new RuntimeException("User has already submitted an entry for this challenge.");
        }

        // Link challenge
        artwork.setChallenge(challenge);

        // Update User Streak
        Optional<ArtistEntity> artistOpt = artistRepository.findById(artistId);
        if (artistOpt.isPresent()) {
            ArtistEntity artist = artistOpt.get();
            LocalDateTime now = LocalDateTime.now();
            LocalDateTime lastParticipation = artist.getLastChallengeParticipation();

            if (lastParticipation == null) {
                // First time participating
                artist.setStreak(1);
            } else {
                long daysSinceLast = java.time.temporal.ChronoUnit.DAYS.between(lastParticipation, now);

                if (daysSinceLast <= 10) {
                    artist.setStreak(artist.getStreak() + 1);
                } else {
                    artist.setStreak(1);
                }
            }
            artist.setLastChallengeParticipation(now);
            artistRepository.save(artist);
        }

        return artwork;
    }

    public List<ArtworkEntity> getChallengeEntries(int challengeId, int userId) {
        ChallengeEntity challenge = challengeRepository.findById(challengeId)
                .orElseThrow(() -> new RuntimeException("Challenge not found"));

        List<ArtworkEntity> artworks = challenge.getArtworks();

        // Populate artist info for each artwork
        for (ArtworkEntity artwork : artworks) {
            // Find artist ID from UserArtwork
            // Note: This is an N+1 query issue, but acceptable for MVP scale.
            // Optimization would involve fetching all UserArtworks for these artwork IDs in
            // one go.
            userArtworkRepository.findAll().stream()
                    .filter(ua -> ua.getId().getArtworkId() == artwork.getArtworkId())
                    .findFirst()
                    .ifPresent(ua -> {
                        artistRepository.findById(ua.getId().getArtistId())
                                .ifPresent(artist -> artwork.setArtist(artist));
                    });
        }

        // Populate Like/Favorite status if userId is provided
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
    }

    public int calculateUserStreak(int artistId) {
        ArtistEntity artist = artistRepository.findById(artistId).orElse(null);
        if (artist != null) {
            return artist.getStreak();
        }
        return 0;
    }
}
