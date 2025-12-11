import React, { useState } from 'react';
import { Hexagon, MessageCircle, Share2, FileQuestion, ArrowUpDown, Trash2, Edit2, Flag } from 'lucide-react';
import TagList from '../common/TagList';
import ReportModal from '../common/ReportModal';
import CommentSection from '../common/CommentSection';

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

const BlogCard = ({
    blog,
    currentUser,
    isOpen,
    onToggle,
    comments,
    onLike,
    onShare,
    onEdit,
    onDelete,
    onAddComment,
    commentText,
    setCommentText,
    commentUserMap,
    artistsMap,
    onTagClick,
    selectedTagIds = [],
    onNavigate
}) => {
    const isOwner = currentUser?.artistId === blog.artist?.artistId;
    const [isReportModalOpen, setIsReportModalOpen] = useState(false);

    const handleCardClick = (e) => {
        // Prevent navigation if clicking interactive elements
        if (
            e.target.closest('button') ||
            e.target.closest('.blog-avatar') ||
            e.target.closest('.blog-author') ||
            e.target.closest('.tag-item') ||
            e.target.closest('a')
        ) {
            return;
        }
        if (onNavigate) {
            onNavigate('blog', blog.blogId);
        }
    };

    return (
        <div
            className="card-hexagon blog-card"
            onClick={handleCardClick}
            style={{ cursor: 'pointer' }}
        >
            {/* Header */}
            <div className="blog-header">
                <img
                    src={blog.artist?.profileImage || '/images/profile/default_profile.png'}
                    alt={blog.artist?.name}
                    className="blog-avatar"
                    onError={(e) => { e.target.src = '/images/profile/default_profile.png'; }}
                    onClick={(e) => {
                        e.stopPropagation();
                        if (onNavigate) onNavigate('profile', blog.artist?.artistId);
                    }}
                    style={{ cursor: 'pointer' }}
                />
                <div className="blog-meta">
                    <span
                        className="blog-author"
                        onClick={(e) => {
                            e.stopPropagation();
                            if (onNavigate) onNavigate('profile', blog.artist?.artistId);
                        }}
                        style={{ cursor: 'pointer' }}
                    >
                        {blog.artist?.name}
                    </span>
                    <span className="blog-date">
                        Posted {formatDate(blog.datePosted)}
                        {blog.isEdited && blog.dateEdited && (
                            <span className="blog-edited" style={{ marginLeft: '5px', fontStyle: 'italic', opacity: 0.7 }}>
                                (Edited {formatDate(blog.dateEdited)})
                            </span>
                        )}
                    </span>
                </div>
                {isOwner && (
                    <div className="blog-admin-actions" style={{ marginLeft: 'auto', display: 'flex', gap: '5px' }}>
                        {onEdit && (
                            <button
                                onClick={(e) => { e.stopPropagation(); onEdit(blog); }}
                                className="edit-blog-btn icon-hexagon"
                                title="Edit Blog"
                            >
                                <Edit2 size={18} />
                            </button>
                        )}
                        {onDelete && (
                            <button
                                onClick={(e) => { e.stopPropagation(); onDelete(blog.blogId); }}
                                className="delete-blog-btn icon-hexagon"
                                title="Delete Blog"
                            >
                                <Trash2 size={18} />
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* Title */}
            <h4 className="blog-title">
                {blog.title}
            </h4>

            {/* Tags Display */}
            {blog.blogTags && blog.blogTags.length > 0 && (
                <div style={{ marginBottom: '10px' }}>
                    <TagList
                        tags={blog.blogTags.map(bt => bt.tag)}
                        readOnly={true}
                        className="blog-card-tags"
                        onTagClick={(tag) => {
                            if (onTagClick) {
                                onTagClick(tag);
                            } else if (onNavigate) {
                                onNavigate('blogs', { tagId: tag.tagId });
                            }
                        }}
                    />
                </div>
            )}

            {/* Content */}
            <p className="blog-content">{blog.content}</p>

            {/* Footer */}
            <div className="blog-footer">
                <button className="blog-action" onClick={(e) => { e.stopPropagation(); onLike(blog.blogId); }}>
                    <span className={`icon-hexagon ${blog.isLiked ? 'active' : ''}`}>
                        <Hexagon size={18} color={blog.isLiked ? "var(--primary-color)" : "currentColor"} fill={blog.isLiked ? "var(--primary-color)" : "none"} />
                    </span>
                    Like ({blog.likeCount || 0})
                </button>
                <button className="blog-action" onClick={(e) => { e.stopPropagation(); onToggle(blog.blogId); }}>
                    <span className="icon-hexagon"><MessageCircle size={18} /></span> Comments
                </button>
                <button className="blog-action" onClick={(e) => { e.stopPropagation(); onShare(blog.blogId); }}><span className="icon-hexagon"><Share2 size={18} /></span> Share</button>
                <button className="blog-action" onClick={(e) => { e.stopPropagation(); setIsReportModalOpen(true); }} title="Report Content">
                    <span className="icon-hexagon"><Flag size={18} /></span> Report
                </button>
            </div>

            <ReportModal
                isOpen={isReportModalOpen}
                onClose={() => setIsReportModalOpen(false)}
                reporterId={currentUser?.artistId || 0}
                reportedItemId={blog.blogId}
                itemType="BLOG"
            />

            {/* Comments Section */}
            {isOpen && (
                <div onClick={(e) => e.stopPropagation()}>
                    <CommentSection
                        comments={comments}
                        onAddComment={() => onAddComment(blog.blogId)}
                        commentText={commentText}
                        setCommentText={setCommentText}
                        currentUser={currentUser}
                        onNavigate={onNavigate}
                        loading={!comments}
                    />
                </div>
            )}
        </div>
    );
};

export default BlogCard;
