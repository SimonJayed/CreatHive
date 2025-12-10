import React from 'react';


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

const CommentSection = ({
    comments,
    onAddComment,
    commentText,
    setCommentText,
    currentUser,
    onNavigate,
    loading
}) => {
    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            onAddComment();
        }
    };

    return (
        <div className="comments-section">
            <div className="comments-label" style={{ marginBottom: '10px', fontWeight: 'bold', color: 'var(--primary-color)' }}>Comments</div>

            {/* Comment Input */}
            <div className="comment-input-wrapper" style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
                <input
                    type="text"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={currentUser ? "Write a comment..." : "Login to comment"}
                    className="input-hexagon comment-input"
                    style={{ flex: 1, padding: '10px' }}
                    disabled={!currentUser}
                />
                <button
                    onClick={onAddComment}
                    className="button-hexagon post-comment-btn"
                    disabled={!currentUser || !commentText.trim()}
                >
                    Post
                </button>
            </div>

            {/* Comments List */}
            <div className="comments-list" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {loading && <div style={{ opacity: 0.6, fontStyle: 'italic' }}>Loading comments...</div>}

                {!loading && comments && comments.length > 0 ? (
                    comments.map(comment => {
                        // Priority: Direct Author Object -> Legacy Mapped Artist
                        const commenter = comment.author || comment.artist || { name: 'Unknown User', profileImage: null, artistId: 0 };

                        return (
                            <div key={comment.commentId} className="comment-item" style={{ display: 'flex', gap: '12px', padding: '10px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
                                <img
                                    src={commenter.profileImage || '/images/profile/default_profile.png'}
                                    alt={commenter.name}
                                    className="comment-avatar"
                                    style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover', cursor: 'pointer' }}
                                    onError={(e) => { e.target.src = '/images/profile/default_profile.png'; }}
                                    onClick={() => onNavigate && onNavigate('profile', commenter.artistId)}
                                />
                                <div style={{ flex: 1 }}>
                                    <div className="comment-header" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                                        <span
                                            className="comment-author"
                                            style={{ fontWeight: 'bold', color: 'var(--text-color)', cursor: 'pointer' }}
                                            onClick={() => onNavigate && onNavigate('profile', commenter.artistId)}
                                        >
                                            {commenter.name}
                                        </span>
                                        <span className="comment-date" style={{ fontSize: '0.8em', opacity: 0.6 }}>
                                            • {formatDate(comment.datePosted || comment.creationDate)}
                                        </span>
                                    </div>
                                    <p className="comment-content" style={{ margin: 0, color: 'var(--text-color)' }}>{comment.content}</p>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    !loading && (
                        <div style={{ textAlign: 'center', padding: '10px', opacity: 0.6, fontSize: '0.9em' }}>
                            No comments yet.
                        </div>
                    )
                )}
            </div>
        </div>
    );
};

export default CommentSection;
