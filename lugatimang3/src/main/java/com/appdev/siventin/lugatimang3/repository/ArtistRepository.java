package com.appdev.siventin.lugatimang3.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.appdev.siventin.lugatimang3.entity.ArtistEntity;

public interface ArtistRepository extends JpaRepository<ArtistEntity, Integer> {
    ArtistEntity findByUsername(String username);

    boolean existsByUsername(String username);

    boolean existsByEmail(String email);
}
