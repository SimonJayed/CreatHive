import React, { useState, useEffect } from 'react';
import { usePopup } from '../../context/PopupContext';
import { getBlogById, likeBlog, deleteBlog } from '../../api/blogApi';
import { getCommentsByBlogId, addComment } from '../../api/commentApi';
import { getAllArtists } from '../../api/artistApi';
import { Hexagon, MessageCircle, Share2, ArrowLeft, Trash2, Edit2, Flag } from 'lucide-react';
import ReportModal from '../common/ReportModal';
import TagList from '../common/TagList';
import LoadingSpinner from '../common/LoadingSpinner';
import CommentSection from '../common/CommentSection';
import '../../styles/BlogDetails.css';

function BlogDetails({ blogId, currentUser, onNavigate }) {
    const { showAlert, showConfirm } = usePopup();
    const [blog, setBlog] = useState(null);
    const [comments, setComments] = useState([]);
    const [artistsMap, setArtistsMap] = useState({});
    const [commentText, setCommentText] = useState('');
    const [showComments, setShowComments] = useState(true);
    const [loading, setLoading] = useState(true);
    const [isReportModalOpen, setIsReportModalOpen] = useState(false);

    useEffect(() => {
        loadData();
    }, [blogId, currentUser]);

    const loadData = async () => {
        setLoading(true);
        try {
            const userId = currentUser?.artistId || 0;
            const blogData = await getBlogById(blogId, userId);

            if (!blogData) {
                setLoading(false);
                return;
            }

            const commentsData = await getCommentsByBlogId(blogId);
            const artistsData = await getAllArtists();

            const aMap = {};
            artistsData.forEach(a => aMap[a.artistId] = a);
            setArtistsMap(aMap);

            setBlog(blogData);

            const enrichedComments = commentsData.map(comment => {
                let artist = comment.author;
                if (!artist && comment.authorId) {
                    artist = aMap[comment.authorId];
                }
                return {
                    ...comment,
                    artist: artist || { name: 'Unknown', profileImage: null, artistId: 0 }
                };
            });
            setComments(enrichedComments);

        } catch (error) {
            console.error("Failed to load blog details", error);
            showAlert("Error", "Failed to load blog details.");
        } finally {
            setLoading(false);
        }
    };

    const handleLike = async () => {
        if (!currentUser) {
            showAlert("Login Required", "Please login to like.");
            return;
        }
        try {
            const updated = await likeBlog(blogId, currentUser.artistId);
            setBlog(prev => ({
                ...prev,
                likeCount: updated.likeCount,
                isLiked: updated.isLiked
            }));
        } catch (error) {
            console.error("Failed to like blog", error);
        }
    };

    const handleShare = () => {
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

    const handleAddComment = async () => {
        if (!commentText.trim()) return;
        if (!currentUser) {
            showAlert("Login Required", "Please login to comment.");
            return;
        }

        try {
            const newComment = await addComment(blogId, currentUser.artistId, commentText);
            setComments(prev => [...prev, { ...newComment, artist: currentUser }]);
            setCommentText('');
        } catch (error) {
            console.error("Failed to add comment", error);
            showAlert("Error", "Failed to add comment.");
        }
    };

    const handleDelete = () => {
        showConfirm(
            "Delete Blog",
            "Are you sure you want to delete this blog?",
            async () => {
                try {
                    await deleteBlog(blogId, currentUser.artistId);
                    onNavigate('blogs');
                } catch (error) {
                    console.error("Failed to delete blog", error);
                    showAlert("Error", "Failed to delete blog");
                }
            }
        );
    };

    if (loading) return <LoadingSpinner />;
    if (!blog) return <div style={{ color: 'var(--text-color)', textAlign: 'center', marginTop: '50px' }}>Blog not found.</div>;

    const isOwner = currentUser?.artistId === blog.author?.artistId;

    const formatDate = (dateString) => {
        if (!dateString) return 'Unknown Date';
        return new Date(dateString).toLocaleString(undefined, {
            year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
        });
    };

    return (
        <div className="blog-details-container">
            <button
                onClick={() => onNavigate('blogs')}
                className="blog-back-btn"
            >
                <ArrowLeft size={20} /> Back to Blogs
            </button>

            <div className="blog-card-details">
                {/* Header */}
                <div className="blog-header-row">
                    <img
                        src={blog.author?.profileImage || '/images/profile/default_profile.png'}
                        alt={blog.author?.name}
                        className="blog-avatar-large"
                        onError={(e) => { e.target.src = '/images/profile/default_profile.png'; }}
                        onClick={() => onNavigate && onNavigate('profile', blog.author?.artistId)}
                    />
                    <div className="blog-meta-column">
                        <span
                            className="blog-author-name"
                            onClick={() => onNavigate && onNavigate('profile', blog.author?.artistId)}
                        >
                            {blog.author?.name || 'Unknown Artist'}
                        </span>
                        <span className="blog-timestamp">
                            Posted {formatDate(blog.datePosted)}
                            {blog.isEdited && blog.dateEdited && (
                                <span style={{ marginLeft: '5px', fontStyle: 'italic', opacity: 0.7 }}>
                                    (Edited {formatDate(blog.dateEdited)})
                                </span>
                            )}
                        </span>
                    </div>
                    {isOwner && (
                        <div className="blog-admin-actions">
                            <button
                                onClick={() => onNavigate('upload-blog', { blogToEdit: blog })}
                                className="blog-action-btn"
                                title="Edit Blog"
                            >
                                <Edit2 size={18} />
                            </button>
                            <button
                                onClick={handleDelete}
                                className="blog-action-btn"
                                title="Delete Blog"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    )}
                </div>

                <h1 className="blog-title-large">{blog.title}</h1>

                {/* Tags */}
                {blog.blogTags && blog.blogTags.length > 0 && (
                    <div className="blog-tags-section">
                        <TagList
                            tags={blog.blogTags.map(bt => bt.tag)}
                            readOnly={true}
                            onTagClick={(tag) => onNavigate('blogs', { tagId: tag.tagId })}
                        />
                    </div>
                )}

                <div className="blog-content-body">
                    {blog.content}
                </div>

                {/* Footer Actions */}
                <div className="blog-actions-footer">
                    <button className={`blog-action-btn ${blog.isLiked ? 'active' : ''}`} onClick={handleLike}>
                        <Hexagon size={20} fill={blog.isLiked ? "var(--primary-color)" : "none"} color={blog.isLiked ? "var(--primary-color)" : "currentColor"} />
                        <span>Like {blog.likeCount > 0 && `(${blog.likeCount})`}</span>
                    </button>

                    <button className={`blog-action-btn ${showComments ? 'active' : ''}`} onClick={() => setShowComments(!showComments)}>
                        <MessageCircle size={20} />
                        <span>{showComments ? 'Hide Comments' : 'Comments'}</span>
                    </button>

                    <button className="blog-action-btn" onClick={handleShare}>
                        <Share2 size={20} />
                        <span>Share</span>
                    </button>

                    <button className="blog-action-btn" onClick={() => setIsReportModalOpen(true)} title="Report Content">
                        <Flag size={20} />
                        <span>Report</span>
                    </button>
                </div>

                {showComments && (
                    <CommentSection
                        comments={comments}
                        onAddComment={handleAddComment}
                        commentText={commentText}
                        setCommentText={setCommentText}
                        currentUser={currentUser}
                        onNavigate={onNavigate}
                        loading={false}
                    />
                )}
            </div>

            <ReportModal
                isOpen={isReportModalOpen}
                onClose={() => setIsReportModalOpen(false)}
                reporterId={currentUser?.artistId || 0}
                reportedItemId={blogId}
                itemType="BLOG"
            />
        </div>
    );
}

export default BlogDetails;
