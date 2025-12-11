
import React, { useState, useEffect } from 'react';
import { usePopup } from '../../context/PopupContext';
import {
    getArtworkById,
    likeArtwork,
    favoriteArtwork,
    getArtworksByTagId,
    getArtworksByArtistId,
    getRelatedArtworks
} from '../../api/artworkApi';
import { getCommentsByArtworkId, addCommentToArtwork } from '../../api/commentApi';
import { getAllArtists } from '../../api/artistApi';
import { Hexagon, MessageCircle, Share2, Star, Flag, ArrowLeft } from 'lucide-react';
import ReportModal from '../common/ReportModal';
import TagList from '../common/TagList';
import LoadingSpinner from '../common/LoadingSpinner';
import CommentSection from '../common/CommentSection';
import RelatedItems from '../common/RelatedItems';
import '../../styles/ArtworkDetails.css';

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
    const [relatedArtworks, setRelatedArtworks] = useState([]);

    useEffect(() => {
        loadData();
    }, [artworkId, currentUser]);

    const loadData = async () => {
        setLoading(true);
        // Reset state for new navigation
        setRelatedArtworks([]);
        setShowComments(false);

        try {
            const userId = currentUser?.artistId || 0;
            const artworkData = await getArtworkById(artworkId, userId);

            // Only proceed if artwork exists
            if (!artworkData) {
                setArtwork(null);
                setLoading(false);
                return;
            }

            const commentsData = await getCommentsByArtworkId(artworkId);
            const artistsData = await getAllArtists();

            // Map artists
            const aMap = {};
            artistsData.forEach(a => aMap[a.artistId] = a);
            setArtistsMap(aMap);

            setArtwork(artworkData);

            // --- FETCH RECOMMENDATIONS ---
            let recommendations = [];
            const currentId = parseInt(artworkId);

            // 3. Fetch related artworks (Backend does the heavy lifting now)
            const related = await getRelatedArtworks(artworkId, currentUser ? currentUser.artistId : 0);

            // Map to display format
            const formattedRelated = related.map(a => {
                let displayImage = null;
                if (a.image) {
                    // Check if it already has the data prefix
                    if (a.image.startsWith('data:')) {
                        displayImage = a.image;
                    } else {
                        // Assume base64 jpeg if no prefix
                        displayImage = `data:image/jpeg;base64,${a.image}`;
                    }
                }

                return {
                    id: a.artworkId,
                    title: a.title,
                    image: displayImage,
                    authorName: a.artist?.username || "Unknown"
                };
            });

            setRelatedArtworks(formattedRelated);
            // -----------------------------

            // Enrich comments with artist data
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
            console.error("Failed to load artwork details", error);
            // Don't show alert immediately on nav errors, maybe just log or show friendly UI
            // showAlert("Error", "Failed to load artwork details."); 
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
            loadData();
        } catch (error) {
            console.error("Failed to favorite", error);
        }
    };

    const handleShare = () => {
        const url = `${window.location.origin} /artwork/${artworkId} `;
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
        <div className="artwork-details-page">
            <button
                onClick={() => onNavigate('explore')}
                className="artwork-back-btn"
            >
                <ArrowLeft size={20} /> Back to Explore
            </button>

            <div className={`artwork - details - container ${showComments ? 'with-comments' : 'no-comments'} `}>

                {/* 2-Column Grid Wrapper */}
                <div className="artwork-content-grid">

                    {/* LEFT COLUMN: Main Content */}
                    <div className="artwork-main-column">
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
                    </div>

                    {/* RIGHT COLUMN: Recommendations */}
                    <div className="artwork-sidebar-column">
                        <RelatedItems
                            items={relatedArtworks}
                            type="artwork"
                            onNavigate={onNavigate}
                        />
                    </div>

                </div>

                <ReportModal
                    isOpen={isReportModalOpen}
                    onClose={() => setIsReportModalOpen(false)}
                    reporterId={currentUser?.artistId || 0}
                    reportedItemId={artworkId}
                    itemType="ARTWORK"
                />
            </div>
        </div>
    );
}

export default ArtworkDetails;
