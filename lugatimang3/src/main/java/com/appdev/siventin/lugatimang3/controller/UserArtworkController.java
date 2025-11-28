package com.appdev.siventin.lugatimang3.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.appdev.siventin.lugatimang3.entity.UserArtworkEntity;
import com.appdev.siventin.lugatimang3.service.UserArtworkService;

@RestController
@RequestMapping("/userArtwork")
public class UserArtworkController {

    @Autowired
    private UserArtworkService userArtworkService;

    @GetMapping("/getAll")
    public List<UserArtworkEntity> getAllUserArtworks() {
        return userArtworkService.getAllUserArtworks();
    }

    @PostMapping("/insert")
    public UserArtworkEntity insertUserArtwork(@RequestBody Map<String, Integer> payload) {
        return userArtworkService.saveUserArtwork(payload.get("artworkId"), payload.get("artistId"));
    }
}
