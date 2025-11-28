package com.appdev.siventin.lugatimang3.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.appdev.siventin.lugatimang3.entity.CommentOnBlogEntity;
import com.appdev.siventin.lugatimang3.service.CommentOnBlogService;

@RestController
@RequestMapping("/commentOnBlog")
public class CommentOnBlogController {

    @Autowired
    private CommentOnBlogService commentOnBlogService;

    @GetMapping("/getAll")
    public List<CommentOnBlogEntity> getAllCommentsOnBlog() {
        return commentOnBlogService.getAllCommentsOnBlog();
    }

    @PostMapping("/insert")
    public CommentOnBlogEntity insertCommentOnBlog(@RequestBody Map<String, Integer> payload) {
        return commentOnBlogService.saveCommentOnBlog(payload.get("commentId"), payload.get("blogId"));
    }
}
