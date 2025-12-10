package com.appdev.siventin.lugatimang3.service;

import java.util.List;
import java.util.NoSuchElementException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.appdev.siventin.lugatimang3.entity.CommentEntity;

import com.appdev.siventin.lugatimang3.repository.CommentRepository;
import com.appdev.siventin.lugatimang3.repository.BlogRepository;
import com.appdev.siventin.lugatimang3.repository.ArtworkRepository;

import org.springframework.transaction.annotation.Transactional;
import com.appdev.siventin.lugatimang3.repository.ArtistRepository;

@Service
@Transactional
public class CommentService {

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private ArtistRepository artistRepository;

    @Autowired
    private BlogRepository blogRepository;

    @Autowired
    private ArtworkRepository artworkRepository;

    // Migration method removed (Legacy)

    public CommentEntity addComment(int blogId, int artistId, String content) {
        // 1. Fetch Author
        com.appdev.siventin.lugatimang3.entity.ArtistEntity author = artistRepository.findById(artistId)
                .orElseThrow(() -> new NoSuchElementException("Artist " + artistId + " not found"));

        // 2. Fetch Blog
        com.appdev.siventin.lugatimang3.entity.BlogEntity blog = blogRepository.findById(blogId)
                .orElseThrow(() -> new NoSuchElementException("Blog " + blogId + " not found"));

        // 3. Save Comment
        CommentEntity comment = new CommentEntity();
        comment.setContent(content);
        comment.setDatePosted(java.time.LocalDateTime.now());
        comment.setAuthor(author);
        comment.setBlog(blog);

        return commentRepository.save(comment);
    }

    public List<CommentEntity> getCommentsByBlogId(int blogId) {
        return commentRepository.findByBlog_BlogId(blogId);
    }

    public CommentEntity addCommentToArtwork(int artworkId, int artistId, String content) {
        // 1. Fetch Author
        com.appdev.siventin.lugatimang3.entity.ArtistEntity author = artistRepository.findById(artistId)
                .orElseThrow(() -> new NoSuchElementException("Artist " + artistId + " not found"));

        // 2. Fetch Artwork
        com.appdev.siventin.lugatimang3.entity.ArtworkEntity artwork = artworkRepository.findById(artworkId)
                .orElseThrow(() -> new NoSuchElementException("Artwork " + artworkId + " not found"));

        // 3. Save Comment
        CommentEntity comment = new CommentEntity();
        comment.setContent(content);
        comment.setDatePosted(java.time.LocalDateTime.now());
        comment.setAuthor(author);
        comment.setArtwork(artwork);

        return commentRepository.save(comment);
    }

    public List<CommentEntity> getCommentsByArtworkId(int artworkId) {
        return commentRepository.findByArtwork_ArtworkId(artworkId);
    }
}
