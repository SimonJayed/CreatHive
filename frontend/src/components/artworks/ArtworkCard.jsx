import React from 'react';
import { Hexagon, MessageCircle, Share2, Star, Trash2, Archive } from 'lucide-react';

function ArtworkCard({ artwork, onLike, onFavorite, isFavorited, onComment, showFavorite = true, onDelete, onArchive, isArchived }) {
    const isLiked = artwork.isLiked;

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

            {/* Tags */}
            <div style={{ padding: '8px 12px 0', display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {artwork.displayTags && artwork.displayTags.map(tag => (
                    <span key={tag.tagId} style={{
                        fontSize: '11px',
                        backgroundColor: 'var(--primary-color)',
                        color: 'black',
                        padding: '2px 8px',
                        borderRadius: '12px',
                        fontWeight: '600',
                        fontFamily: 'var(--font-family)'
                    }}>
                        {tag.name}
                    </span>
                ))}
            </div>

            {/* Footer */}
            <div style={{ padding: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '2px solid var(--border-color)' }}>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <button
                        onClick={() => onLike(artwork.artworkId)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', color: 'var(--text-color)', fontFamily: 'var(--font-family)' }}
                        title="Like"
                        className="icon-button"
                    >
                        <span className={`icon-hexagon ${isLiked ? 'active' : ''}`}>
                            <Hexagon size={20} color={isLiked ? "var(--primary-color)" : "currentColor"} fill={isLiked ? "var(--primary-color)" : "none"} />
                        </span>
                        {artwork.likeCount || 0}
                    </button>
                    <button
                        onClick={() => onComment && onComment(artwork.artworkId)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', color: 'var(--text-color)', fontFamily: 'var(--font-family)' }}
                        title="Comment"
                        className="icon-button"
                    >
                        <span className="icon-hexagon"><MessageCircle size={20} /></span> 0
                    </button>
                    <button
                        style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', color: 'var(--text-color)', fontFamily: 'var(--font-family)' }}
                        title="Share"
                        className="icon-button"
                    >
                        <span className="icon-hexagon"><Share2 size={20} /></span>
                    </button>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                    {showFavorite && (
                        <button
                            onClick={() => onFavorite && onFavorite(artwork.artworkId)}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--primary-color)' }}
                            title="Favorite"
                            className="icon-button"
                        >
                            <span className={`icon-hexagon ${isFavorited ? 'active' : ''}`}>
                                <Star size={20} fill={isFavorited ? "currentColor" : "none"} />
                            </span>
                        </button>
                    )}
                    {onArchive && (
                        <button
                            onClick={() => onArchive(artwork.artworkId)}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-color)' }}
                            title={isArchived ? "Unarchive" : "Archive"}
                            className="icon-button"
                        >
                            <span className={`icon-hexagon ${isArchived ? 'active' : ''}`}>
                                <Archive size={20} />
                            </span>
                        </button>
                    )}
                    {onDelete && (
                        <button
                            onClick={() => onDelete(artwork.artworkId)}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--danger-color)' }}
                            title="Delete"
                            className="icon-button"
                        >
                            <span className="icon-hexagon"><Trash2 size={20} /></span>
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ArtworkCard;
