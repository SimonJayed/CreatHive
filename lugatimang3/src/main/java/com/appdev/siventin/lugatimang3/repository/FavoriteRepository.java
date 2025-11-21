package com.appdev.siventin.lugatimang3.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.appdev.siventin.lugatimang3.entity.FavoriteEntity;
import com.appdev.siventin.lugatimang3.entity.FavoriteId;

public interface FavoriteRepository extends JpaRepository<FavoriteEntity, FavoriteId> {

    FavoriteEntity findByArtistArtistIdAndArtworkArtworkId(int artistId, int artworkId);
}
