package com.appdev.siventin.lugatimang3.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.appdev.siventin.lugatimang3.entity.FavoritesEntity;
import com.appdev.siventin.lugatimang3.service.FavoritesService;

@RestController
@RequestMapping("/favorites")
public class FavoritesController {

    @Autowired
    private FavoritesService favoritesService;

    @GetMapping("/getAll")
    public List<FavoritesEntity> getAllFavorites() {
        return favoritesService.getAllFavorites();
    }

    @PostMapping("/insert")
    public FavoritesEntity insertFavorite(@RequestBody Map<String, Integer> payload) {
        return favoritesService.saveFavorite(payload.get("artworkId"), payload.get("artistId"));
    }
}
