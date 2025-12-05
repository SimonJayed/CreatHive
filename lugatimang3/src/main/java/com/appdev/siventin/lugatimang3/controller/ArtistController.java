package com.appdev.siventin.lugatimang3.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.appdev.siventin.lugatimang3.entity.ArtistEntity;
import com.appdev.siventin.lugatimang3.service.ArtistService;

@RestController
@RequestMapping("/artists")
@CrossOrigin(origins = "http://localhost:3000")
public class ArtistController {

    @Autowired
    ArtistService aservice;

    @PostMapping("/insertArtist")
    public ResponseEntity<?> insertArtist(@RequestBody ArtistEntity artist) {
        try {
            return ResponseEntity.ok(aservice.insertArtist(artist));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
        }
    }

    @GetMapping("/getAllArtists")
    public List<ArtistEntity> getAllArtists() {
        return aservice.getAllArtists();
    }

    @GetMapping("/getArtistById/{artistId}")
    public ArtistEntity getArtistById(@PathVariable int artistId) {
        return aservice.getArtistById(artistId);
    }

    @PutMapping("/updateArtist")
    public ArtistEntity updateArtist(@RequestParam int artistId, @RequestBody ArtistEntity newArtistDetails) {
        return aservice.updateArtist(artistId, newArtistDetails);
    }

    @DeleteMapping("/deleteArtist/{artistId}")
    public String deleteArtist(@PathVariable int artistId) {
        return aservice.deleteArtist(artistId);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody ArtistEntity loginDetails) {
        ArtistEntity artist = aservice.login(loginDetails.getUsername(), loginDetails.getPassword());
        if (artist != null) {
            return ResponseEntity.ok(artist);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody ArtistEntity artist) {
        try {
            return ResponseEntity.ok(aservice.insertArtist(artist));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
        }
    }
}
