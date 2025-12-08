package com.appdev.siventin.lugatimang3.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.appdev.siventin.lugatimang3.entity.BlogTagEntity;
import com.appdev.siventin.lugatimang3.repository.BlogTagRepository;

@Service
public class BlogTagService {

    @Autowired
    private BlogTagRepository blogTagRepository;

    public List<BlogTagEntity> getAllBlogTags() {
        return blogTagRepository.findAll();
    }

    public BlogTagEntity saveBlogTag(int blogId, int tagId) {
        BlogTagEntity blogTag = new BlogTagEntity(blogId, tagId);
        return blogTagRepository.save(blogTag);
    }
}
