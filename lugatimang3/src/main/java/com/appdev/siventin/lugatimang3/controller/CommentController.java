package com.appdev.siventin.lugatimang3.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.appdev.siventin.lugatimang3.entity.CommentEntity;
import com.appdev.siventin.lugatimang3.service.CommentService;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("/comments")
@CrossOrigin(origins = "http://localhost:3000")
public class CommentController {

    @Autowired
    CommentService cservice;

    @PostMapping("/insertComment")
    public CommentEntity insertComment(@RequestBody CommentEntity comment) {
        return cservice.insertComment(comment);
    }

    @GetMapping("/getAllComments")
    public List<CommentEntity> getAllComments() {
        return cservice.getAllComments();
    }

    @PutMapping("/updateComment")
    public CommentEntity updateComment(@RequestParam int commentId, @RequestBody CommentEntity newCommentDetails) {
        return cservice.updateComment(commentId, newCommentDetails);
    }

    @DeleteMapping("/deleteComment/{commentId}")
    public String deleteComment(@PathVariable int commentId) {
        return cservice.deleteComment(commentId);
    }

}
