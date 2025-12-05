package com.appdev.siventin.lugatimang3.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.appdev.siventin.lugatimang3.entity.ArtistInterestEntity;

@Repository
public interface ArtistInterestRepository
        extends JpaRepository<ArtistInterestEntity, ArtistInterestEntity.ArtistInterestKey> {
}
