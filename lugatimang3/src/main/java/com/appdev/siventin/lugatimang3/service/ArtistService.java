package com.appdev.siventin.lugatimang3.service;

import java.util.List;
import java.util.NoSuchElementException;

import javax.naming.NameNotFoundException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.appdev.siventin.lugatimang3.entity.ArtistEntity;
import com.appdev.siventin.lugatimang3.repository.ArtistRepository;

@Service
public class ArtistService {

    @Autowired
    ArtistRepository irepo;

    public ArtistService() {
    }

    // Create
    public ArtistEntity insertArtist(ArtistEntity artist) {
        return irepo.save(artist);
    }

    // Read
    public List<ArtistEntity> getAllArtists() {
        return irepo.findAll();
    }

    public ArtistEntity getArtistByusername(String username) throws NameNotFoundException {
        if (irepo.findByDescription(username) != null)
            return irepo.findByDescription(username);
        else
            throw new NameNotFoundException("There is no Artist having that username " + username + " in the records.");

    }

    // Update
    @SuppressWarnings("finally")
    public ArtistEntity updateArtist(int artistId, ArtistEntity newArtistDetails) {
        ArtistEntity Artist = new ArtistEntity();
        try {
            Artist = irepo.findById(artistId).get();
            Artist.setUsername(newArtistDetails.getUsername());
            Artist.setEmail(newArtistDetails.getEmail());
            Artist.setPassword(newArtistDetails.getPassword());
            Artist.setBio(newArtistDetails.getBio());
            Artist.setDateCreated(newArtistDetails.getDateCreated());
        } catch (NoSuchElementException ex) {
            throw new NoSuchElementException("Artist " + artistId + " does not exist.");
        } finally {
            return irepo.save(Artist);
        }
    }

    // Delete
    @SuppressWarnings("unused")
    public String deleteArtist(int artistId) {
        String msg = "";

        if (irepo.findById(artistId) != null) {
            irepo.deleteById(artistId);
            msg = "Artist " + artistId + "is successfully deleted!";
        } else
            msg = "Artist " + artistId + " does not exist.";
        return msg;
    }

}
