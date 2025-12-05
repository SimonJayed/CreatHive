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

    @Autowired
    private com.appdev.siventin.lugatimang3.repository.ArtworkRepository artworkRepository;

    @Autowired
    private com.appdev.siventin.lugatimang3.repository.TagRepository tagRepository;

    public ArtworkTagEntity saveArtworkTag(int artworkId, int tagId) {
        ArtworkTagEntity artworkTag = new ArtworkTagEntity(artworkId, tagId);

        // Fetch and set the relationships for @MapsId
        com.appdev.siventin.lugatimang3.entity.ArtworkEntity artwork = artworkRepository.findById(artworkId)
                .orElseThrow(() -> new RuntimeException("Artwork not found"));
        com.appdev.siventin.lugatimang3.entity.TagEntity tag = tagRepository.findById(tagId)
                .orElseThrow(() -> new RuntimeException("Tag not found"));

        artworkTag.setArtwork(artwork);
        artworkTag.setTag(tag);

        return artworkTagRepository.save(artworkTag);
    }

    public List<ArtworkTagEntity> getAllArtworkTags() {
        return artworkTagRepository.findAll();
    }
}
