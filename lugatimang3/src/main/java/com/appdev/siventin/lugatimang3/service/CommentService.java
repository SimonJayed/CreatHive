package com.appdev.siventin.lugatimang3.service;

import java.util.List;
import java.util.NoSuchElementException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.appdev.siventin.lugatimang3.entity.CommentEntity;
import com.appdev.siventin.lugatimang3.repository.CommentRepository;

@Service
public class CommentService {

    @Autowired
    private CommentRepository commentRepository;

    public CommentEntity insertComment(CommentEntity comment) {
        return commentRepository.save(comment);
    }

    public List<CommentEntity> getAllComments() {
        return commentRepository.findAll();
    }

    public CommentEntity getCommentById(int commentId) {
        return commentRepository.findById(commentId)
                .orElseThrow(() -> new NoSuchElementException("Comment " + commentId + " not found"));
    }

    public CommentEntity updateComment(int commentId, CommentEntity newCommentDetails) {
        CommentEntity comment = getCommentById(commentId);
        comment.setContent(newCommentDetails.getContent());
        comment.setDatePosted(newCommentDetails.getDatePosted());
        return commentRepository.save(comment);
    }

    public String deleteComment(int commentId) {
        if (commentRepository.existsById(commentId)) {
            commentRepository.deleteById(commentId);
            return "Comment " + commentId + " deleted successfully";
        } else {
            return "Comment " + commentId + " not found";
        }
    }
}
