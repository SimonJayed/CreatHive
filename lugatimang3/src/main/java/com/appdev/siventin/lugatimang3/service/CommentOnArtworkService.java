package com.appdev.siventin.lugatimang3.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.appdev.siventin.lugatimang3.entity.CommentOnArtworkEntity;
import com.appdev.siventin.lugatimang3.repository.CommentOnArtworkRepository;

@Service
public class CommentOnArtworkService {

    @Autowired
    private CommentOnArtworkRepository commentOnArtworkRepository;

    public CommentOnArtworkEntity saveCommentOnArtwork(int commentId, int artworkId) {
        return commentOnArtworkRepository.save(new CommentOnArtworkEntity(commentId, artworkId));
    }

    public List<CommentOnArtworkEntity> getAllCommentsOnArtwork() {
        return commentOnArtworkRepository.findAll();
    }
}
