package com.appdev.siventin.lugatimang3.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.appdev.siventin.lugatimang3.entity.UserBlogEntity;
import com.appdev.siventin.lugatimang3.repository.UserBlogRepository;

@Service
public class UserBlogService {

    @Autowired
    private UserBlogRepository userBlogRepository;

    public UserBlogEntity saveUserBlog(int blogId, int userId) {
        return userBlogRepository.save(new UserBlogEntity(blogId, userId));
    }

    public List<UserBlogEntity> getAllUserBlogs() {
        return userBlogRepository.findAll();
    }
}
