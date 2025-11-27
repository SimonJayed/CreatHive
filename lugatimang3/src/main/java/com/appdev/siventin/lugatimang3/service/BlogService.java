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

    public BlogEntity insertBlog(BlogEntity blog) {
        return brepo.save(blog);
    }

    public List<BlogEntity> getAllBlogs() {
        return brepo.findAll();
    }

    public List<BlogEntity> getBlogsByArtistId(int artistId) {
        return brepo.findByArtistId(artistId);
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
}
