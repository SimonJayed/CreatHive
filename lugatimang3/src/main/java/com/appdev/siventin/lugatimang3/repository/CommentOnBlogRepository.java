package com.appdev.siventin.lugatimang3.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.appdev.siventin.lugatimang3.entity.CommentOnBlogEntity;

@Repository
public interface CommentOnBlogRepository
        extends JpaRepository<CommentOnBlogEntity, CommentOnBlogEntity.CommentOnBlogKey> {
}
