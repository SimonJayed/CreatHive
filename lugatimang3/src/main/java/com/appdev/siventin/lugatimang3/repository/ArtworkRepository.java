package com.appdev.siventin.lugatimang3.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import com.appdev.siventin.lugatimang3.entity.ArtworkEntity;

public interface ArtworkRepository extends JpaRepository<ArtworkEntity, Integer> {

    // Custom finder for direct relationship
    List<ArtworkEntity> findByArtist_ArtistId(int artistId);

    // Custom finder for existing logic
    ArtworkEntity findByDescription(String description);

    @org.springframework.data.jpa.repository.Query(value = "SELECT artist_id FROM user_artwork WHERE artwork_id = :artworkId LIMIT 1", nativeQuery = true)
    Integer getLegacyArtistId(@org.springframework.data.repository.query.Param("artworkId") int artworkId);

    @org.springframework.data.jpa.repository.Modifying
    @org.springframework.data.jpa.repository.Query(value = "DELETE FROM user_artwork WHERE artwork_id = :artworkId", nativeQuery = true)
    void deleteLegacyUserArtwork(@org.springframework.data.repository.query.Param("artworkId") int artworkId);
}
