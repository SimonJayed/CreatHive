package com.appdev.siventin.lugatimang3.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import com.appdev.siventin.lugatimang3.entity.ArtworkEntity;

public interface ArtworkRepository extends JpaRepository<ArtworkEntity, Integer> {
    List<ArtworkEntity> findByArtistId(int artistId);

    ArtworkEntity findByDescription(String description);
}
