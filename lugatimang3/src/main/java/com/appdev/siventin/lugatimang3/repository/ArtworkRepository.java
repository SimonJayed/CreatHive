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

    @org.springframework.data.jpa.repository.Query("SELECT DISTINCT a FROM ArtworkEntity a LEFT JOIN a.artworkTags at WHERE (a.artist.artistId = :artistId OR at.tag.tagId IN :tagIds) AND a.artworkId != :excludeId AND a.isArchived = false")
    List<ArtworkEntity> findRelatedArtworks(
            @org.springframework.data.repository.query.Param("artistId") int artistId,
            @org.springframework.data.repository.query.Param("tagIds") List<Integer> tagIds,
            @org.springframework.data.repository.query.Param("excludeId") int excludeId,
            org.springframework.data.domain.Pageable pageable);
}
