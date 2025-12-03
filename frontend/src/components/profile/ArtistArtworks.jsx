import React, { useState, useEffect } from 'react';
import ArtworkCard from '../artworks/ArtworkCard';
import { likeArtwork, favoriteArtwork, getFavoriteArtworks, deleteArtwork } from '../../api/artworkApi';
import '../../styles/ArtistArtworks.css';

function ArtistArtworks({ artworks, onNavigate, isOwner }) {
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

    const handleDelete = async (artworkId) => {
        if (!window.confirm("Are you sure you want to delete this artwork?")) return;
        try {
            await deleteArtwork(artworkId);
            setLocalArtworks(prev => prev.filter(a => a.artworkId !== artworkId));
        } catch (error) {
            console.error("Failed to delete artwork", error);
            alert("Failed to delete artwork");
        }
    };

    // Sort artworks by most recent first
    const sortedArtworks = [...localArtworks].sort((a, b) => b.artworkId - a.artworkId);

    return (
        <div className="artist-artworks-container">
            <h3 className="section-title">
                Artworks
            </h3>
            {sortedArtworks.length > 0 ? (
                <div className="artworks-masonry">
                    {sortedArtworks.map((artwork) => (
                        <ArtworkCard
                            key={artwork.artworkId}
                            artwork={artwork}
                            onLike={handleLike}
                            onFavorite={handleFavorite}
                            isFavorited={favorites.has(artwork.artworkId)}
                            showFavorite={true}
                            onComment={() => console.log("Comment", artwork.artworkId)}
                            onDelete={isOwner ? handleDelete : null}
                        />
                    ))
                    }
                </div>
            ) : (
                <div className="empty-state-card">
                    <span className="empty-icon">🖼️</span>
                    <h3 className="empty-title">
                        No artworks yet
                    </h3>
                    <p className="empty-text">
                        Start sharing your creative work with the Hiveminds community!
                    </p>
                    <button
                        onClick={() => onNavigate && onNavigate('upload-artwork')}
                        className="upload-btn"
                    >
                        Upload your first Artwork
                    </button>
                </div>
            )}
        </div>
    );
}

export default ArtistArtworks;
