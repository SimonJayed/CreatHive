package com.appdev.siventin.lugatimang3.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.appdev.siventin.lugatimang3.entity.BlogEntity;

public interface BlogRepository extends JpaRepository<BlogEntity, Integer> {
}