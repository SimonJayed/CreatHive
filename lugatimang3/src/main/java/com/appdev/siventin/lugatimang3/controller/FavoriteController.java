package com.appdev.siventin.lugatimang3.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.appdev.siventin.lugatimang3.entity.FavoriteEntity;
import com.appdev.siventin.lugatimang3.service.FavoriteService;

@RestController
@RequestMapping("/favorites")
@CrossOrigin(origins = "http://localhost:3000")
public class FavoriteController {

    @Autowired
    FavoriteService fservice;

    @PostMapping("/addFavorite")
    public FavoriteEntity addFavorite(@RequestParam int artistId, @RequestParam int artworkId) {
        return fservice.addFavorite(artistId, artworkId);
    }

    @GetMapping("/getAllFavorites")
    public List<FavoriteEntity> getAllFavorites() {
        return fservice.getAllFavorites();
    }

    @DeleteMapping("/removeFavorite")
    public String removeFavorite(@RequestParam int artistId, @RequestParam int artworkId) {
        return fservice.removeFavorite(artistId, artworkId);
    }
}
