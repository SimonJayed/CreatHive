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

    public List<BlogEntity> getAllBlogs(int userId) {
        List<BlogEntity> blogs = brepo.findAll();
        if (userId > 0) {
            for (BlogEntity blog : blogs) {
                com.appdev.siventin.lugatimang3.entity.BlogLikesEntity.BlogLikesKey key = new com.appdev.siventin.lugatimang3.entity.BlogLikesEntity.BlogLikesKey(
                        blog.getBlogId(), userId);
                blog.setIsLiked(blogLikesRepository.existsById(key));
            }
        }
        return blogs;
    }

    public List<BlogEntity> getBlogsByArtistId(int artistId, int userId) {
        try {
            // Find all blog IDs associated with the artist
            List<Integer> blogIds = userBlogRepository.findAll().stream()
                    .filter(ub -> ub.getId().getUserId() == artistId)
                    .map(ub -> ub.getId().getBlogId())
                    .collect(java.util.stream.Collectors.toList());

            // Fetch blogs by IDs
            List<BlogEntity> blogs = brepo.findAllById(blogIds);

            if (userId > 0) {
                for (BlogEntity blog : blogs) {
                    com.appdev.siventin.lugatimang3.entity.BlogLikesEntity.BlogLikesKey key = new com.appdev.siventin.lugatimang3.entity.BlogLikesEntity.BlogLikesKey(
                            blog.getBlogId(), userId);
                    blog.setIsLiked(blogLikesRepository.existsById(key));
                }
            }
            return blogs;
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

        if (brepo.existsById(blogId)) {
            // 1. Delete from UserBlog (Link to Artist)
            List<com.appdev.siventin.lugatimang3.entity.UserBlogEntity> userBlogs = userBlogRepository.findAll()
                    .stream()
                    .filter(ub -> ub.getId().getBlogId() == blogId)
                    .collect(java.util.stream.Collectors.toList());
            userBlogRepository.deleteAll(userBlogs);

            // 2. Delete from BlogLikes
            List<com.appdev.siventin.lugatimang3.entity.BlogLikesEntity> likes = blogLikesRepository.findAll().stream()
                    .filter(l -> l.getId().getBlogId() == blogId)
                    .collect(java.util.stream.Collectors.toList());
            blogLikesRepository.deleteAll(likes);

            // 3. Delete from CommentOnBlog (Link to Comments)
            List<com.appdev.siventin.lugatimang3.entity.CommentOnBlogEntity> commentLinks = commentOnBlogRepository
                    .findAll().stream()
                    .filter(c -> c.getId().getBlogId() == blogId)
                    .collect(java.util.stream.Collectors.toList());
            commentOnBlogRepository.deleteAll(commentLinks);

            // 4. Delete the Blog itself
            brepo.deleteById(blogId);
            msg = "Blog " + blogId + " is successfully deleted!";
        } else {
            msg = "Blog " + blogId + " does not exist.";
        }
        return msg;
    }

    @Autowired
    com.appdev.siventin.lugatimang3.repository.BlogLikesRepository blogLikesRepository;

    @Autowired
    com.appdev.siventin.lugatimang3.repository.CommentOnBlogRepository commentOnBlogRepository;

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
            blog.setIsLiked(false);
        } else {
            // Like
            com.appdev.siventin.lugatimang3.entity.BlogLikesEntity like = new com.appdev.siventin.lugatimang3.entity.BlogLikesEntity(
                    blogId, userId);
            blogLikesRepository.save(like);
            int currentLikes = blog.getLikeCount() == null ? 0 : blog.getLikeCount();
            blog.setLikeCount(currentLikes + 1);
            blog.setIsLiked(true);
        }

        return brepo.save(blog);
    }
}
