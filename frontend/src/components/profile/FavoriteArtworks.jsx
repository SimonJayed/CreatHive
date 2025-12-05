import React, { useState, useEffect } from 'react';
import { likeArtwork, favoriteArtwork } from '../../api/artworkApi';
import ArtworkCard from '../artworks/ArtworkCard';
import '../../styles/FavoriteArtworks.css';

function FavoriteArtworks({ favorites: initialFavorites }) {
    const [favorites, setFavorites] = useState(initialFavorites || []);

    useEffect(() => {
        setFavorites(initialFavorites || []);
    }, [initialFavorites]);

    // Removed internal fetch logic since data is passed via props

    const handleLike = async (artworkId) => {
        const user = JSON.parse(localStorage.getItem('currentArtist'));
        if (!user) return;

        try {
            const updatedArtwork = await likeArtwork(artworkId, user.artistId);
            setFavorites(prev => prev.map(a => a.artworkId === artworkId ? { ...a, likeCount: updatedArtwork.likeCount, isLiked: updatedArtwork.isLiked } : a));
        } catch (error) {
            console.error("Failed to like artwork", error);
        }
    };

    const handleFavorite = async (artworkId) => {
        const user = JSON.parse(localStorage.getItem('currentArtist'));
        if (!user) return;

        try {
            await favoriteArtwork(artworkId, user.artistId);
            // Remove from list if unfavorited
            setFavorites(prev => prev.filter(a => a.artworkId !== artworkId));
        } catch (error) {
            console.error("Failed to toggle favorite", error);
        }
    };

    // Removed loading check since data is passed via props

    return (
        <div className="favorite-artworks-container">

            <div className="artworks-masonry">
                {favorites.length > 0 ? (
                    favorites.map((artwork) => (
                        <ArtworkCard
                            key={artwork.artworkId}
                            artwork={artwork}
                            onLike={handleLike}
                            onFavorite={handleFavorite}
                            isFavorited={true}
                            showFavorite={true}
                            onComment={() => console.log("Comment", artwork.artworkId)}
                        />
                    ))
                ) : (
                    <div className="no-favorites">
                        <p className="no-favorites-text">You haven't favorited any artworks yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default FavoriteArtworks;
