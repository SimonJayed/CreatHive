import React from 'react';
import { Hexagon, MessageCircle, Share2, Star, Trash2, Archive } from 'lucide-react';
import { usePopup } from '../../context/PopupContext';

function ArtworkCard({ artwork, onLike, onFavorite, isFavorited, onComment, showFavorite = true, onDelete, onArchive, isArchived }) {
    const isLiked = artwork.isLiked;
    const { showAlert } = usePopup();

    const handleShare = () => {
        const url = `${window.location.origin}/artwork/${artwork.artworkId}`;
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

    return (
        <div className="card-hexagon" style={{
            padding: 0,
            marginBottom: '20px',
            breakInside: 'avoid',
            backgroundColor: 'white',
            overflow: 'hidden',
            border: '2px solid transparent' // Reset border for hover effect
        }}>
            {/* Image */}
            <div style={{ width: '100%', position: 'relative' }}>
                <img
                    src={artwork.image}
                    alt={artwork.title}
                    style={{ width: '100%', display: 'block', height: 'auto' }}
                />
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '10px', background: 'linear-gradient(transparent, rgba(0,0,0,0.8))', color: 'white' }}>
                    <h3 style={{ margin: 0, fontSize: '18px', fontFamily: 'var(--font-family)', letterSpacing: 'var(--letter-spacing-wide)' }}>{artwork.title}</h3>
                    <p style={{ margin: '4px 0 0', fontSize: '14px', opacity: 0.9, fontFamily: 'var(--font-family)' }}>
                        by <a href={`/profile/${artwork.artist?.artistId}`} style={{ color: 'inherit', textDecoration: 'underline' }}>{artwork.artist?.name || 'Unknown'}</a>
                    </p>
                    <p style={{ margin: '2px 0 0', fontSize: '10px', opacity: 0.7, fontFamily: 'var(--font-family)' }}>
                        {new Date(artwork.creationDate).toLocaleString(undefined, {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                        })}
                    </p>
                </div>
            </div>

            {/* Tags - Moved to minimal padding */}
            <div style={{ padding: '4px 8px', display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                {artwork.displayTags && artwork.displayTags.map(tag => (
                    <span key={tag.tagId} style={{
                        fontSize: '10px',
                        backgroundColor: 'rgba(255, 184, 0, 0.2)', // Lighter, more subtle
                        color: 'var(--text-color)',
                        border: '1px solid var(--primary-color)',
                        padding: '1px 6px',
                        borderRadius: '4px', // Less pill-like, more tag-like
                        fontWeight: '500',
                        fontFamily: 'var(--font-family)'
                    }}>
                        {tag.name}
                    </span>
                ))}
            </div>

            {/* Footer - Reduced padding and removed border for cleaner look */}
            <div style={{ padding: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <button
                        onClick={() => onLike(artwork.artworkId)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', color: 'var(--text-color)', fontFamily: 'var(--font-family)', padding: 0 }}
                        title="Like"
                        className="icon-button"
                    >
                        <span className={`icon-hexagon ${isLiked ? 'active' : ''}`} style={{ transform: isLiked ? 'scale(1.1)' : 'scale(1)' }}>
                            <Hexagon size={18} color={isLiked ? "var(--primary-color)" : "currentColor"} fill={isLiked ? "var(--primary-color)" : "none"} />
                        </span>
                        {artwork.likeCount || 0}
                    </button>
                    <button
                        onClick={() => onComment && onComment(artwork.artworkId)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', color: 'var(--text-color)', fontFamily: 'var(--font-family)', padding: 0 }}
                        title="Comment"
                        className="icon-button"
                    >
                        <span className="icon-hexagon"><MessageCircle size={18} /></span> 0
                    </button>
                </div>
                <div style={{ display: 'flex', gap: '4px' }}>
                    <button
                        onClick={handleShare}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '4px', color: 'var(--text-color)' }}
                        title="Share"
                        className="icon-button"
                    >
                        <Share2 size={18} />
                    </button>
                    {showFavorite && (
                        <button
                            onClick={() => onFavorite && onFavorite(artwork.artworkId)}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--primary-color)', padding: '4px' }}
                            title="Favorite"
                            className="icon-button"
                        >
                            <span className={`icon-hexagon ${isFavorited ? 'active' : ''}`}>
                                <Star size={18} fill={isFavorited ? "currentColor" : "none"} />
                            </span>
                        </button>
                    )}
                    {onArchive && (
                        <button
                            onClick={() => onArchive(artwork.artworkId)}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-color)', padding: '4px' }}
                            title={isArchived ? "Unarchive" : "Archive"}
                            className="icon-button"
                        >
                            <span className={`icon-hexagon ${isArchived ? 'active' : ''}`}>
                                <Archive size={18} />
                            </span>
                        </button>
                    )}
                    {onDelete && (
                        <button
                            onClick={() => onDelete(artwork.artworkId)}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--danger-color)', padding: '4px' }}
                            title="Delete"
                            className="icon-button"
                        >
                            <span className="icon-hexagon"><Trash2 size={18} /></span>
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ArtworkCard;
