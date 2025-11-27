import React from 'react';

function ArtistArtworks({ artworks, onNavigate }) {
    // Sort artworks by most recent first (assuming artworkId is auto-increment)
    const sortedArtworks = [...artworks].sort((a, b) => b.artworkId - a.artworkId);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3 style={{ color: '#FFB800', margin: '0 0 8px 0', fontSize: '18px', fontWeight: '600' }}>
                Artworks
            </h3>
            {sortedArtworks.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {sortedArtworks.map((artwork) => (
                        <div
                            key={artwork.artworkId}
                            style={{
                                backgroundColor: 'white',
                                borderRadius: '8px',
                                padding: '16px',
                                border: '1px solid #eee'
                            }}
                        >
                            {/* Artwork Image */}
                            {artwork.image && (
                                <div style={{
                                    width: '100%',
                                    aspectRatio: '16/9',
                                    borderRadius: '8px',
                                    overflow: 'hidden',
                                    marginBottom: '12px',
                                    backgroundColor: '#f5f5f5'
                                }}>
                                    <img
                                        src={artwork.image}
                                        alt={artwork.title}
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover'
                                        }}
                                    />
                                </div>
                            )}

                            {/* Title and Visibility */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                <h4 style={{ margin: 0, fontSize: '16px', fontWeight: '600', color: '#000' }}>
                                    {artwork.title}
                                </h4>
                                <span style={{
                                    fontSize: '12px',
                                    padding: '4px 8px',
                                    borderRadius: '4px',
                                    backgroundColor: artwork.visibility === 'public' ? '#e8f5e9' : '#fff3e0',
                                    color: artwork.visibility === 'public' ? '#2e7d32' : '#e65100',
                                    fontWeight: '600'
                                }}>
                                    {artwork.visibility || 'public'}
                                </span>
                            </div>

                            {/* Description */}
                            {artwork.description && (
                                <p style={{ margin: 0, fontSize: '14px', color: '#666', lineHeight: '1.5' }}>
                                    {artwork.description}
                                </p>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <div style={{
                    borderRadius: '12px',
                    backgroundImage: 'linear-gradient(rgba(100,100,100,0.7), rgba(100,100,100,0.7)), url("https://images.unsplash.com/photo-1536924940846-227afb31e2a5?w=600")',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    padding: '32px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    textAlign: 'center',
                    minHeight: '250px'
                }}>
                    <span style={{ fontSize: '48px', marginBottom: '16px' }}>🖼️</span>
                    <h3 style={{ color: '#FFB800', fontSize: '24px', marginBottom: '12px', margin: '0 0 12px 0' }}>
                        No artworks yet
                    </h3>
                    <p style={{ color: 'white', fontSize: '14px', marginBottom: '20px', margin: '0 0 20px 0' }}>
                        Start sharing your creative work with the Hiveminds community!
                    </p>
                    <button
                        onClick={() => onNavigate && onNavigate('upload-artwork')}
                        style={{
                            backgroundColor: '#FFB800',
                            color: 'black',
                            border: 'none',
                            borderRadius: '8px',
                            padding: '12px 28px',
                            fontSize: '14px',
                            fontWeight: '600',
                            cursor: 'pointer'
                        }}
                    >
                        Upload your first Artwork
                    </button>
                </div>
            )}
        </div>
    );
}

export default ArtistArtworks;
