package com.appdev.siventin.lugatimang3.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

import com.appdev.siventin.lugatimang3.entity.CommentEntity;

@Repository
public interface CommentRepository extends JpaRepository<CommentEntity, Integer> {

    // Find comments for a blog
    List<CommentEntity> findByBlog_BlogId(int blogId);

    // Find comments for an artwork
    List<CommentEntity> findByArtwork_ArtworkId(int artworkId);

    @org.springframework.data.jpa.repository.Modifying
    @org.springframework.data.jpa.repository.Query(value = "DELETE FROM user_comment WHERE comment_id = :commentId", nativeQuery = true)
    void deleteLegacyUserComment(@org.springframework.data.repository.query.Param("commentId") int commentId);
}
