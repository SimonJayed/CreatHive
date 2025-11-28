package com.appdev.siventin.lugatimang3.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.appdev.siventin.lugatimang3.entity.CommentOnArtworkEntity;
import com.appdev.siventin.lugatimang3.service.CommentOnArtworkService;

@RestController
@RequestMapping("/commentOnArtwork")
public class CommentOnArtworkController {

    @Autowired
    private CommentOnArtworkService commentOnArtworkService;

    @GetMapping("/getAll")
    public List<CommentOnArtworkEntity> getAllCommentsOnArtwork() {
        return commentOnArtworkService.getAllCommentsOnArtwork();
    }

    @PostMapping("/insert")
    public CommentOnArtworkEntity insertCommentOnArtwork(@RequestBody Map<String, Integer> payload) {
        return commentOnArtworkService.saveCommentOnArtwork(payload.get("commentId"), payload.get("artworkId"));
    }
}
