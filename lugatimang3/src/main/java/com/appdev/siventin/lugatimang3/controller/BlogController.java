package com.appdev.siventin.lugatimang3.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.appdev.siventin.lugatimang3.entity.BlogEntity;
import com.appdev.siventin.lugatimang3.service.BlogService;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PathVariable;

@RestController
@RequestMapping("/blogs")
@CrossOrigin(origins = "http://localhost:3000")
public class BlogController {

    @Autowired
    BlogService bservice;

    @PostMapping("/insertBlog")
    public BlogEntity insertBlog(@RequestBody BlogEntity blog, @RequestParam int artistId) {
        return bservice.insertBlog(blog, artistId);
    }

    @GetMapping("/getAllBlogs")
    public List<BlogEntity> getAllBlogs(@RequestParam(required = false, defaultValue = "0") int userId) {
        return bservice.getAllBlogs(userId);
    }

    @GetMapping("/getBlogsByArtistId/{artistId}")
    public List<BlogEntity> getBlogsByArtistId(@PathVariable int artistId,
            @RequestParam(required = false, defaultValue = "0") int userId) {
        return bservice.getBlogsByArtistId(artistId, userId);
    }

    @GetMapping("/getBlogById/{blogId}")
    public BlogEntity getBlogById(@PathVariable int blogId,
            @RequestParam(required = false, defaultValue = "0") int userId) {
        return bservice.getBlogById(blogId, userId);
    }

    @PutMapping("/updateBlog")
    public BlogEntity updateBlog(@RequestParam int blogId, @RequestBody BlogEntity newBlogDetails) {
        return bservice.updateBlog(blogId, newBlogDetails);
    }

    @DeleteMapping("/deleteBlog/{blogId}")
    public String deleteBlog(@PathVariable int blogId, @RequestParam int artistId) {
        return bservice.deleteBlog(blogId, artistId);
    }

    @PutMapping("/likeBlog/{blogId}/{userId}")
    public BlogEntity likeBlog(@PathVariable int blogId, @PathVariable int userId) {
        return bservice.likeBlog(blogId, userId);
    }

    @PostMapping("/insertBlogTag")
    public void insertBlogTag(@RequestParam int blogId, @RequestParam int tagId) {
        bservice.insertBlogTag(blogId, tagId);
    }

    @GetMapping("/getBlogsByTagId/{tagId}")
    public List<BlogEntity> getBlogsByTagId(@PathVariable int tagId,
            @RequestParam(required = false, defaultValue = "0") int userId) {
        return bservice.getBlogsByTagId(tagId, userId);
    }

    @GetMapping("/getTagsByBlogId/{blogId}")
    public List<com.appdev.siventin.lugatimang3.entity.TagEntity> getTagsByBlogId(@PathVariable int blogId) {
        return bservice.getTagsByBlogId(blogId);
    }

    @PutMapping("/updateBlogTags")
    public void updateBlogTags(@RequestParam int blogId, @RequestBody List<Integer> tagIds) {
        bservice.updateBlogTags(blogId, tagIds);
    }

    @GetMapping("/getRelatedBlogs/{blogId}")
    public List<BlogEntity> getRelatedBlogs(@PathVariable int blogId,
            @RequestParam(required = false, defaultValue = "0") int userId) {
        return bservice.getRelatedBlogs(blogId, userId);
    }
}
