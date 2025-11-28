package com.appdev.siventin.lugatimang3.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.appdev.siventin.lugatimang3.entity.CommentEntity;
import com.appdev.siventin.lugatimang3.service.CommentService;

@RestController
@RequestMapping("/comment")
public class CommentController {

    @Autowired
    private CommentService commentService;

    @GetMapping("/getAll")
    public List<CommentEntity> getAllComments() {
        return commentService.getAllComments();
    }

    @PostMapping("/insert")
    public CommentEntity insertComment(@RequestBody CommentEntity comment) {
        return commentService.insertComment(comment);
    }

    @PutMapping("/update/{commentId}")
    public CommentEntity updateComment(@PathVariable int commentId, @RequestBody CommentEntity newCommentDetails) {
        return commentService.updateComment(commentId, newCommentDetails);
    }

    @DeleteMapping("/delete/{commentId}")
    public String deleteComment(@PathVariable int commentId) {
        return commentService.deleteComment(commentId);
    }
}
