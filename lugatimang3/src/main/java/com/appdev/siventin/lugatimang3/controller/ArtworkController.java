package com.appdev.siventin.lugatimang3.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.appdev.siventin.lugatimang3.entity.ArtworkEntity;
import com.appdev.siventin.lugatimang3.service.ArtworkService;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PathVariable;

@RestController
@RequestMapping("/artworks")
@CrossOrigin(origins = "http://localhost:3000")
public class ArtworkController {

    @Autowired
    ArtworkService awservice;

    @PostMapping("/insertArtwork")
    public ArtworkEntity insertArtwork(@RequestBody ArtworkEntity artwork, @RequestParam int artistId) {
        return awservice.insertArtwork(artwork, artistId);
    }

    @PostMapping("/insertArtworkTag")
    public void insertArtworkTag(@RequestParam int artworkId, @RequestParam int tagId) {
        awservice.insertArtworkTag(artworkId, tagId);
    }

    @GetMapping("/getAllArtworks")
    public List<ArtworkEntity> getAllArtworks(@RequestParam(required = false, defaultValue = "0") int userId) {
        return awservice.getAllArtworks(userId);
    }

    @GetMapping("/getArtworksByArtistId/{artistId}")
    public List<ArtworkEntity> getArtworksByArtistId(@PathVariable int artistId) {
        return awservice.getArtworksByArtistId(artistId);
    }

    @PutMapping("/updateArtwork")
    public ArtworkEntity updateArtwork(@RequestParam int artworkId, @RequestBody ArtworkEntity newArtworkDetails) {
        return awservice.updateArtwork(artworkId, newArtworkDetails);
    }

    @DeleteMapping("/deleteArtwork/{artworkId}")
    public String deleteArtwork(@PathVariable int artworkId, @RequestParam int artistId) {
        return awservice.deleteArtwork(artworkId, artistId);
    }

    @PutMapping("/likeArtwork/{artworkId}/{userId}")
    public ArtworkEntity likeArtwork(@PathVariable int artworkId, @PathVariable int userId) {
        return awservice.likeArtwork(artworkId, userId);
    }

    @PutMapping("/favoriteArtwork/{artworkId}/{userId}")
    public void favoriteArtwork(@PathVariable int artworkId, @PathVariable int userId) {
        awservice.favoriteArtwork(artworkId, userId);
    }

    @GetMapping("/getFavoriteArtworks/{userId}")
    public List<ArtworkEntity> getFavoriteArtworks(@PathVariable int userId) {
        return awservice.getFavoriteArtworks(userId);
    }

    @GetMapping("/getArchivedArtworksByArtistId/{artistId}")
    public List<ArtworkEntity> getArchivedArtworksByArtistId(@PathVariable int artistId) {
        return awservice.getArchivedArtworksByArtistId(artistId);
    }

    @PutMapping("/archiveArtwork/{artworkId}")
    public ArtworkEntity archiveArtwork(@PathVariable int artworkId, @RequestParam boolean isArchived,
            @RequestParam int artistId) {
        return awservice.archiveArtwork(artworkId, isArchived, artistId);
    }

    @GetMapping("/getArtworksByTagId/{tagId}")
    public List<ArtworkEntity> getArtworksByTagId(@PathVariable int tagId,
            @RequestParam(required = false, defaultValue = "0") int userId) {
        return awservice.getArtworksByTagId(tagId, userId);
    }

}
