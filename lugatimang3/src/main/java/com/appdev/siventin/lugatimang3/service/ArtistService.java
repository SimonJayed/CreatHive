package com.appdev.siventin.lugatimang3.service;

import java.util.List;
import java.util.NoSuchElementException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.appdev.siventin.lugatimang3.entity.ArtistEntity;
import com.appdev.siventin.lugatimang3.repository.ArtistRepository;

@Service
public class ArtistService {

    @Autowired
    ArtistRepository arepo;

    public ArtistEntity insertArtist(ArtistEntity artist) {
        return arepo.save(artist);
    }

    public List<ArtistEntity> getAllArtists() {
        return arepo.findAll();
    }

    @SuppressWarnings("finally")
    public ArtistEntity updateArtist(int artistId, ArtistEntity newArtistDetails) {
        ArtistEntity artist = new ArtistEntity();
        try {
            artist = arepo.findById(artistId).get();
            artist.setName(newArtistDetails.getName());
            artist.setBio(newArtistDetails.getBio());
            artist.setInterest(newArtistDetails.getInterest());

            if (newArtistDetails.getUsername() != null)
                artist.setUsername(newArtistDetails.getUsername());
            if (newArtistDetails.getPassword() != null)
                artist.setPassword(newArtistDetails.getPassword());
            if (newArtistDetails.getEmail() != null)
                artist.setEmail(newArtistDetails.getEmail());
            if (newArtistDetails.getProfileImage() != null)
                artist.setProfileImage(newArtistDetails.getProfileImage());

        } catch (NoSuchElementException ex) {
            throw new NoSuchElementException("Artist " + artistId + " does not exist.");
        } finally {
            return arepo.save(artist);
        }
    }

    public String deleteArtist(int artistId) {
        String msg = "";

        if (arepo.findById(artistId).isPresent()) {
            arepo.deleteById(artistId);
            msg = "Artist " + artistId + " is successfully deleted!";
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
