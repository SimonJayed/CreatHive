import React, { useState, useEffect } from 'react';
import { usePopup } from '../../context/PopupContext';
import { getAllBlogs, likeBlog, deleteBlog } from '../../api/blogApi';
import { getAllUserBlogs } from '../../api/userBlogApi';
import { getAllArtists } from '../../api/artistApi';
import { addComment, getCommentsByBlogId } from '../../api/commentApi';
import { getAllUserComments } from '../../api/userCommentApi';
import { Hexagon, MessageCircle, Share2, FileQuestion, ArrowUpDown, Trash2 } from 'lucide-react';
import '../../styles/ArtistBlogs.css'; // Reuse styles

function BlogsFeed({ onNavigate, currentUser }) {
    const { showAlert, showConfirm } = usePopup();
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sortOrder, setSortOrder] = useState('newest'); // 'newest' or 'oldest'
    const [activeCommentBlogId, setActiveCommentBlogId] = useState(null);
    const [commentText, setCommentText] = useState('');
    const [commentsMap, setCommentsMap] = useState({}); // blogId -> comments[]
    const [artistsMap, setArtistsMap] = useState({}); // artistId -> Artist
    const [commentUserMap, setCommentUserMap] = useState({}); // commentId -> artistId

    useEffect(() => {
        fetchData();
    }, [currentUser]);

    const fetchData = async () => {
        try {
            const userId = currentUser?.artistId || 0;
            const [blogsData, userBlogsData, artistsData, userCommentsData] = await Promise.all([
                getAllBlogs(userId),
                getAllUserBlogs(),
                getAllArtists(),
                getAllUserComments()
            ]);

            // Map artists by ID for quick lookup
            const aMap = {};
            artistsData.forEach(artist => {
                aMap[artist.artistId] = artist;
            });
            setArtistsMap(aMap);

            // Map blogId to userId
            const blogUserMap = {};
            userBlogsData.forEach(link => {
                blogUserMap[link.id.blogId] = link.id.userId;
            });

            // Map commentId to userId
            const cUserMap = {};
            userCommentsData.forEach(link => {
                cUserMap[link.id.commentId] = link.id.artistId;
            });
            setCommentUserMap(cUserMap);

            // Combine data
            const enrichedBlogs = blogsData.map(blog => {
                const userId = blogUserMap[blog.blogId];
                const artist = aMap[userId];
                return {
                    ...blog,
                    artist: artist || { name: 'Unknown Artist', profileImage: null }
                };
            });

            console.log("Fetched blogs:", enrichedBlogs);
            setBlogs(enrichedBlogs);
        } catch (error) {
            console.error("Failed to fetch blogs feed", error);
        } finally {
            setLoading(false);
        }
    };

    // Sort blogs based on sortOrder
    const sortedBlogs = [...blogs].sort((a, b) => {
        const dateA = new Date(a.datePosted || 0).getTime();
        const dateB = new Date(b.datePosted || 0).getTime();
        if (sortOrder === 'newest') {
            return dateB - dateA;
        } else {
            return dateA - dateB;
        }
    });

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
        const user = currentUser || JSON.parse(localStorage.getItem('currentArtist'));
        if (!user) {
            showAlert("Login Required", "Please login to like");
            return;
        }

        // Optimistic update
        setBlogs(prev => prev.map(b => {
            if (b.blogId === blogId) {
                const wasLiked = b.isLiked;
                return {
                    ...b,
                    isLiked: !wasLiked,
                    likeCount: wasLiked ? Math.max(0, (b.likeCount || 0) - 1) : (b.likeCount || 0) + 1
                };
            }
            return b;
        }));

        try {
            const updatedBlog = await likeBlog(blogId, user.artistId);
            // Re-sync with server response to be sure
            setBlogs(prev => prev.map(b => {
                if (b.blogId === blogId) {
                    return {
                        ...b,
                        // Ensure we keep the enriched artist data
                        likeCount: updatedBlog.likeCount,
                        isLiked: updatedBlog.isLiked // Backend now returns this
                    };
                }
                return b;
            }));
        } catch (error) {
            console.error("Failed to like blog", error);
            // Revert on error
            fetchData();
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

            // Update local maps for the new comment
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
                    setBlogs(prev => prev.filter(b => b.blogId !== blogId));
                } catch (error) {
                    console.error("Failed to delete blog", error);
                    showAlert("Error", "Failed to delete blog");
                }
            }
        );
    };

    if (loading) return <div style={{ color: 'var(--primary-color)', textAlign: 'center', marginTop: '50px' }}>Loading blogs...</div>;

    return (
        <div className="blogs-feed-container" style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <h2 style={{ color: 'var(--primary-color)', margin: 0, fontFamily: 'var(--font-family)', letterSpacing: 'var(--letter-spacing-wide)' }}>Community Blogs</h2>

                    {/* Sort Filter */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: 'var(--primary-color)' }}>
                        <ArrowUpDown className="icon-hexagon" size={16} />
                        <span>Sort by:</span>
                        <select
                            value={sortOrder}
                            onChange={(e) => setSortOrder(e.target.value)}
                            className="input-hexagon"
                            style={{
                                padding: '4px 8px',
                                width: 'auto',
                                backgroundColor: 'transparent',
                                color: 'var(--primary-color)',
                                border: 'none',
                                cursor: 'pointer',
                                fontWeight: '600',
                                clipPath: 'none' // Override clip-path for select to avoid cutting off text
                            }}
                        >
                            <option value="newest" style={{ color: 'black' }}>Newest First</option>
                            <option value="oldest" style={{ color: 'black' }}>Oldest First</option>
                        </select>
                    </div>
                </div>

                <button
                    onClick={() => onNavigate('upload-blog')}
                    className="button-hexagon"
                >
                    + Create Blog
                </button>
            </div>

            <div className="blog-list">
                {sortedBlogs.length > 0 ? (
                    sortedBlogs.map((blog) => (
                        <div key={blog.blogId} className="card-hexagon blog-card">
                            {/* Header */}
                            <div className="blog-header">
                                <img
                                    src={blog.artist?.profileImage || 'https://via.placeholder.com/32'}
                                    alt={blog.artist?.name}
                                    className="blog-avatar"
                                />
                                <div className="blog-meta">
                                    <span className="blog-author">{blog.artist?.name}</span>
                                    <span className="blog-date">Posted {formatDate(blog.datePosted)}</span>
                                </div>
                                {JSON.parse(localStorage.getItem('currentArtist'))?.artistId === blog.artist?.artistId && (
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
                            <h4 className="blog-title">{blog.title}</h4>

                            {/* Content */}
                            <p className="blog-content">{blog.content}</p>

                            {/* Footer */}
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
                                <button className="blog-action"><span className="icon-hexagon"><Share2 size={18} /></span> Share</button>
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
                    ))
                ) : (
                    <div className="no-blogs-container">
                        <span className="no-blogs-icon"><FileQuestion size={48} /></span>
                        <h3 className="no-blogs-title">No blogs yet</h3>
                        <p className="no-blogs-text">Be the first to share your thoughts!</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default BlogsFeed;
