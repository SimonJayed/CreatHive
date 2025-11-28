package com.appdev.siventin.lugatimang3.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.appdev.siventin.lugatimang3.entity.ArtworkEntity;

public interface ArtworkRepository extends JpaRepository<ArtworkEntity, Integer> {

    ArtworkEntity findByDescription(String description);
}
