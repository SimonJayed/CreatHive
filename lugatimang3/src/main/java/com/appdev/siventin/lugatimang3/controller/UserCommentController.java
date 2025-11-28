package com.appdev.siventin.lugatimang3.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.appdev.siventin.lugatimang3.entity.UserCommentEntity;
import com.appdev.siventin.lugatimang3.service.UserCommentService;

@RestController
@RequestMapping("/userComment")
public class UserCommentController {

    @Autowired
    private UserCommentService userCommentService;

    @GetMapping("/getAll")
    public List<UserCommentEntity> getAllUserComments() {
        return userCommentService.getAllUserComments();
    }

    @PostMapping("/insert")
    public UserCommentEntity insertUserComment(@RequestBody Map<String, Integer> payload) {
        return userCommentService.saveUserComment(payload.get("artistId"), payload.get("commentId"));
    }
}
