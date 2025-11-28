package com.appdev.siventin.lugatimang3.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.appdev.siventin.lugatimang3.entity.FavoritesEntity;
import com.appdev.siventin.lugatimang3.repository.FavoritesRepository;

@Service
public class FavoritesService {

    @Autowired
    private FavoritesRepository favoritesRepository;

    public FavoritesEntity saveFavorite(int artworkId, int artistId) {
        return favoritesRepository.save(new FavoritesEntity(artworkId, artistId));
    }

    public List<FavoritesEntity> getAllFavorites() {
        return favoritesRepository.findAll();
    }
}
