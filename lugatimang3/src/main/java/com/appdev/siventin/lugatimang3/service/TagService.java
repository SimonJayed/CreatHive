package com.appdev.siventin.lugatimang3.service;

import java.util.List;
import java.util.NoSuchElementException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.appdev.siventin.lugatimang3.entity.TagEntity;
import com.appdev.siventin.lugatimang3.repository.TagRepository;

@Service
public class TagService {

    @Autowired
    TagRepository trepo;

    public TagEntity insertTag(TagEntity tag) {
        return trepo.save(tag);
    }

    public List<TagEntity> getAllTags() {
        return trepo.findAll();
    }

    @SuppressWarnings("finally")
    public TagEntity updateTag(int tagId, TagEntity newTagDetails) {
        TagEntity tag = new TagEntity();
        try {
            tag = trepo.findById(tagId).get();
            tag.setDescription(newTagDetails.getDescription());
            tag.setName(newTagDetails.getName());
        } catch (NoSuchElementException ex) {
            throw new NoSuchElementException("Tag " + tagId + " does not exist.");
        } finally {
            return trepo.save(tag);
        }
    }

    public String deleteTag(int tagId) {
        String msg = "";

        if (trepo.findById(tagId) != null) {
            trepo.deleteById(tagId);
            msg = "Tag " + tagId + "is successfully deleted!";
        } else {
            msg = "Tag " + tagId + " does not exist.";
        }
        return msg;
    }

    @Autowired
    com.appdev.siventin.lugatimang3.repository.ArtworkTagRepository artworkTagRepository;

    @Autowired
    com.appdev.siventin.lugatimang3.repository.ArtistInterestRepository artistInterestRepository;

    public List<TagEntity> getAllTags(int userId) {
        List<TagEntity> tags = trepo.findAll();
        for (TagEntity tag : tags) {
            // Count submissions
            // Count submissions and get first artwork image
            List<com.appdev.siventin.lugatimang3.entity.ArtworkTagEntity> tagArtworks = artworkTagRepository.findAll()
                    .stream()
                    .filter(at -> at.getId().getTagId() == tag.getTagId())
                    .collect(java.util.stream.Collectors.toList());

            tag.setSubmissionCount(tagArtworks.size());

            if (!tagArtworks.isEmpty()) {
                // Get the first artwork's image
                tag.setFirstArtworkImage(tagArtworks.get(0).getArtwork().getImage());
            }

            // Check if liked by user
            if (userId > 0) {
                boolean isLiked = artistInterestRepository.existsById(
                        new com.appdev.siventin.lugatimang3.entity.ArtistInterestEntity.ArtistInterestKey(userId,
                                tag.getTagId()));
                tag.setLiked(isLiked);
            }
        }
        return tags;
    }

    public void likeTag(int tagId, int artistId) {
        com.appdev.siventin.lugatimang3.entity.ArtistInterestEntity interest = new com.appdev.siventin.lugatimang3.entity.ArtistInterestEntity(
                artistId, tagId);
        artistInterestRepository.save(interest);
    }

    public void unlikeTag(int tagId, int artistId) {
        com.appdev.siventin.lugatimang3.entity.ArtistInterestEntity.ArtistInterestKey key = new com.appdev.siventin.lugatimang3.entity.ArtistInterestEntity.ArtistInterestKey(
                artistId, tagId);
        artistInterestRepository.deleteById(key);
    }

    @jakarta.annotation.PostConstruct
    public void seedDefaultTags() {
        String[] defaultTags = {
                "Anime", "Abstract", "Cartoon Style", "Chibi Style", "Concept Art", "Cubism",
                "Cyberpunk", "Dark Art", "Academic Art", "Expressionism", "Fantasy", "Gothic Art",
                "Hyperrealism", "Impressionism", "Minimalism", "Pop Art", "Realism", "Sci-Fi Art",
                "Surrealism", "Dada Art", "Art Nouveau"
        };

        for (String tagName : defaultTags) {
            if (trepo.findByName(tagName) == null) {
                TagEntity tag = new TagEntity();
                tag.setName(tagName);
                tag.setDescription("Art style: " + tagName);
                trepo.save(tag);
                System.out.println("Seeded tag: " + tagName);
            }
        }
    }
}
