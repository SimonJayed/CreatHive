package com.appdev.siventin.lugatimang3.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.appdev.siventin.lugatimang3.entity.CommentOnBlogEntity;
import com.appdev.siventin.lugatimang3.repository.CommentOnBlogRepository;

@Service
public class CommentOnBlogService {

    @Autowired
    private CommentOnBlogRepository commentOnBlogRepository;

    public CommentOnBlogEntity saveCommentOnBlog(int commentId, int blogId) {
        return commentOnBlogRepository.save(new CommentOnBlogEntity(commentId, blogId));
    }

    public List<CommentOnBlogEntity> getAllCommentsOnBlog() {
        return commentOnBlogRepository.findAll();
    }
}
