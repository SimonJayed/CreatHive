package com.appdev.siventin.lugatimang3.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.appdev.siventin.lugatimang3.entity.BlogEntity;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BlogRepository extends JpaRepository<BlogEntity, Integer> {
    List<BlogEntity> findByAuthor_ArtistId(int artistId);

    @org.springframework.data.jpa.repository.Query(value = "SELECT artist_id FROM user_blog WHERE blog_id = :blogId LIMIT 1", nativeQuery = true)
    Integer getLegacyArtistId(@org.springframework.data.repository.query.Param("blogId") int blogId);

    @org.springframework.data.jpa.repository.Modifying
    @org.springframework.data.jpa.repository.Query(value = "DELETE FROM user_blog WHERE blog_id = :blogId", nativeQuery = true)
    void deleteLegacyUserBlog(@org.springframework.data.repository.query.Param("blogId") int blogId);

    @org.springframework.data.jpa.repository.Query("SELECT DISTINCT b FROM BlogEntity b LEFT JOIN b.blogTags bt WHERE (b.author.artistId = :artistId OR bt.tag.tagId IN :tagIds) AND b.blogId != :excludeId")
    List<BlogEntity> findRelatedBlogs(
            @org.springframework.data.repository.query.Param("artistId") int artistId,
            @org.springframework.data.repository.query.Param("tagIds") List<Integer> tagIds,
            @org.springframework.data.repository.query.Param("excludeId") int excludeId,
            org.springframework.data.domain.Pageable pageable);
}