package com.appdev.siventin.lugatimang3.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.appdev.siventin.lugatimang3.entity.BlogTagEntity;
import com.appdev.siventin.lugatimang3.entity.BlogTagEntity.BlogTagKey;

public interface BlogTagRepository extends JpaRepository<BlogTagEntity, BlogTagKey> {
}
