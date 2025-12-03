import React, { useState, useEffect } from 'react';
import { getFavoriteArtworks, likeArtwork, favoriteArtwork } from '../../api/artworkApi';
import ArtworkCard from '../artworks/ArtworkCard';
import '../../styles/FavoriteArtworks.css';

function FavoriteArtworks() {
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchFavorites();
    }, []);

    const fetchFavorites = async () => {
        const user = JSON.parse(localStorage.getItem('currentArtist'));
        if (!user) return;

        try {
            const data = await getFavoriteArtworks(user.artistId);
            setFavorites(data);
        } catch (error) {
            console.error("Failed to fetch favorites", error);
        } finally {
            setLoading(false);
        }
    };

    const handleLike = async (artworkId) => {
        const user = JSON.parse(localStorage.getItem('currentArtist'));
        if (!user) return;

        try {
            const updatedArtwork = await likeArtwork(artworkId, user.artistId);
            setFavorites(prev => prev.map(a => a.artworkId === artworkId ? { ...a, likeCount: updatedArtwork.likeCount } : a));
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

    if (loading) return <div className="loading-text">Loading favorites...</div>;

    return (
        <div className="favorite-artworks-container">
            <h3 className="favorites-title">My Favorites</h3>
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
                        You haven't favorited any artworks yet.
                    </div>
                )}
            </div>
        </div>
    );
}

export default FavoriteArtworks;
