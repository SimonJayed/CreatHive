package com.appdev.siventin.lugatimang3.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.appdev.siventin.lugatimang3.entity.BlogEntity;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface BlogRepository extends JpaRepository<BlogEntity, Integer> {
    // Custom query method to find blogs by artist ID
    List<BlogEntity> findByArtistId(int artistId);
}