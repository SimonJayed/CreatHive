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

    public TagEntity insertTag(TagEntity tag){
            return trepo.save(tag);
    }

    public List<TagEntity> getAllTags(){
            return trepo.findAll();
    }

    @SuppressWarnings("finally")
    public TagEntity updateTag(int tagId, TagEntity newTagDetails){
        TagEntity tag = new TagEntity();
        try{
            tag = trepo.findById(tagId).get();
            tag.setDescription(newTagDetails.getDescription());
            tag.setName(newTagDetails.getName());
        }catch (NoSuchElementException ex){
            throw new NoSuchElementException("Tag " + tagId + " does not exist.");
        }finally {
            return trepo.save(tag);
        }
    }

    public String deleteTag(int tagId){
        String msg = "";

        if (trepo.findById(tagId) != null){
            trepo.deleteById(tagId);
            msg = "Tag " + tagId + "is successfully deleted!";
        }else{
            msg = "Tag " + tagId + " does not exist.";
        }
        return msg;
    }
}
