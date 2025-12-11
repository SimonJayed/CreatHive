
import React, { useState, useEffect } from 'react';
import { usePopup } from '../../context/PopupContext';
import {
    getBlogById,
    getBlogsByTagId,
    likeBlog,
    getRelatedBlogs
} from '../../api/blogApi';
import { getCommentsByBlogId, addComment as addCommentToBlog } from '../../api/commentApi';
import { getAllArtists } from '../../api/artistApi';
import { Hexagon, MessageCircle, Share2, ArrowLeft, Edit2, Flag, Trash2 } from 'lucide-react';
import ReportModal from '../common/ReportModal';
import TagList from '../common/TagList';
import LoadingSpinner from '../common/LoadingSpinner';
import CommentSection from '../common/CommentSection';
import RelatedItems from '../common/RelatedItems';
import '../../styles/BlogDetails.css';

function BlogDetails({ blogId, currentUser, onNavigate }) {
    const { showAlert, showConfirm } = usePopup();
    const [blog, setBlog] = useState(null);
    const [comments, setComments] = useState([]);
    const [commentText, setCommentText] = useState('');
    const [showComments, setShowComments] = useState(false);
    const [loading, setLoading] = useState(true);
    const [isReportModalOpen, setIsReportModalOpen] = useState(false);
    const [relatedBlogs, setRelatedBlogs] = useState([]);

    useEffect(() => {
        loadData();
    }, [blogId, currentUser]);

    const loadData = async () => {
        setLoading(true);
        setRelatedBlogs([]);
        setShowComments(false);

        try {
            const userId = currentUser?.artistId || 0;
            const blogData = await getBlogById(blogId, userId);

            // If blog doesn't exist
            if (!blogData) {
                setBlog(null);
                setLoading(false);
                return;
            }

            const commentsData = await getCommentsByBlogId(blogId);
            const artistsData = await getAllArtists();

            // Map artists for comments if needed (though backend usually handles it, good for fallback)
            const aMap = {};
            artistsData.forEach(a => aMap[a.artistId] = a);

            setBlog(blogData);
            setComments(commentsData);

            // --- FETCH RELATED BLOGS ---
            let recs = [];
            const currentId = parseInt(blogId);

            // 1. By Tag
            if (blogData.blogTags && blogData.blogTags.length > 0) {
                const firstTagId = blogData.blogTags[0].tagId;
                try {
                    const byTag = await getBlogsByTagId(firstTagId, userId);
                    recs = [...recs, ...byTag];
                } catch (err) {
                    console.error("Failed to load tag-based blogs", err);
                }
            }

            // 2. By Author (TODO: Add getBlogsByAuthorId if available, for now relies on tags)
            // 3. Fetch related blogs (Backend logic)
            const related = await getRelatedBlogs(blogId, currentUser ? currentUser.artistId : 0);

            // Transform for display
            const formattedRelated = related.map(b => ({
                id: b.blogId,
                title: b.title,
                authorName: b.author?.name || "Unknown",
                image: b.author?.profileImage
                    ? `data: image / jpeg; base64, ${b.author.profileImage} `
                    : "/images/profile/default_profile.png"
            }));

            setRelatedBlogs(formattedRelated);

        } catch (error) {
            console.error("Error loading blog data:", error);
            // showAlert("Error", "Failed to load blog.");
        } finally {
            setLoading(false);
        }
    };

    const handleLike = async () => {
        if (!currentUser) {
            showAlert("Login Required", "Please login to like this blog.");
            return;
        }
        try {
            const updated = await likeBlog(blogId, currentUser.artistId);
            setBlog(prev => ({ ...prev, isLiked: updated.isLiked, likeCount: updated.likeCount }));
        } catch (error) {
            console.error("Error liking blog:", error);
        }
    };

    const handleAddComment = async () => {
        if (!commentText.trim()) return;
        if (!currentUser) {
            showAlert("Login Required", "Please login to comment.");
            return;
        }

        try {
            const newComment = await addCommentToBlog(blogId, currentUser.artistId, commentText);
            setComments(prev => [...prev, newComment]);
            setCommentText('');
        } catch (error) {
            console.error("Error adding comment:", error);
            showAlert("Error", "Failed to add comment.");
        }
    };

    const handleShare = () => {
        const url = `${window.location.origin} /blog/${blogId} `;
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

    const handleDelete = () => {
        // ... (Deletion logic if needed, but usually handled in CRUD or Feed)
        showAlert("Wait", "Delete functionality is typically accessed from your profile or feed.");
    };

    if (loading) return <LoadingSpinner />;
    if (!blog) return <div style={{ color: 'var(--text-color)', textAlign: 'center', marginTop: '50px' }}>Blog not found.</div>;

    const isOwner = currentUser?.artistId === blog.author?.artistId;

    const formatDate = (dateString) => {
        if (!dateString) return '';
        return new Date(dateString).toLocaleString(undefined, {
            year: 'numeric', month: 'short', day: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });
    };

    return (
        <div className="blog-details-page">
            <button
                onClick={() => onNavigate('blogs')}
                className="blog-back-btn"
            >
                <ArrowLeft size={20} /> Back to Blogs
            </button>

            <div className={`blog - details - container ${showComments ? 'with-comments' : 'no-comments'} `}>

                {/* 2-Column Grid */}
                <div className="blog-content-grid">

                    {/* LEFT COLUMN: Main Content */}
                    <div className="blog-main-column">
                        <div className="blog-card-details">
                            {/* Header Section: Title & Meta */}
                            <div className="blog-header-section">
                                <h1 className="blog-title-large">{blog.title}</h1>

                                <div className="blog-meta-row">
                                    <div className="blog-author-info">
                                        <span style={{ opacity: 0.7 }}>by </span>
                                        <img
                                            src={blog.author?.profileImage || '/images/profile/default_profile.png'}
                                            alt={blog.author?.name}
                                            className="blog-avatar-small"
                                            onError={(e) => { e.target.src = '/images/profile/default_profile.png'; }}
                                            onClick={() => onNavigate && onNavigate('profile', blog.author?.artistId)}
                                        />
                                        <div className="blog-author-details">
                                            <span
                                                className="blog-author-name"
                                                onClick={() => onNavigate && onNavigate('profile', blog.author?.artistId)}
                                            >
                                                {blog.author?.name || 'Unknown Artist'}
                                            </span>
                                        </div>
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
                            </div>

                            {/* Content Section */}
                            <div className="blog-section">
                                <div className="blog-content-body">
                                    {blog.content}
                                </div>
                            </div>

                            {/* Tags Section */}
                            {blog.blogTags && blog.blogTags.length > 0 && (
                                <div className="blog-section">
                                    <h3 className="blog-section-label">Tags</h3>
                                    <div className="blog-tags-section">
                                        <TagList
                                            tags={blog.blogTags.map(bt => bt.tag)}
                                            readOnly={true}
                                            onTagClick={(tag) => onNavigate('blogs', { tagId: tag.tagId })}
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Timestamp */}
                            <div className="blog-timestamp-footer">
                                Posted on {formatDate(blog.datePosted)}
                                {blog.isEdited && blog.dateEdited && (
                                    <span> (Edited {formatDate(blog.dateEdited)})</span>
                                )}
                            </div>

                            {/* Actions Footer */}
                            <div className="blog-actions-footer">
                                <button className={`blog-action-btn ${blog.isLiked ? 'active' : ''}`} onClick={handleLike} title="Like">
                                    <Hexagon size={20} fill={blog.isLiked ? "var(--primary-color)" : "none"} color={blog.isLiked ? "var(--primary-color)" : "currentColor"} />
                                    <span>Like {blog.likeCount > 0 && `(${blog.likeCount})`}</span>
                                </button>

                                <button className={`blog-action-btn ${showComments ? 'active' : ''}`} onClick={() => setShowComments(!showComments)} title="Comments">
                                    <MessageCircle size={20} />
                                    <span>{showComments ? 'Hide Comments' : 'Comments'}</span>
                                </button>

                                <button className="blog-action-btn" onClick={handleShare} title="Share">
                                    <Share2 size={20} />
                                    <span>Share</span>
                                </button>

                                <button className="blog-action-btn" onClick={() => setIsReportModalOpen(true)} title="Report">
                                    <Flag size={20} />
                                    <span>Report</span>
                                </button>
                            </div>

                            {/* Comments Section Toggle */}
                            {showComments && (
                                <CommentSection
                                    comments={comments}
                                    onAddComment={handleAddComment}
                                    commentText={commentText}
                                    setCommentText={setCommentText}
                                    currentUser={currentUser}
                                    onNavigate={onNavigate}
                                    loading={!comments}
                                />
                            )}
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Sidebar */}
                    <div className="blog-sidebar-column">
                        <RelatedItems
                            items={relatedBlogs}
                            type="blog"
                            onNavigate={onNavigate}
                        />
                    </div>
                </div>

                <ReportModal
                    isOpen={isReportModalOpen}
                    onClose={() => setIsReportModalOpen(false)}
                    reporterId={currentUser?.artistId || 0}
                    reportedItemId={blog.blogId}
                    itemType="BLOG"
                />
            </div>
        </div>
    );
}

export default BlogDetails;
