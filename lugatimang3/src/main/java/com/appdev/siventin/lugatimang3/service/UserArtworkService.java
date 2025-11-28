package com.appdev.siventin.lugatimang3.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.appdev.siventin.lugatimang3.entity.UserArtworkEntity;
import com.appdev.siventin.lugatimang3.repository.UserArtworkRepository;

@Service
public class UserArtworkService {

    @Autowired
    private UserArtworkRepository userArtworkRepository;

    public UserArtworkEntity saveUserArtwork(int artworkId, int artistId) {
        return userArtworkRepository.save(new UserArtworkEntity(artworkId, artistId));
    }

    public List<UserArtworkEntity> getAllUserArtworks() {
        return userArtworkRepository.findAll();
    }

    // Add methods to find by artistId or artworkId if needed by adding custom
    // queries in repository
}
