package com.appdev.siventin.lugatimang3.controller;

import com.appdev.siventin.lugatimang3.entity.ArtworkEntity;
import com.appdev.siventin.lugatimang3.entity.ChallengeEntity;
import com.appdev.siventin.lugatimang3.service.ChallengeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/challenges")
@CrossOrigin(origins = "http://localhost:3000")
public class ChallengeController {

    @Autowired
    private ChallengeService challengeService;

    @GetMapping("/current")
    public ChallengeEntity getCurrentChallenge() {
        return challengeService.getCurrentChallenge();
    }

    @GetMapping("/{challengeId}/entries")
    public List<ArtworkEntity> getChallengeEntries(@PathVariable int challengeId,
            @RequestParam(required = false, defaultValue = "0") int userId) {
        return challengeService.getChallengeEntries(challengeId, userId);
    }

    @GetMapping("/streak/{artistId}")
    public int getUserStreak(@PathVariable int artistId) {
        return challengeService.calculateUserStreak(artistId);
    }
}
