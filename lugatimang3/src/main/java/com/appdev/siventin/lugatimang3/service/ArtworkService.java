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
    ArtworkRepository wrepo;

    public ArtworkService() {
    }

    // Create
    public ArtworkEntity insertArtwork(ArtworkEntity artwork) {
        return wrepo.save(artwork);
    }

    // Read
    public List<ArtworkEntity> getAllArtworks() {
        return wrepo.findAll();
    }

    public ArtworkEntity getArtworkBydescription(String description) throws NameNotFoundException {
        if (wrepo.findByDescription(description) != null)
            return wrepo.findByDescription(description);
        else
            throw new NameNotFoundException(
                    "There is no Artwork having that description " + description + " in the records.");

    }

    // Update
    @SuppressWarnings("finally")
    public ArtworkEntity updateArtwork(int artworkId, ArtworkEntity newArtworkDetails) {
        ArtworkEntity Artwork = new ArtworkEntity();
        try {
            Artwork = wrepo.findById(artworkId).get();
            Artwork.setDescription(newArtworkDetails.getDescription());
            Artwork.setCreationDate(newArtworkDetails.getCreationDate());
            Artwork.setCategory(newArtworkDetails.getCategory());
        } catch (NoSuchElementException ex) {
            throw new NoSuchElementException("Artwork " + artworkId + " does not exist.");
        } finally {
            return wrepo.save(Artwork);
        }
    }

    // Delete
    @SuppressWarnings("unused")
    public String deleteArtwork(int artworkId) {
        String msg = "";

        if (wrepo.findById(artworkId) != null) {
            wrepo.deleteById(artworkId);
            msg = "Artwork " + artworkId + "is successfully deleted!";
        } else
            msg = "Artwork " + artworkId + " does not exist.";
        return msg;
    }

}
