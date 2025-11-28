package com.appdev.siventin.lugatimang3.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.appdev.siventin.lugatimang3.entity.ArtworkTagEntity;
import com.appdev.siventin.lugatimang3.repository.ArtworkTagRepository;

@Service
public class ArtworkTagService {

    @Autowired
    private ArtworkTagRepository artworkTagRepository;

    public ArtworkTagEntity saveArtworkTag(int artworkId, int tagId) {
        return artworkTagRepository.save(new ArtworkTagEntity(artworkId, tagId));
    }

    public List<ArtworkTagEntity> getAllArtworkTags() {
        return artworkTagRepository.findAll();
    }
}
