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

import com.appdev.siventin.lugatimang3.entity.ArtworkTagEntity;
import com.appdev.siventin.lugatimang3.service.ArtworkTagService;

@RestController
@RequestMapping("/artworkTag")
@CrossOrigin(origins = "http://localhost:3000")
public class ArtworkTagController {

    @Autowired
    private ArtworkTagService artworkTagService;

    @GetMapping("/getAll")
    public List<ArtworkTagEntity> getAllArtworkTags() {
        return artworkTagService.getAllArtworkTags();
    }

    @PostMapping("/insert")
    public ArtworkTagEntity insertArtworkTag(@RequestBody Map<String, Integer> payload) {
        return artworkTagService.saveArtworkTag(payload.get("artworkId"), payload.get("tagId"));
    }
}
