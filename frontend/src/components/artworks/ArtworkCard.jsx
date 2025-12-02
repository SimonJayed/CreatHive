import React from 'react';
import { FaHeart, FaRegHeart, FaRegComment, FaShare, FaStar, FaRegStar } from 'react-icons/fa';

function ArtworkCard({ artwork, onLike, onFavorite, isFavorited, onComment, showFavorite = true }) {
    const isLiked = artwork.likeCount > 0; // Simplified logic

    return (
        <div className="artwork-card" style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            overflow: 'hidden',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            marginBottom: '20px',
            breakInside: 'avoid'
        }}>
            {/* Image */}
            <div style={{ width: '100%', position: 'relative' }}>
                <img
                    src={artwork.image}
                    alt={artwork.title}
                    style={{ width: '100%', display: 'block', height: 'auto' }}
                />
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '10px', background: 'linear-gradient(transparent, rgba(0,0,0,0.7))', color: 'white' }}>
                    <h3 style={{ margin: 0, fontSize: '18px' }}>{artwork.title}</h3>
                    <p style={{ margin: '4px 0 0', fontSize: '14px', opacity: 0.9 }}>by {artwork.artist?.name || 'Unknown'}</p>
                    <p style={{ margin: '2px 0 0', fontSize: '10px', opacity: 0.7 }}>
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
            <div style={{ padding: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #eee' }}>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <button
                        onClick={() => onLike(artwork.artworkId)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', color: '#333' }}
                        title="Like"
                    >
                        {isLiked ? <FaHeart color="#FFB800" /> : <FaRegHeart />} {artwork.likeCount || 0}
                    </button>
                    <button
                        onClick={() => onComment && onComment(artwork.artworkId)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', color: '#333' }}
                        title="Comment"
                    >
                        <FaRegComment /> 0
                    </button>
                    <button
                        style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', color: '#333' }}
                        title="Share"
                    >
                        <FaShare />
                    </button>
                </div>
                {showFavorite && (
                    <button
                        onClick={() => onFavorite && onFavorite(artwork.artworkId)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px', color: '#FFB800' }}
                        title="Favorite"
                    >
                        {isFavorited ? <FaStar /> : <FaRegStar />}
                    </button>
                )}
            </div>
        </div>
    );
}

export default ArtworkCard;
