import React from 'react';
import { FaHeart, FaRegHeart, FaRegComment, FaShare, FaStar, FaRegStar, FaTrash } from 'react-icons/fa';

function ArtworkCard({ artwork, onLike, onFavorite, isFavorited, onComment, showFavorite = true, onDelete }) {
    const isLiked = artwork.likeCount > 0; // Simplified logic

    return (
        <div className="card" style={{
            padding: 0,
            marginBottom: '20px',
            breakInside: 'avoid',
            backgroundColor: 'white',
            overflow: 'hidden'
        }}>
            {/* Image */}
            <div style={{ width: '100%', position: 'relative' }}>
                <img
                    src={artwork.image}
                    alt={artwork.title}
                    style={{ width: '100%', display: 'block', height: 'auto' }}
                />
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '10px', background: 'linear-gradient(transparent, rgba(0,0,0,0.7))', color: 'white' }}>
                    <h3 style={{ margin: 0, fontSize: '18px', fontFamily: 'var(--font-family)' }}>{artwork.title}</h3>
                    <p style={{ margin: '4px 0 0', fontSize: '14px', opacity: 0.9, fontFamily: 'var(--font-family)' }}>by {artwork.artist?.name || 'Unknown'}</p>
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

            {/* Footer */}
            <div style={{ padding: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <button
                        onClick={() => onLike(artwork.artworkId)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', color: '#333', fontFamily: 'var(--font-family)' }}
                        title="Like"
                        className="icon-button"
                    >
                        <span className="icon">{isLiked ? <FaHeart color="var(--primary-color)" /> : <FaRegHeart />}</span> {artwork.likeCount || 0}
                    </button>
                    <button
                        onClick={() => onComment && onComment(artwork.artworkId)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', color: '#333', fontFamily: 'var(--font-family)' }}
                        title="Comment"
                        className="icon-button"
                    >
                        <span className="icon"><FaRegComment /></span> 0
                    </button>
                    <button
                        style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', color: '#333', fontFamily: 'var(--font-family)' }}
                        title="Share"
                        className="icon-button"
                    >
                        <span className="icon"><FaShare /></span>
                    </button>
                </div>
                {showFavorite && (
                    <button
                        onClick={() => onFavorite && onFavorite(artwork.artworkId)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px', color: 'var(--primary-color)' }}
                        title="Favorite"
                        className="icon-button"
                    >
                        <span className="icon">{isFavorited ? <FaStar /> : <FaRegStar />}</span>
                    </button>
                )}
                {onDelete && (
                    <button
                        onClick={() => onDelete(artwork.artworkId)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px', color: 'var(--danger-color)', marginLeft: '8px' }}
                        title="Delete"
                        className="icon-button"
                    >
                        <span className="icon"><FaTrash /></span>
                    </button>
                )}
            </div>
        </div>
    );
}

export default ArtworkCard;
