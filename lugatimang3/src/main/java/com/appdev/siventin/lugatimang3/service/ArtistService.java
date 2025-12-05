package com.appdev.siventin.lugatimang3.service;

import java.util.List;
import java.util.NoSuchElementException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.appdev.siventin.lugatimang3.entity.ArtistEntity;
import com.appdev.siventin.lugatimang3.repository.ArtistRepository;
import com.appdev.siventin.lugatimang3.repository.UserArtworkRepository;
import org.springframework.context.annotation.Lazy;

@Service
public class ArtistService {

    @Autowired
    ArtistRepository arepo;

    @Autowired
    UserArtworkRepository uaRepo;

    @Autowired
    @Lazy
    ArtworkService awService;

    public ArtistEntity insertArtist(ArtistEntity artist) {
        if (arepo.existsByUsername(artist.getUsername())) {
            throw new IllegalArgumentException("Username already exists");
        }
        if (arepo.existsByEmail(artist.getEmail())) {
            throw new IllegalArgumentException("Email already exists");
        }
        return arepo.save(artist);
    }

    public List<ArtistEntity> getAllArtists() {
        return arepo.findAll();
    }

    public ArtistEntity updateArtist(int artistId, ArtistEntity newArtistDetails) {
        ArtistEntity artist = arepo.findById(artistId)
                .orElseThrow(() -> new NoSuchElementException("Artist " + artistId + " does not exist."));

        if (newArtistDetails.getName() != null)
            artist.setName(newArtistDetails.getName());
        if (newArtistDetails.getBio() != null)
            artist.setBio(newArtistDetails.getBio());
        if (newArtistDetails.getInterest() != null)
            artist.setInterest(newArtistDetails.getInterest());
        if (newArtistDetails.getWebsite() != null)
            artist.setWebsite(newArtistDetails.getWebsite());
        if (newArtistDetails.getUsername() != null)
            artist.setUsername(newArtistDetails.getUsername());
        if (newArtistDetails.getPassword() != null)
            artist.setPassword(newArtistDetails.getPassword());
        if (newArtistDetails.getEmail() != null)
            artist.setEmail(newArtistDetails.getEmail());
        if (newArtistDetails.getProfileImage() != null)
            artist.setProfileImage(newArtistDetails.getProfileImage());

        return arepo.save(artist);
    }

    public String deleteArtist(int artistId) {
        String msg = "";

        if (arepo.findById(artistId).isPresent()) {
            // 1. Delete all associated artworks (Cascading Delete)
            try {
                // Find all artwork IDs for this artist
                List<Integer> artworkIds = uaRepo.findAll().stream()
                        .filter(ua -> ua.getId().getArtistId() == artistId)
                        .map(ua -> ua.getId().getArtworkId())
                        .toList();

                // Delete each artwork using ArtworkService to ensure full cleanup
                for (Integer artId : artworkIds) {
                    awService.deleteArtwork(artId, artistId);
                }
            } catch (Exception e) {
                System.err.println("Error deleting associated artworks for artist " + artistId + ": " + e.getMessage());
                // Continue to delete artist even if artwork deletion fails?
                // Preferably yes, to allow account removal, but logging is important.
            }

            // 2. Delete the Artist
            arepo.deleteById(artistId);
            msg = "Artist " + artistId + " and their artworks are successfully deleted!";
        } else {
            msg = "Artist " + artistId + " does not exist.";
        }
        return msg;
    }

    public ArtistEntity getArtistById(int artistId) {
        try {
            return arepo.findById(artistId).orElse(null);
        } catch (Exception e) {
            return null;
        }
    }

    public ArtistEntity login(String username, String password) {
        ArtistEntity artist = arepo.findByUsername(username);
        if (artist != null && artist.getPassword().equals(password)) {
            return artist;
        }
        return null;
    }
}
