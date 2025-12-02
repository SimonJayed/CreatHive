package com.appdev.siventin.lugatimang3.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.appdev.siventin.lugatimang3.entity.CommentEntity;
import com.appdev.siventin.lugatimang3.service.CommentService;

@RestController
@RequestMapping("/comments")
@CrossOrigin(origins = "http://localhost:3000")
public class CommentController {

    @Autowired
    private CommentService commentService;

    @PostMapping("/addComment")
    public CommentEntity addComment(@RequestParam int blogId, @RequestParam int artistId,
            @RequestParam String content) {
        return commentService.addComment(blogId, artistId, content);
    }

    @GetMapping("/getCommentsByBlogId/{blogId}")
    public List<CommentEntity> getCommentsByBlogId(@PathVariable int blogId) {
        return commentService.getCommentsByBlogId(blogId);
    }
}
