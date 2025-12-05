package com.appdev.siventin.lugatimang3.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.appdev.siventin.lugatimang3.entity.TagEntity;

public interface TagRepository extends JpaRepository<TagEntity, Integer> {
    TagEntity findByName(String name);
}