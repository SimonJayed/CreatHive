package com.appdev.siventin.lugatimang3.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.appdev.siventin.lugatimang3.entity.BlogLikesEntity;

@Repository
public interface BlogLikesRepository extends JpaRepository<BlogLikesEntity, BlogLikesEntity.BlogLikesKey> {

    @org.springframework.data.jpa.repository.Query("SELECT b.id.blogId FROM BlogLikesEntity b WHERE b.id.userId = :userId")
    java.util.List<Integer> findLikedBlogIdsByUserId(
            @org.springframework.data.repository.query.Param("userId") int userId);
}
