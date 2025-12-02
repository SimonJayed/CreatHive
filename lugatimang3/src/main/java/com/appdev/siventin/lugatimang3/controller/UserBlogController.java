package com.appdev.siventin.lugatimang3.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.appdev.siventin.lugatimang3.entity.UserBlogEntity;
import com.appdev.siventin.lugatimang3.service.UserBlogService;

@RestController
@RequestMapping("/userBlog")
@org.springframework.web.bind.annotation.CrossOrigin(origins = "http://localhost:3000")
public class UserBlogController {

    @Autowired
    private UserBlogService userBlogService;

    @GetMapping("/getAll")
    public List<UserBlogEntity> getAllUserBlogs() {
        return userBlogService.getAllUserBlogs();
    }

    @PostMapping("/insert")
    public UserBlogEntity insertUserBlog(@RequestBody Map<String, Integer> payload) {
        return userBlogService.saveUserBlog(payload.get("blogId"), payload.get("userId"));
    }
}
