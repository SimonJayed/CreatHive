import React, { useState, useEffect } from 'react';
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
    const sortedBlogs = [...blogs].sort((a, b) => {
        const dateA = new Date(a.datePosted || 0).getTime();
        const dateB = new Date(b.datePosted || 0).getTime();
        if (sortOrder === 'newest') {
            return dateB - dateA;
        } else {
            return dateA - dateB;
        }
    });

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
                    await deleteBlog(blogId);
                    setLocalBlogs(prev => prev.filter(b => b.blogId !== blogId));
                } catch (error) {
                    console.error("Failed to delete blog", error);
                    showAlert("Error", "Failed to delete blog");
                }
            }
        );
    };

    return (
        <div className="artist-blogs-container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ color: 'var(--primary-color)', margin: 0, fontFamily: 'var(--font-family)', letterSpacing: 'var(--letter-spacing-wide)' }}>Artist's Blogs</h3>
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
                                        style={{
                                            marginLeft: 'auto',
                                            background: 'none',
                                            border: 'none',
                                            color: 'var(--danger-color)',
                                            cursor: 'pointer',
                                            padding: '4px'
                                        }}
                                        title="Delete Blog"
                                        className="icon-hexagon"
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
                                <button className="blog-action">
                                    <span className="icon-hexagon"><Share2 size={18} /></span> Share
                                </button>
                            </div>

                            {/* Comments Section */}
                            {activeCommentBlogId === blog.blogId && (
                                <div className="comments-section" style={{ marginTop: '10px', paddingTop: '10px', borderTop: '2px solid var(--border-color)' }}>
                                    <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
                                        <input
                                            type="text"
                                            value={commentText}
                                            onChange={(e) => setCommentText(e.target.value)}
                                            placeholder="Write a comment..."
                                            className="input-hexagon"
                                            style={{ flex: 1 }}
                                        />
                                        <button onClick={() => handleAddComment(blog.blogId)} className="button-hexagon" style={{ padding: '8px 16px' }}>Post</button>
                                    </div>
                                    <div className="comments-list">
                                        {commentsMap[blog.blogId]?.map(comment => {
                                            const commenterId = commentUserMap[comment.commentId];
                                            const commenter = artistsMap[commenterId] || { name: 'Unknown', profileImage: null };
                                            return (
                                                <div key={comment.commentId} style={{ padding: '8px', borderBottom: '1px solid #f0f0f0', display: 'flex', gap: '10px' }}>
                                                    <img
                                                        src={commenter.profileImage || '/images/profile/default_profile.png'}
                                                        alt={commenter.name}
                                                        style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }}
                                                    />
                                                    <div>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                            <span style={{ fontWeight: '600', fontSize: '13px', fontFamily: 'var(--font-family)' }}>{commenter.name}</span>
                                                            <span style={{ fontSize: '10px', color: '#999', fontFamily: 'var(--font-family)' }}>{formatDate(comment.datePosted)}</span>
                                                        </div>
                                                        <p style={{ margin: '4px 0 0', fontSize: '14px', fontFamily: 'var(--font-family)' }}>{comment.content}</p>
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
