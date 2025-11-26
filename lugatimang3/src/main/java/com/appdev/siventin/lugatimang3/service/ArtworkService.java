package com.appdev.siventin.lugatimang3.service;

import java.util.List;
import java.util.NoSuchElementException;

import javax.naming.NameNotFoundException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.appdev.siventin.lugatimang3.entity.ArtworkEntity;
import com.appdev.siventin.lugatimang3.repository.ArtworkRepository;

@Service
public class ArtworkService {

    @Autowired
    ArtworkRepository awrepo;

    public ArtworkService() {
    }

    // Create
    public ArtworkEntity insertArtwork(ArtworkEntity artwork) {
        return awrepo.save(artwork);
    }

    // Read
    public List<ArtworkEntity> getAllArtworks() {
        return awrepo.findAll();
    }

    // public ArtworkEntity getArtworkBydescription(String description) throws
    // NameNotFoundException {
    // if (awrepo.findByDescription(description) != null)
    // return awrepo.findByDescription(description);
    // else
    // throw new NameNotFoundException(
    // "There is no Artwork having that description " + description + " in the
    // records.");
    // }

    // Update
    @SuppressWarnings("finally")
    public ArtworkEntity updateArtwork(int artworkId, ArtworkEntity newArtworkDetails) {
        ArtworkEntity Artwork = new ArtworkEntity();
        try {
            Artwork = awrepo.findById(artworkId).get();
            Artwork.setDescription(newArtworkDetails.getDescription());
            Artwork.setCreationDate(newArtworkDetails.getCreationDate());
            Artwork.setCategory(newArtworkDetails.getCategory());
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

}
