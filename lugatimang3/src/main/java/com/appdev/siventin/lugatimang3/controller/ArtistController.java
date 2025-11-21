package com.appdev.siventin.lugatimang3.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.appdev.siventin.lugatimang3.entity.ArtistEntity;
import com.appdev.siventin.lugatimang3.service.ArtistService;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PathVariable;

@RestController
@RequestMapping("/artists")
@CrossOrigin(origins = "http://localhost:3000")
public class ArtistController {

    @Autowired
    ArtistService iservice;

    @PostMapping("/insertArtist")
    public ArtistEntity insertArtist(@RequestBody ArtistEntity artist) {
        return iservice.insertArtist(artist);
    }

    @GetMapping("/getAllArtists")
    public List<ArtistEntity> getAllArtists() {
        return iservice.getAllArtists();
    }

    @PutMapping("/updateArtist")
    public ArtistEntity updateArtist(@RequestParam int artistId, @RequestBody ArtistEntity newArtistDetails) {
        return iservice.updateArtist(artistId, newArtistDetails);
    }

    @DeleteMapping("/deleteArtist/{artistId}")
    public String deleteArtist(@PathVariable int artistId) {
        return iservice.deleteArtist(artistId);
    }

}
