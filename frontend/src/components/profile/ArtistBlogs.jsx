import React, { useState, useEffect, useMemo } from 'react';
import { usePopup } from '../../context/PopupContext';
import { likeBlog, deleteBlog } from '../../api/blogApi';
import { addComment, getCommentsByBlogId } from '../../api/commentApi';
import { getAllUserComments } from '../../api/userCommentApi';
import { getAllArtists } from '../../api/artistApi';
import { Hexagon, MessageCircle, Share2, FileQuestion, Trash2 } from 'lucide-react';
import FilterSort from '../common/FilterSort';
import '../../styles/ArtistBlogs.css';

function ArtistBlogs({ blogs, artist, onNavigate }) {
    const { showAlert, showConfirm } = usePopup();
    // Sort blogs by most recent first
    const [sortOrder, setSortOrder] = useState('newest');

    const sortedBlogs = useMemo(() => {
        return [...blogs].sort((a, b) => {
            const dateA = new Date(a.datePosted || 0).getTime();
            const dateB = new Date(b.datePosted || 0).getTime();
            if (sortOrder === 'newest') {
                return dateB - dateA;
            } else {
                return dateA - dateB;
            }
        });
    }, [blogs, sortOrder]);

    const [activeCommentBlogId, setActiveCommentBlogId] = useState(null);
    const [commentText, setCommentText] = useState('');
    const [commentsMap, setCommentsMap] = useState({}); // blogId -> comments[]
    const [localBlogs, setLocalBlogs] = useState(sortedBlogs); // To update like counts locally
    const [artistsMap, setArtistsMap] = useState({}); // artistId -> Artist
    const [commentUserMap, setCommentUserMap] = useState({}); // commentId -> artistId

    // Update localBlogs when props change
    useEffect(() => {
        setLocalBlogs(sortedBlogs);
    }, [blogs, sortOrder]);

    useEffect(() => {
        fetchUserData();
    }, []);

    const fetchUserData = async () => {
        try {
            const [artistsData, userCommentsData] = await Promise.all([
                getAllArtists(),
                getAllUserComments()
            ]);

            const aMap = {};
            artistsData.forEach(artist => {
                aMap[artist.artistId] = artist;
            });
            setArtistsMap(aMap);

            const cUserMap = {};
            userCommentsData.forEach(link => {
                cUserMap[link.id.commentId] = link.id.artistId;
            });
            setCommentUserMap(cUserMap);
        } catch (error) {
            console.error("Failed to fetch user data for comments", error);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'Unknown Date';
        const date = new Date(dateString);
        return date.toLocaleString(undefined, {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const handleLike = async (blogId) => {
        const user = JSON.parse(localStorage.getItem('currentArtist'));
        if (!user) {
            showAlert("Login Required", "Please login to like");
            return;
        }
        try {
            const updatedBlog = await likeBlog(blogId, user.artistId);
            setLocalBlogs(prev => prev.map(b => b.blogId === blogId ? { ...b, likeCount: updatedBlog.likeCount, isLiked: updatedBlog.isLiked } : b));
        } catch (error) {
            console.error("Failed to like blog", error);
        }
    };

    const toggleComments = async (blogId) => {
        if (activeCommentBlogId === blogId) {
            setActiveCommentBlogId(null);
        } else {
            setActiveCommentBlogId(blogId);
            if (!commentsMap[blogId]) {
                try {
                    const comments = await getCommentsByBlogId(blogId);
                    setCommentsMap(prev => ({ ...prev, [blogId]: comments }));
                } catch (error) {
                    console.error("Failed to fetch comments", error);
                }
            }
        }
    };

    const handleAddComment = async (blogId) => {
        if (!commentText.trim()) return;
        const user = JSON.parse(localStorage.getItem('currentArtist'));
        if (!user) {
            showAlert("Login Required", "Please login to comment");
            return;
        }
        try {
            const newComment = await addComment(blogId, user.artistId, commentText);

            // Update local maps
            setCommentUserMap(prev => ({ ...prev, [newComment.commentId]: user.artistId }));

            setCommentsMap(prev => ({
                ...prev,
                [blogId]: [...(prev[blogId] || []), newComment]
            }));
            setCommentText('');
        } catch (error) {
            console.error("Failed to add comment", error);
        }
    };

    const handleDelete = (blogId) => {
        showConfirm(
            "Delete Blog",
            "Are you sure you want to delete this blog?",
            async () => {
                try {
                    const user = JSON.parse(localStorage.getItem('currentArtist'));
                    if (!user) return;
                    await deleteBlog(blogId, user.artistId);
                    setLocalBlogs(prev => prev.filter(b => b.blogId !== blogId));
                } catch (error) {
                    console.error("Failed to delete blog", error);
                    showAlert("Error", "Failed to delete blog");
                }
            }
        );
    };

    const handleShare = (blogId) => {
        const url = `${window.location.origin}/blog/${blogId}`;
        navigator.clipboard.writeText(url);
        showAlert(
            "Share Blog",
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <p style={{ margin: 0 }}>Link copied to clipboard!</p>
                <input
                    type="text"
                    value={url}
                    readOnly
                    className="input-hexagon"
                    style={{ width: '100%', padding: '8px' }}
                />
            </div>
        );
    };

    return (
        <div className="artist-blogs-container">
            <div className="artist-blogs-header">

                {/* Sort Filter */}
                <FilterSort
                    type="blog"
                    sortOptions={[
                        { label: 'Newest First', value: 'newest' },
                        { label: 'Oldest First', value: 'oldest' }
                    ]}
                    activeSort={sortOrder}
                    onSortChange={setSortOrder}
                    onClear={() => setSortOrder('newest')}
                />

                {JSON.parse(localStorage.getItem('currentArtist'))?.artistId === artist?.artistId && (
                    <button
                        onClick={() => onNavigate && onNavigate('upload-blog')}
                        className="button-hexagon upload-blog-btn"
                    >
                        + Upload Blog
                    </button>
                )}
            </div>

            {localBlogs.length > 0 ? (
                <div className="blog-list">
                    {localBlogs.map((blog) => (
                        <div key={blog.blogId} className="card-hexagon blog-card">
                            {/* Header: Avatar, Name, Date */}
                            <div className="blog-header">
                                <img
                                    src={artist?.profileImage || '/images/profile/default_profile.png'}
                                    alt={artist?.name || 'Artist'}
                                    className="blog-avatar"
                                />
                                <div className="blog-meta">
                                    <span className="blog-author">{artist?.name || 'Artist'}</span>
                                    <span className="blog-date">Posted {formatDate(blog.datePosted)}</span>
                                </div>
                                {JSON.parse(localStorage.getItem('currentArtist'))?.artistId === artist?.artistId && (
                                    <button
                                        onClick={() => handleDelete(blog.blogId)}
                                        className="delete-blog-btn icon-hexagon"
                                        title="Delete Blog"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                )}
                            </div>

                            {/* Title */}
                            <h4 className="blog-title">
                                {blog.title}
                            </h4>

                            {/* Content */}
                            <p className="blog-content">
                                {blog.content}
                            </p>

                            {/* Footer: Actions */}
                            <div className="blog-footer">
                                <button className="blog-action" onClick={() => handleLike(blog.blogId)}>
                                    <span className={`icon-hexagon ${blog.isLiked ? 'active' : ''}`}>
                                        <Hexagon size={18} color={blog.isLiked ? "var(--primary-color)" : "currentColor"} fill={blog.isLiked ? "var(--primary-color)" : "none"} />
                                    </span>
                                    Like ({blog.likeCount || 0})
                                </button>
                                <button className="blog-action" onClick={() => toggleComments(blog.blogId)}>
                                    <span className="icon-hexagon"><MessageCircle size={18} /></span> Comments
                                </button>
                                <button className="blog-action" onClick={() => handleShare(blog.blogId)}>
                                    <span className="icon-hexagon"><Share2 size={18} /></span> Share
                                </button>
                            </div>

                            {/* Comments Section */}
                            {activeCommentBlogId === blog.blogId && (
                                <div className="comments-section">
                                    <div className="comments-input-area">
                                        <input
                                            type="text"
                                            value={commentText}
                                            onChange={(e) => setCommentText(e.target.value)}
                                            placeholder="Write a comment..."
                                            className="input-hexagon comment-input-field"
                                        />
                                        <button onClick={() => handleAddComment(blog.blogId)} className="button-hexagon post-comment-btn">Post</button>
                                    </div>
                                    <div className="comments-list">
                                        {commentsMap[blog.blogId]?.map(comment => {
                                            const commenterId = commentUserMap[comment.commentId];
                                            const commenter = artistsMap[commenterId] || { name: 'Unknown', profileImage: null };
                                            return (
                                                <div key={comment.commentId} className="comment-item">
                                                    <img
                                                        src={commenter.profileImage || '/images/profile/default_profile.png'}
                                                        alt={commenter.name}
                                                        className="comment-avatar"
                                                    />
                                                    <div>
                                                        <div className="comment-meta">
                                                            <span className="comment-author">{commenter.name}</span>
                                                            <span className="comment-date">{formatDate(comment.datePosted)}</span>
                                                        </div>
                                                        <p className="comment-content">{comment.content}</p>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <div className="no-blogs-container">
                    <span className="no-blogs-icon"><FileQuestion size={48} /></span>
                    <h3 className="no-blogs-title">
                        No blogs yet
                    </h3>
                    <p className="no-blogs-text">
                        Share your imagination and inspire the Hiveminds community!
                    </p>
                    <button
                        onClick={() => onNavigate && onNavigate('upload-blog')}
                        className="button-hexagon"
                    >
                        Upload your blog
                    </button>
                </div>
            )}
        </div>
    );
}

export default ArtistBlogs;
