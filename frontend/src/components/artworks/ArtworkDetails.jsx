import React, { useState, useEffect } from 'react';
import { usePopup } from '../../context/PopupContext';
import { getArtworkById, likeArtwork, favoriteArtwork } from '../../api/artworkApi';
import { getCommentsByArtworkId, addCommentToArtwork } from '../../api/commentApi';
import { getAllArtists } from '../../api/artistApi';
import { getAllUserComments } from '../../api/userCommentApi';
import { Hexagon, MessageCircle, Share2, Star, Flag, ArrowLeft } from 'lucide-react';
import ReportModal from '../common/ReportModal';
import TagList from '../common/TagList';
import LoadingSpinner from '../common/LoadingSpinner';
import '../../styles/ArtworkDetails.css'; // New styles

function ArtworkDetails({ artworkId, currentUser, onNavigate }) {
    const { showAlert, showConfirm } = usePopup();
    const [artwork, setArtwork] = useState(null);
    const [comments, setComments] = useState([]);
    const [artistsMap, setArtistsMap] = useState({});
    const [commentUserMap, setCommentUserMap] = useState({});
    const [commentText, setCommentText] = useState('');
    const [showComments, setShowComments] = useState(false);
    const [loading, setLoading] = useState(true);
    const [isReportModalOpen, setIsReportModalOpen] = useState(false);

    useEffect(() => {
        loadData();
    }, [artworkId, currentUser]);

    const loadData = async () => {
        setLoading(true);
        try {
            const userId = currentUser?.artistId || 0;
            const artworkData = await getArtworkById(artworkId, userId);
            const commentsData = await getCommentsByArtworkId(artworkId);
            const artistsData = await getAllArtists();
            const userCommentsData = await getAllUserComments();

            // Map artists
            const aMap = {};
            artistsData.forEach(a => aMap[a.artistId] = a);
            setArtistsMap(aMap);

            // Map comment -> user
            const cUserMap = {};
            userCommentsData.forEach(link => {
                cUserMap[link.id.commentId] = link.id.artistId;
            });
            setCommentUserMap(cUserMap);

            setArtwork(artworkData);

            // Enrich comments with artist data
            const enrichedComments = commentsData.map(comment => {
                const artistId = cUserMap[comment.commentId];
                const artist = aMap[artistId];
                return {
                    ...comment,
                    artist: artist || { name: 'Unknown', profileImage: null, artistId: 0 }
                };
            });
            setComments(enrichedComments);

        } catch (error) {
            console.error("Failed to load artwork details", error);
            showAlert("Error", "Failed to load artwork details.");
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
            const updated = await likeArtwork(artworkId, currentUser.artistId);
            setArtwork(prev => ({
                ...prev,
                likeCount: updated.likeCount,
                isLiked: updated.isLiked
            }));
        } catch (error) {
            console.error("Failed to like artwork", error);
        }
    };

    const handleFavorite = async () => {
        if (!currentUser) {
            showAlert("Login Required", "Please login to favorite.");
            return;
        }
        try {
            await favoriteArtwork(artworkId, currentUser.artistId);
            // Optimistic toggle simulation or simple messaging
            // Re-fetch to be safe as endpoint is void
            loadData();
        } catch (error) {
            console.error("Failed to favorite", error);
        }
    };

    const handleShare = () => {
        const url = `${window.location.origin}/artwork/${artworkId}`;
        navigator.clipboard.writeText(url);
        showAlert(
            "Share Artwork",
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
            const newComment = await addCommentToArtwork(artworkId, currentUser.artistId, commentText);

            // Update map
            setCommentUserMap(prev => ({ ...prev, [newComment.commentId]: currentUser.artistId }));
            setComments(prev => [...prev, newComment]);
            setCommentText('');
        } catch (error) {
            console.error("Failed to add comment", error);
            showAlert("Error", "Failed to add comment.");
        }
    };

    if (loading) return <LoadingSpinner />;
    if (!artwork) return <div style={{ color: 'var(--text-color)', textAlign: 'center', marginTop: '50px' }}>Artwork not found.</div>;

    const formatDate = (dateString) => {
        if (!dateString) return '';
        return new Date(dateString).toLocaleString(undefined, {
            year: 'numeric', month: 'short', day: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });
    };

    return (
        <div className={`artwork-details-container ${showComments ? 'with-comments' : 'no-comments'}`}>
            <button
                onClick={() => onNavigate('explore')}
                className="artwork-back-btn"
            >
                <ArrowLeft size={20} /> Back to Explore
            </button>

            <div className="artwork-card">
                {/* Header: Title & Artist */}
                <div className="artwork-header">
                    <h1 className="artwork-title">{artwork.title}</h1>
                    <div className="artwork-artist-row">
                        <span style={{ opacity: 0.7 }}>by </span>
                        <div
                            className="artwork-artist-link"
                            onClick={() => onNavigate('profile', artwork.artist?.artistId)}
                        >
                            <img
                                src={artwork.artist?.profileImage || '/images/profile/default_profile.png'}
                                alt={artwork.artist?.name}
                                className="artwork-artist-avatar-small"
                                onError={(e) => { e.target.src = '/images/profile/default_profile.png'; }}
                            />
                            <span className="artwork-artist-name">{artwork.artist?.name || 'Unknown'}</span>
                        </div>
                    </div>
                </div>

                {/* Main Image */}
                <div className="artwork-image-wrapper">
                    <img
                        src={artwork.image}
                        alt={artwork.title}
                        className="artwork-full-image"
                    />
                </div>

                {/* Description & Metadata */}
                <div className="artwork-content">
                    <div className="artwork-section">
                        <h3 className="artwork-section-label">Description</h3>
                        <p className="artwork-description">
                            {artwork.description || "No description provided."}
                        </p>
                    </div>

                    <div className="artwork-section">
                        <h3 className="artwork-section-label">Tags</h3>
                        {artwork.displayTags && artwork.displayTags.length > 0 ? (
                            <TagList
                                tags={artwork.displayTags}
                                readOnly={true}
                                onTagClick={(tag) => onNavigate('explore', { tagId: tag.tagId })}
                            />
                        ) : (
                            <p style={{ opacity: 0.5 }}>No tags.</p>
                        )}
                    </div>

                    {/* Timestamp */}
                    <div className="artwork-date">
                        Posted on {formatDate(artwork.creationDate)}
                    </div>
                </div>

                {/* Actions Bar */}
                <div className="artwork-actions-bar">
                    <button onClick={handleLike} className={`artwork-action-item ${artwork.isLiked ? 'active' : ''}`} title="Like">
                        <Hexagon size={20} fill={artwork.isLiked ? "var(--primary-color)" : "none"} color={artwork.isLiked ? "var(--primary-color)" : "currentColor"} />
                        <span>Like {artwork.likeCount > 0 && `(${artwork.likeCount})`}</span>
                    </button>

                    <button onClick={() => setShowComments(!showComments)} className={`artwork-action-item ${showComments ? 'active' : ''}`} title={showComments ? "Hide Comments" : "Show Comments"}>
                        <MessageCircle size={20} />
                        <span>{showComments ? "Hide Comments" : "Comments"}</span>
                    </button>

                    <button onClick={handleFavorite} className={`artwork-action-item ${artwork.isFavorited ? 'active' : ''}`} title="Favorite">
                        <Star size={20} fill={artwork.isFavorited ? "var(--primary-color)" : "none"} color={artwork.isFavorited ? "var(--primary-color)" : "currentColor"} />
                        <span>Favorite</span>
                    </button>

                    <button onClick={handleShare} className="artwork-action-item" title="Share">
                        <Share2 size={20} />
                        <span>Share</span>
                    </button>

                    <button onClick={() => setIsReportModalOpen(true)} className="artwork-action-item" title="Report">
                        <Flag size={20} />
                    </button>
                </div>

                {/* Comments Feed - Toggleable */}
                {showComments && (
                    <div className="comments-section">
                        <div className="comments-label">Comments</div>
                        <div className="comments-feed">
                            {comments.map(comment => (
                                <div key={comment.commentId} className="comment-item">
                                    <img
                                        src={comment.artist?.profileImage || '/images/profile/default_profile.png'}
                                        alt={comment.artist?.name || 'User'}
                                        className="comment-avatar"
                                        onError={(e) => { e.target.src = '/images/profile/default_profile.png'; }}
                                        onClick={() => onNavigate && onNavigate('profile', comment.artist?.artistId)}
                                        style={{ cursor: 'pointer' }}
                                    />
                                    <div className="comment-content">
                                        <div className="comment-meta">
                                            <span
                                                className="comment-author-name"
                                                onClick={() => onNavigate && onNavigate('profile', comment.artist?.artistId)}
                                                style={{ cursor: 'pointer' }}
                                            >
                                                {comment.artist?.name || 'Unknown'}
                                            </span>
                                            <span className="comment-timestamp">
                                                {formatDate(comment.creationDate)}
                                            </span>
                                        </div>
                                        <p className="comment-text">{comment.content}</p>
                                    </div>
                                </div>
                            ))}
                            {comments.length === 0 && (
                                <div style={{ textAlign: 'center', padding: '20px', opacity: 0.6, fontSize: '14px' }}>
                                    No comments yet. Be the first to share your thoughts!
                                </div>
                            )}
                        </div>

                        {/* Footer Input */}
                        <div className="artwork-footer-input">
                            <input
                                id="comment-input-main"
                                type="text"
                                placeholder="Add a comment..."
                                className="input-hexagon width-full comment-input-field wide"
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleAddComment()}
                            />
                        </div>
                    </div>
                )}
            </div>

            <ReportModal
                isOpen={isReportModalOpen}
                onClose={() => setIsReportModalOpen(false)}
                reporterId={currentUser?.artistId || 0}
                reportedItemId={artworkId}
                itemType="ARTWORK"
            />
        </div>
    );
}

export default ArtworkDetails;
