import React, { useState, useEffect } from 'react';
import ArtworkCard from '../artworks/ArtworkCard';
import { likeArtwork, favoriteArtwork, getFavoriteArtworks } from '../../api/artworkApi';

function ArtistArtworks({ artworks, onNavigate }) {
    const [localArtworks, setLocalArtworks] = useState(artworks);
    const [favorites, setFavorites] = useState(new Set());

    useEffect(() => {
        setLocalArtworks(artworks);
        fetchFavorites();
    }, [artworks]);

    const fetchFavorites = async () => {
        const user = JSON.parse(localStorage.getItem('currentArtist'));
        if (user) {
            try {
                const favs = await getFavoriteArtworks(user.artistId);
                setFavorites(new Set(favs.map(f => f.artworkId)));
            } catch (error) {
                console.error("Failed to fetch favorites", error);
            }
        }
    };

    const handleLike = async (artworkId) => {
        const user = JSON.parse(localStorage.getItem('currentArtist'));
        if (!user) {
            alert("Please login to like");
            return;
        }
        try {
            const updatedArtwork = await likeArtwork(artworkId, user.artistId);
            setLocalArtworks(prev => prev.map(a => a.artworkId === artworkId ? { ...a, likeCount: updatedArtwork.likeCount } : a));
        } catch (error) {
            console.error("Failed to like artwork", error);
        }
    };

    const handleFavorite = async (artworkId) => {
        const user = JSON.parse(localStorage.getItem('currentArtist'));
        if (!user) {
            alert("Please login to favorite");
            return;
        }
        try {
            await favoriteArtwork(artworkId, user.artistId);
            setFavorites(prev => {
                const newFavs = new Set(prev);
                if (newFavs.has(artworkId)) {
                    newFavs.delete(artworkId);
                } else {
                    newFavs.add(artworkId);
                }
                return newFavs;
            });
        } catch (error) {
            console.error("Failed to favorite artwork", error);
        }
    };

    // Sort artworks by most recent first
    const sortedArtworks = [...localArtworks].sort((a, b) => b.artworkId - a.artworkId);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3 style={{ color: '#FFB800', margin: '0 0 8px 0', fontSize: '18px', fontWeight: '600' }}>
                Artworks
            </h3>
            {sortedArtworks.length > 0 ? (
                <div style={{ columnCount: 3, columnGap: '20px' }}>
                    {sortedArtworks.map((artwork) => (
                        <ArtworkCard
                            key={artwork.artworkId}
                            artwork={artwork}
                            onLike={handleLike}
                            onFavorite={handleFavorite}
                            isFavorited={favorites.has(artwork.artworkId)}
                            showFavorite={true}
                            onComment={() => console.log("Comment", artwork.artworkId)}
                        />
                    ))
                    }
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
