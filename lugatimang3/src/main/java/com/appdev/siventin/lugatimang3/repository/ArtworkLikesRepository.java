package com.appdev.siventin.lugatimang3.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.appdev.siventin.lugatimang3.entity.ArtworkLikesEntity;

@Repository
public interface ArtworkLikesRepository extends
        JpaRepository<ArtworkLikesEntity, com.appdev.siventin.lugatimang3.entity.ArtworkLikesEntity.ArtworkLikesKey> {

    @org.springframework.data.jpa.repository.Query("SELECT a.id.artworkId FROM ArtworkLikesEntity a WHERE a.id.userId = :userId")
    java.util.List<Integer> findLikedArtworkIdsByUserId(
            @org.springframework.data.repository.query.Param("userId") int userId);
}
