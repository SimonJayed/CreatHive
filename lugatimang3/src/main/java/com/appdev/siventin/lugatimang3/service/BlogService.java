package com.appdev.siventin.lugatimang3.service;

import java.util.List;
import java.util.NoSuchElementException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.appdev.siventin.lugatimang3.entity.BlogEntity;
import com.appdev.siventin.lugatimang3.repository.BlogRepository;

@Service
public class BlogService {

    @Autowired
    BlogRepository brepo;

    @Autowired
    com.appdev.siventin.lugatimang3.repository.UserBlogRepository userBlogRepository;

    public BlogEntity insertBlog(BlogEntity blog, int artistId) {
        try {
            // 1. Save the Blog
            if (blog.getDatePosted() == null) {
                blog.setDatePosted(new java.sql.Timestamp(System.currentTimeMillis()));
            }
            BlogEntity savedBlog = brepo.save(blog);

            // 2. Create the Association
            com.appdev.siventin.lugatimang3.entity.UserBlogEntity userBlog = new com.appdev.siventin.lugatimang3.entity.UserBlogEntity();
            com.appdev.siventin.lugatimang3.entity.UserBlogEntity.UserBlogKey id = new com.appdev.siventin.lugatimang3.entity.UserBlogEntity.UserBlogKey(
                    savedBlog.getBlogId(), artistId);
            userBlog.setId(id);
            userBlogRepository.save(userBlog);

            return savedBlog;
        } catch (Exception e) {
            e.printStackTrace();
            throw e;
        }
    }

    public List<BlogEntity> getAllBlogs() {
        return brepo.findAll();
    }

    public List<BlogEntity> getBlogsByArtistId(int artistId) {
        try {
            // Find all blog IDs associated with the artist
            List<Integer> blogIds = userBlogRepository.findAll().stream()
                    .filter(ub -> ub.getId().getUserId() == artistId)
                    .map(ub -> ub.getId().getBlogId())
                    .collect(java.util.stream.Collectors.toList());

            // Fetch blogs by IDs
            return brepo.findAllById(blogIds);
        } catch (Exception e) {
            e.printStackTrace();
            return java.util.Collections.emptyList();
        }
    }

    @SuppressWarnings("finally")
    public BlogEntity updateBlog(int blogId, BlogEntity newBlogDetails) {
        BlogEntity blog = new BlogEntity();
        try {
            blog = brepo.findById(blogId).get();
            blog.setTitle(newBlogDetails.getTitle());
            blog.setContent(newBlogDetails.getContent());
        } catch (NoSuchElementException ex) {
            throw new NoSuchElementException("Blog " + blogId + " does not exist.");
        } finally {
            return brepo.save(blog);
        }
    }

    public String deleteBlog(int blogId) {
        String msg = "";

        if (brepo.findById(blogId) != null) {
            brepo.deleteById(blogId);
            msg = "Blog " + blogId + "is successfully deleted!";
        } else {
            msg = "Blog " + blogId + " does not exist.";
        }
        return msg;
    }

    @Autowired
    com.appdev.siventin.lugatimang3.repository.BlogLikesRepository blogLikesRepository;

    public BlogEntity likeBlog(int blogId, int userId) {
        BlogEntity blog = brepo.findById(blogId)
                .orElseThrow(() -> new NoSuchElementException("Blog " + blogId + " does not exist."));

        com.appdev.siventin.lugatimang3.entity.BlogLikesEntity.BlogLikesKey key = new com.appdev.siventin.lugatimang3.entity.BlogLikesEntity.BlogLikesKey(
                blogId, userId);

        if (blogLikesRepository.existsById(key)) {
            // Unlike
            blogLikesRepository.deleteById(key);
            int currentLikes = blog.getLikeCount() == null ? 0 : blog.getLikeCount();
            blog.setLikeCount(Math.max(0, currentLikes - 1));
        } else {
            // Like
            com.appdev.siventin.lugatimang3.entity.BlogLikesEntity like = new com.appdev.siventin.lugatimang3.entity.BlogLikesEntity(
                    blogId, userId);
            blogLikesRepository.save(like);
            int currentLikes = blog.getLikeCount() == null ? 0 : blog.getLikeCount();
            blog.setLikeCount(currentLikes + 1);
        }

        return brepo.save(blog);
    }
}
