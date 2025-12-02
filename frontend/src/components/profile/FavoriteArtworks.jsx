import React, { useState, useEffect } from 'react';
import { getFavoriteArtworks, likeArtwork, favoriteArtwork } from '../../api/artworkApi';
import ArtworkCard from '../artworks/ArtworkCard';

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

    if (loading) return <div style={{ color: 'white', textAlign: 'center', padding: '20px' }}>Loading favorites...</div>;

    return (
        <div style={{ padding: '20px' }}>
            <h3 style={{ color: '#FFB800', margin: '0 0 20px 0', fontSize: '24px' }}>My Favorites</h3>
            <div className="artworks-masonry" style={{ columnCount: 3, columnGap: '20px' }}>
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
                    <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
                        You haven't favorited any artworks yet.
                    </div>
                )}
            </div>
        </div>
    );
}

export default FavoriteArtworks;
