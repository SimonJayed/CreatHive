package com.appdev.siventin.lugatimang3.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;

import com.appdev.siventin.lugatimang3.entity.BlogTagEntity;
import com.appdev.siventin.lugatimang3.service.BlogTagService;

@RestController
@RequestMapping("/blogTag")
@CrossOrigin(origins = "http://localhost:3000")
public class BlogTagController {

    @Autowired
    private BlogTagService blogTagService;

    @GetMapping("/getAll")
    public List<BlogTagEntity> getAllBlogTags() {
        return blogTagService.getAllBlogTags();
    }

    @PostMapping("/insert")
    public BlogTagEntity insertBlogTag(@RequestBody Map<String, Integer> payload) {
        return blogTagService.saveBlogTag(payload.get("blogId"), payload.get("tagId"));
    }
}
