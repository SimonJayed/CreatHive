package com.appdev.siventin.lugatimang3.service;

import java.util.List;
import java.util.NoSuchElementException;

import javax.naming.NameNotFoundException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.appdev.siventin.lugatimang3.entity.CommentEntity;
import com.appdev.siventin.lugatimang3.repository.CommentRepository;

@Service
public class CommentService {

    @Autowired
    CommentRepository crepo;

    // Create
    public CommentEntity insertComment(CommentEntity comment) {
        return crepo.save(comment);
    }

    // Read
    public List<CommentEntity> getAllComments() {
        return crepo.findAll();
    }

    public CommentEntity getCommentBycontent(String content) throws NameNotFoundException {
        if (crepo.findByDescription(content) != null)
            return crepo.findByDescription(content);
        else
            throw new NameNotFoundException("There is no Comment having that content " + content + " in the records.");
    }

    // Update
    @SuppressWarnings("finally")
    public CommentEntity updateComment(int commentId, CommentEntity newCommentDetails) {
        CommentEntity Comment = new CommentEntity();
        try {
            Comment = crepo.findById(commentId).get();
            Comment.setContent(newCommentDetails.getContent());
            Comment.setDatePosted(newCommentDetails.getDatePosted());
        } catch (NoSuchElementException ex) {
            throw new NoSuchElementException("Comment " + commentId + " does not exist.");
        } finally {
            return crepo.save(Comment);
        }
    }

    // Delete
    @SuppressWarnings("unused")
    public String deleteComment(int commentId) {
        String msg = "";

        if (crepo.findById(commentId) != null) {
            crepo.deleteById(commentId);
            msg = "Artist " + commentId + " is successfully deleted.";
        } else
            msg = "Artist " + commentId + " does not exist.";
        return msg;
    }

}
