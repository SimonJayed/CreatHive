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
    ArtworkService wservice;

    @PostMapping("/insertArtwork")
    public ArtworkEntity insertArwork(@RequestBody ArtworkEntity artwork) {
        return wservice.insertArtwork(artwork);
    }

    @GetMapping("/getAllArworks")
    public List<ArtworkEntity> getAllArtworks() {
        return wservice.getAllArtworks();
    }

    @PutMapping("/updateArtwork")
    public ArtworkEntity updateArtwork(@RequestParam int artworkId, @RequestBody ArtworkEntity newArtworkDetails) {
        return wservice.updateArtwork(artworkId, newArtworkDetails);
    }

    @DeleteMapping("/deleteArtwork/{artworkId}")
    public String deleteArtwork(@PathVariable int artworkId) {
        return wservice.deleteArtwork(artworkId);
    }

}
