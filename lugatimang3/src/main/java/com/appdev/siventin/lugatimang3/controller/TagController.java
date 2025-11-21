package com.appdev.siventin.lugatimang3.controller;

import java.util.List;

import javax.swing.text.html.HTML.Tag;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.appdev.siventin.lugatimang3.entity.TagEntity;
import com.appdev.siventin.lugatimang3.service.TagService;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PathVariable;




@RestController
@RequestMapping("/tags")
@CrossOrigin(origins = "http://localhost:3000")
public class TagController {

    @Autowired
    TagService tservice;

    @PostMapping("/insertTag")
    public TagEntity insertTag(@RequestBody TagEntity tag) {
        return tservice.insertTag(tag);
    }

    @GetMapping("/getAllTags")
    public List<TagEntity> getAllTags() {
        return tservice.getAllTags();
    }
    
    @PutMapping("/updateTag")
    public TagEntity updateTag (@RequestParam int tagId, @RequestBody TagEntity newTagDetails) {
        return tservice.updateTag(tagId, newTagDetails);
    }

    @DeleteMapping("/deleteTag/{tagId}")
    public String deleteTag(@PathVariable int tagId){
        return tservice.deleteTag(tagId);
    }
}
