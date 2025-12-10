package com.appdev.siventin.lugatimang3.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.appdev.siventin.lugatimang3.entity.FavoritesEntity;

@Repository
public interface FavoritesRepository
        extends JpaRepository<FavoritesEntity, com.appdev.siventin.lugatimang3.entity.FavoritesEntity.FavoritesKey> {

    @org.springframework.data.jpa.repository.Query("SELECT f.id.artworkId FROM FavoritesEntity f WHERE f.id.artistId = :userId")
    java.util.List<Integer> findFavoriteArtworkIdsByUserId(
            @org.springframework.data.repository.query.Param("userId") int userId);
}
