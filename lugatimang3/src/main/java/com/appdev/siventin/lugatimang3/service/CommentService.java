package com.appdev.siventin.lugatimang3.service;

import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.appdev.siventin.lugatimang3.entity.CommentEntity;
import com.appdev.siventin.lugatimang3.entity.CommentOnBlogEntity;
import com.appdev.siventin.lugatimang3.entity.UserCommentEntity;
import com.appdev.siventin.lugatimang3.repository.CommentOnBlogRepository;
import com.appdev.siventin.lugatimang3.repository.CommentRepository;
import com.appdev.siventin.lugatimang3.repository.UserCommentRepository;

@Service
public class CommentService {

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private CommentOnBlogRepository commentOnBlogRepository;

    @Autowired
    private UserCommentRepository userCommentRepository;

    public CommentEntity addComment(int blogId, int artistId, String content) {
        // 1. Save Comment
        CommentEntity comment = new CommentEntity();
        comment.setContent(content);
        comment.setDatePosted(java.time.LocalDateTime.now());
        CommentEntity savedComment = commentRepository.save(comment);

        // 2. Link to Blog
        CommentOnBlogEntity commentOnBlog = new CommentOnBlogEntity(savedComment.getCommentId(), blogId);
        commentOnBlogRepository.save(commentOnBlog);

        // 3. Link to User
        UserCommentEntity userComment = new UserCommentEntity(artistId, savedComment.getCommentId());
        userCommentRepository.save(userComment);

        return savedComment;
    }

    public List<CommentEntity> getCommentsByBlogId(int blogId) {
        List<CommentOnBlogEntity> links = commentOnBlogRepository.findAll();
        List<Integer> commentIds = new ArrayList<>();

        for (CommentOnBlogEntity link : links) {
            if (link.getId().getBlogId() == blogId) {
                commentIds.add(link.getId().getCommentId());
            }
        }

        return commentRepository.findAllById(commentIds);
    }
}
