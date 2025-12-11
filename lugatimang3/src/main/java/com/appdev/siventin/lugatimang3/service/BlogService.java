package com.appdev.siventin.lugatimang3.service;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.appdev.siventin.lugatimang3.entity.BlogEntity;
import com.appdev.siventin.lugatimang3.repository.BlogRepository;
import com.appdev.siventin.lugatimang3.repository.ArtistRepository;
import com.appdev.siventin.lugatimang3.repository.CommentRepository;

import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class BlogService {

    @Autowired
    BlogRepository brepo;

    @Autowired
    com.appdev.siventin.lugatimang3.repository.BlogLikesRepository blogLikesRepository;

    @Autowired
    CommentRepository commentRepository;

    @Autowired
    com.appdev.siventin.lugatimang3.repository.BlogTagRepository blogTagRepository;

    @Autowired
    ArtistRepository artistRepository;

    @Autowired
    com.appdev.siventin.lugatimang3.repository.ReportRepository reportRepository;

    // Migration method (Restored)
    @jakarta.annotation.PostConstruct
    public void migrateLegacyData() {
        List<BlogEntity> allBlogs = brepo.findAll();
        int migratedCount = 0;
        for (BlogEntity blog : allBlogs) {
            if (blog.getAuthor() == null) {
                Integer artistId = brepo.getLegacyArtistId(blog.getBlogId());
                if (artistId != null) {
                    try {
                        com.appdev.siventin.lugatimang3.entity.ArtistEntity artist = artistRepository
                                .findById(artistId).orElse(null);
                        if (artist != null) {
                            blog.setAuthor(artist);
                            brepo.save(blog);
                            migratedCount++;
                        }
                    } catch (Exception e) {
                        System.err.println("Failed to migrate blog " + blog.getBlogId() + ": " + e.getMessage());
                    }
                }
            }
        }
        if (migratedCount > 0) {
            System.out.println("Successfully migrated " + migratedCount + " blogs to direct relationships.");
        }
    }

    public BlogEntity insertBlog(BlogEntity blog, int artistId) {
        try {
            // 1. Fetch Artist and Set Author
            com.appdev.siventin.lugatimang3.entity.ArtistEntity artist = artistRepository.findById(artistId)
                    .orElseThrow(() -> new NoSuchElementException("Artist " + artistId + " not found"));
            blog.setAuthor(artist);

            // 2. Save the Blog
            if (blog.getDatePosted() == null) {
                blog.setDatePosted(new java.sql.Timestamp(System.currentTimeMillis()));
            }
            return brepo.save(blog);
        } catch (Exception e) {
            e.printStackTrace();
            throw e;
        }
    }

    public List<BlogEntity> getAllBlogs(int userId) {
        List<BlogEntity> blogs = brepo.findAll();
        if (userId > 0) {
            java.util.Set<Integer> likedBlogIds = new java.util.HashSet<>(
                    blogLikesRepository.findLikedBlogIdsByUserId(userId));
            for (BlogEntity blog : blogs) {
                blog.setIsLiked(likedBlogIds.contains(blog.getBlogId()));
            }
        }
        return blogs;
    }

    public List<BlogEntity> getBlogsByArtistId(int artistId, int userId) {
        try {
            // Fetch blogs by Author
            List<BlogEntity> blogs = brepo.findByAuthor_ArtistId(artistId);

            if (userId > 0) {
                java.util.Set<Integer> likedBlogIds = new java.util.HashSet<>(
                        blogLikesRepository.findLikedBlogIdsByUserId(userId));
                for (BlogEntity blog : blogs) {
                    blog.setIsLiked(likedBlogIds.contains(blog.getBlogId()));
                }
            }
            return blogs;
        } catch (Exception e) {
            e.printStackTrace();
            return java.util.Collections.emptyList();
        }
    }

    public BlogEntity getBlogById(int blogId, int userId) {
        try {
            BlogEntity blog = brepo.findById(blogId).orElse(null);
            if (blog != null && userId > 0) {
                com.appdev.siventin.lugatimang3.entity.BlogLikesEntity.BlogLikesKey key = new com.appdev.siventin.lugatimang3.entity.BlogLikesEntity.BlogLikesKey(
                        blogId, userId);
                blog.setIsLiked(blogLikesRepository.existsById(key));
            }
            return blog;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    @SuppressWarnings("finally")
    public BlogEntity updateBlog(int blogId, BlogEntity newBlogDetails) {
        BlogEntity blog = new BlogEntity();
        try {
            blog = brepo.findById(blogId).get();
            blog.setTitle(newBlogDetails.getTitle());
            blog.setContent(newBlogDetails.getContent());
            blog.setIsEdited(true);
            blog.setDateEdited(new java.sql.Timestamp(System.currentTimeMillis()));
        } catch (NoSuchElementException ex) {
            throw new NoSuchElementException("Blog " + blogId + " does not exist.");
        } finally {
            return brepo.save(blog);
        }
    }

    public String deleteBlog(int blogId, int requestingArtistId) {
        try {
            BlogEntity blog = brepo.findById(blogId).orElse(null);

            if (blog == null) {
                return "Blog " + blogId + " does not exist.";
            }

            // Verify ownership
            if (requestingArtistId > 0) {
                boolean isOwner = blog.getAuthor() != null && blog.getAuthor().getArtistId() == requestingArtistId;
                if (!isOwner) {
                    return "Unauthorized: User " + requestingArtistId + " does not own blog " + blogId;
                }
            }

            // 1. Delete Relavant Reports
            List<com.appdev.siventin.lugatimang3.entity.ReportEntity> reports = reportRepository
                    .findByReportedItemIdAndItemType(blogId,
                            com.appdev.siventin.lugatimang3.entity.ReportEntity.ReportItemType.BLOG);
            if (!reports.isEmpty()) {
                reportRepository.deleteAll(reports);
            }

            // 2. Delete from Legacy User Blog (Native)
            brepo.deleteLegacyUserBlog(blogId);

            // 3. Delete Comments and their legacy links
            List<com.appdev.siventin.lugatimang3.entity.CommentEntity> comments = commentRepository
                    .findByBlog_BlogId(blogId);
            for (com.appdev.siventin.lugatimang3.entity.CommentEntity comment : comments) {
                // Delete legacy user_comment link first
                commentRepository.deleteLegacyUserComment(comment.getCommentId());
            }
            if (!comments.isEmpty()) {
                commentRepository.deleteAll(comments);
            }

            // 4. Delete from BlogLikes
            List<com.appdev.siventin.lugatimang3.entity.BlogLikesEntity> likes = blogLikesRepository.findAll().stream()
                    .filter(l -> l.getId().getBlogId() == blogId)
                    .collect(java.util.stream.Collectors.toList());
            if (!likes.isEmpty()) {
                blogLikesRepository.deleteAll(likes);
            }

            // 5. Delete from BlogTags (Link to Tags)
            java.util.List<com.appdev.siventin.lugatimang3.entity.BlogTagEntity> blogTags = blogTagRepository.findAll()
                    .stream()
                    .filter(bt -> bt.getId().getBlogId() == blogId)
                    .collect(java.util.stream.Collectors.toList());
            if (!blogTags.isEmpty()) {
                blogTagRepository.deleteAll(blogTags);
            }

            // 6. Delete the Blog itself
            brepo.deleteById(blogId);
            return "Blog " + blogId + " is successfully deleted!";

        } catch (Exception e) {
            e.printStackTrace();
            return "Error deleting blog: " + e.getMessage();
        }
    }

    public BlogEntity likeBlog(int blogId, int userId) {
        BlogEntity blog = brepo.findById(blogId)
                .orElseThrow(() -> new NoSuchElementException("Blog " + blogId + " does not exist."));

        com.appdev.siventin.lugatimang3.entity.BlogLikesEntity.BlogLikesKey key = new com.appdev.siventin.lugatimang3.entity.BlogLikesEntity.BlogLikesKey(
                blogId, userId);

        if (blogLikesRepository.existsById(key)) {
            // Unlike
            blogLikesRepository.deleteById(key);
            int currentLikes = blog.getLikeCount() == null ? 0 : blog.getLikeCount();
            blog.setLikeCount(Math.max(0, currentLikes - 1));
            blog.setIsLiked(false);
        } else {
            // Like
            com.appdev.siventin.lugatimang3.entity.BlogLikesEntity like = new com.appdev.siventin.lugatimang3.entity.BlogLikesEntity(
                    blogId, userId);
            blogLikesRepository.save(like);
            int currentLikes = blog.getLikeCount() == null ? 0 : blog.getLikeCount();
            blog.setLikeCount(currentLikes + 1);
            blog.setIsLiked(true);
        }

        return brepo.save(blog);
    }

    public List<BlogEntity> getBlogsByTagId(int tagId, int userId) {
        // 1. Get BlogTags for this tag
        java.util.List<com.appdev.siventin.lugatimang3.entity.BlogTagEntity> blogTags = blogTagRepository.findAll()
                .stream()
                .filter(bt -> bt.getId().getTagId() == tagId)
                .collect(java.util.stream.Collectors.toList());

        // 2. Extract Blog IDs
        List<Integer> blogIds = blogTags.stream().map(bt -> bt.getId().getBlogId())
                .collect(java.util.stream.Collectors.toList());

        // 3. Fetch Blogs
        List<BlogEntity> blogs = brepo.findAllById(blogIds);

        // 4. Set Likes
        if (userId > 0) {
            java.util.Set<Integer> likedBlogIds = new java.util.HashSet<>(
                    blogLikesRepository.findLikedBlogIdsByUserId(userId));
            for (BlogEntity blog : blogs) {
                blog.setIsLiked(likedBlogIds.contains(blog.getBlogId()));
            }
        }
        return blogs;
    }

    public List<com.appdev.siventin.lugatimang3.entity.TagEntity> getTagsByBlogId(int blogId) {
        return blogTagRepository.findAll().stream()
                .filter(bt -> bt.getId().getBlogId() == blogId)
                .map(bt -> bt.getTag())
                .collect(java.util.stream.Collectors.toList());
    }

    @Autowired
    com.appdev.siventin.lugatimang3.repository.TagRepository tagRepository;

    public void insertBlogTag(int blogId, int tagId) {
        com.appdev.siventin.lugatimang3.entity.BlogTagEntity blogTag = new com.appdev.siventin.lugatimang3.entity.BlogTagEntity(
                blogId, tagId);

        // Fetch and set relationships (Required for @MapsId)
        BlogEntity blog = brepo.findById(blogId).orElseThrow();
        com.appdev.siventin.lugatimang3.entity.TagEntity tag = tagRepository.findById(tagId).orElseThrow();

        blogTag.setBlog(blog);
        blogTag.setTag(tag);

        blogTagRepository.save(blogTag);
    }

    public void updateBlogTags(int blogId, List<Integer> tagIds) {
        // 1. Get existing tags
        List<com.appdev.siventin.lugatimang3.entity.BlogTagEntity> existingTags = blogTagRepository.findAll()
                .stream()
                .filter(bt -> bt.getId().getBlogId() == blogId)
                .collect(java.util.stream.Collectors.toList());

        // 2. Remove tags not in the new list
        for (com.appdev.siventin.lugatimang3.entity.BlogTagEntity existing : existingTags) {
            if (!tagIds.contains(existing.getId().getTagId())) {
                blogTagRepository.delete(existing);
            }
        }

        // 3. Add new tags
        List<Integer> existingTagIds = existingTags.stream()
                .map(bt -> bt.getId().getTagId())
                .collect(java.util.stream.Collectors.toList());

        for (Integer newTagId : tagIds) {
            if (!existingTagIds.contains(newTagId)) {
                insertBlogTag(blogId, newTagId);
            }
        }
    }

    public List<BlogEntity> getRelatedBlogs(int blogId, int userId) {
        try {
            BlogEntity currentBlog = brepo.findById(blogId).orElse(null);
            if (currentBlog == null)
                return java.util.Collections.emptyList();

            int artistId = currentBlog.getAuthor() != null ? currentBlog.getAuthor().getArtistId() : -1;
            List<Integer> tagIds = java.util.Collections.emptyList();
            if (currentBlog.getBlogTags() != null) {
                tagIds = currentBlog.getBlogTags().stream()
                        .map(bt -> bt.getTag().getTagId())
                        .collect(Collectors.toList());
            }

            if (artistId == -1 && tagIds.isEmpty())
                return java.util.Collections.emptyList();
            if (tagIds.isEmpty())
                tagIds = java.util.Collections.singletonList(-1);

            List<BlogEntity> related = brepo.findRelatedBlogs(
                    artistId,
                    tagIds,
                    blogId,
                    org.springframework.data.domain.PageRequest.of(0, 5));

            // Populate like status if needed
            if (userId > 0) {
                java.util.Set<Integer> likedBlogIds = new java.util.HashSet<>(
                        blogLikesRepository.findLikedBlogIdsByUserId(userId));

                for (BlogEntity blog : related) {
                    blog.setIsLiked(likedBlogIds.contains(blog.getBlogId()));
                }
            }
            return related;
        } catch (Exception e) {
            e.printStackTrace();
            return java.util.Collections.emptyList();
        }
    }
}
