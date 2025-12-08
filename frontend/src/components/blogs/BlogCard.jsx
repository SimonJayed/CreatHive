import React from 'react';
import { Hexagon, MessageCircle, Share2, FileQuestion, ArrowUpDown, Trash2, Edit2 } from 'lucide-react';
import TagList from '../common/TagList';

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
    selectedTagIds = []
}) => {
    const isOwner = currentUser?.artistId === blog.artist?.artistId;

    return (
        <div className="card-hexagon blog-card">
            {/* Header */}
            <div className="blog-header">
                <img
                    src={blog.artist?.profileImage || '/images/profile/default_profile.png'}
                    alt={blog.artist?.name}
                    className="blog-avatar"
                    onError={(e) => { e.target.src = '/images/profile/default_profile.png'; }}
                />
                <div className="blog-meta">
                    <span className="blog-author">{blog.artist?.name}</span>
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
                                onClick={() => onEdit(blog)}
                                className="edit-blog-btn icon-hexagon"
                                title="Edit Blog"
                            >
                                <Edit2 size={18} />
                            </button>
                        )}
                        {onDelete && (
                            <button
                                onClick={() => onDelete(blog.blogId)}
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
            <h4 className="blog-title">{blog.title}</h4>

            {/* Tags Display */}
            {blog.blogTags && blog.blogTags.length > 0 && (
                <div style={{ marginBottom: '10px' }}>
                    <TagList
                        tags={blog.blogTags.map(bt => bt.tag)}
                        readOnly={true}
                        className="blog-card-tags"
                        onTagClick={onTagClick ? (tag) => onTagClick(tag) : undefined}
                    />
                </div>
            )}

            {/* Content */}
            <p className="blog-content">{blog.content}</p>

            {/* Footer */}
            <div className="blog-footer">
                <button className="blog-action" onClick={() => onLike(blog.blogId)}>
                    <span className={`icon-hexagon ${blog.isLiked ? 'active' : ''}`}>
                        <Hexagon size={18} color={blog.isLiked ? "var(--primary-color)" : "currentColor"} fill={blog.isLiked ? "var(--primary-color)" : "none"} />
                    </span>
                    Like ({blog.likeCount || 0})
                </button>
                <button className="blog-action" onClick={() => onToggle(blog.blogId)}>
                    <span className="icon-hexagon"><MessageCircle size={18} /></span> Comments
                </button>
                <button className="blog-action" onClick={() => onShare(blog.blogId)}><span className="icon-hexagon"><Share2 size={18} /></span> Share</button>
            </div>

            {/* Comments Section */}
            {isOpen && (
                <div className="comments-section">
                    <div className="comment-input-wrapper">
                        <input
                            type="text"
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            placeholder="Write a comment..."
                            className="input-hexagon comment-input"
                        />
                        <button onClick={() => onAddComment(blog.blogId)} className="button-hexagon post-comment-btn">Post</button>
                    </div>
                    <div className="comments-list">
                        {comments?.map(comment => {
                            // Resolve commenter
                            const commenterId = commentUserMap[comment.commentId];
                            const commenter = artistsMap[commenterId] || { name: 'Unknown', profileImage: null };

                            return (
                                <div key={comment.commentId} className="comment-item">
                                    <img
                                        src={commenter.profileImage || '/images/profile/default_profile.png'}
                                        alt={commenter.name}
                                        className="comment-avatar"
                                        onError={(e) => { e.target.src = '/images/profile/default_profile.png'; }}
                                    />
                                    <div>
                                        <div className="comment-header">
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
    );
};

export default BlogCard;
