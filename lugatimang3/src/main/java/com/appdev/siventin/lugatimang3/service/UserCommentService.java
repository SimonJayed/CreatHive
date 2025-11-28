package com.appdev.siventin.lugatimang3.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.appdev.siventin.lugatimang3.entity.UserCommentEntity;
import com.appdev.siventin.lugatimang3.repository.UserCommentRepository;

@Service
public class UserCommentService {

    @Autowired
    private UserCommentRepository userCommentRepository;

    public UserCommentEntity saveUserComment(int artistId, int commentId) {
        return userCommentRepository.save(new UserCommentEntity(artistId, commentId));
    }

    public List<UserCommentEntity> getAllUserComments() {
        return userCommentRepository.findAll();
    }
}
