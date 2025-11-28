package com.appdev.siventin.lugatimang3.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.appdev.siventin.lugatimang3.entity.ArtworkTagEntity;

@Repository
public interface ArtworkTagRepository extends JpaRepository<ArtworkTagEntity, ArtworkTagEntity.ArtworkTagKey> {
}
