package com.appdev.siventin.lugatimang3.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.appdev.siventin.lugatimang3.entity.BlogEntity;
import com.appdev.siventin.lugatimang3.service.BlogService;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PathVariable;



@RestController
@RequestMapping("/blogs")
public class BlogController {

    @Autowired
    BlogService bservice;

    @PostMapping("/insertBlog")
    public BlogEntity insertBlog(@RequestBody BlogEntity blog) {
        return bservice.insertBlog(blog);
    }
    
    @GetMapping("/getAllBlogs")
    public List<BlogEntity> getAllBlogs() {
        return bservice.getAllBlogs();
    }
    
    @PutMapping("/updateBlog")
    public BlogEntity updateBlog(@RequestParam int blogId, @RequestBody BlogEntity newBlogDetails){
        return bservice.updateBlog(blogId, newBlogDetails);
    }

    @DeleteMapping("/deleteBlog/{blogId}")
    public String deleteBlog(@PathVariable int blogId){
        return bservice.deleteBlog(blogId);
    }

}
