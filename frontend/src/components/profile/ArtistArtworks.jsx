import React, { useState, useEffect } from 'react';
import { usePopup } from '../../context/PopupContext';
import ArtworkCard from '../artworks/ArtworkCard';
import { likeArtwork, favoriteArtwork, getFavoriteArtworks, deleteArtwork } from '../../api/artworkApi';
import { Image } from 'lucide-react';
import '../../styles/ArtistArtworks.css';

import FilterSort from '../common/FilterSort';

function ArtistArtworks({ artworks, onNavigate, isOwner, onArchive, isArchivedView }) {
    const { showAlert, showConfirm } = usePopup();
    const [localArtworks, setLocalArtworks] = useState(artworks);
    const [favorites, setFavorites] = useState(new Set());
    const [sortOrder, setSortOrder] = useState('newest');

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
            showAlert("Login Required", "Please login to like");
            return;
        }
        try {
            const updatedArtwork = await likeArtwork(artworkId, user.artistId);
            setLocalArtworks(prev => prev.map(a => a.artworkId === artworkId ? { ...a, likeCount: updatedArtwork.likeCount, isLiked: updatedArtwork.isLiked } : a));
        } catch (error) {
            console.error("Failed to like artwork", error);
        }
    };

    const handleFavorite = async (artworkId) => {
        const user = JSON.parse(localStorage.getItem('currentArtist'));
        if (!user) {
            showAlert("Login Required", "Please login to favorite");
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

    const handleDelete = (artworkId) => {
        showConfirm(
            "Delete Artwork",
            "Are you sure you want to delete this artwork?",
            async () => {
                try {
                    const user = JSON.parse(localStorage.getItem('currentArtist'));
                    if (!user) return;
                    await deleteArtwork(artworkId, user.artistId);
                    setLocalArtworks(prev => prev.filter(a => a.artworkId !== artworkId));
                } catch (error) {
                    console.error("Failed to delete artwork", error);
                    showAlert("Error", "Failed to delete artwork");
                }
            }
        );
    };

    // Sort artworks
    const sortedArtworks = [...localArtworks].sort((a, b) => {
        if (sortOrder === 'newest') {
            return b.artworkId - a.artworkId; // Assuming ID correlates with time, or stick to ID for now if date missing
        } else if (sortOrder === 'oldest') {
            return a.artworkId - b.artworkId;
        } else if (sortOrder === 'most_liked') {
            return (b.likeCount || 0) - (a.likeCount || 0);
        }
        return 0;
    });

    return (
        <div className="artist-artworks-container">
            <div className="artist-artworks-header">
                <FilterSort
                    type="artwork"
                    sortOptions={[
                        { label: 'Newest First', value: 'newest' },
                        { label: 'Oldest First', value: 'oldest' },
                        { label: 'Most Liked', value: 'most_liked' }
                    ]}
                    activeSort={sortOrder}
                    onSortChange={setSortOrder}
                    onClear={() => setSortOrder('newest')}
                    showFilter={false}
                />

                {isOwner && !isArchivedView && (
                    <button
                        onClick={() => onNavigate && onNavigate('upload-artwork')}
                        className="button-hexagon upload-artwork-btn"
                    >
                        + Upload Artwork
                    </button>
                )}
            </div>

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
                            onArchive={onArchive}
                            isArchived={isArchivedView}
                        />
                    ))
                    }
                </div>
            ) : (
                <div className="empty-state-card" style={{ textAlign: 'center', padding: '40px', color: 'var(--secondary-text-color)' }}>
                    <span className="empty-icon"><Image size={48} color="var(--primary-color)" /></span>
                    <h3 className="empty-title" style={{ color: 'var(--primary-color)', fontFamily: 'var(--font-family)' }}>
                        No artworks yet
                    </h3>
                    <p className="empty-text" style={{ fontFamily: 'var(--font-family)' }}>
                        Start sharing your creative work with the Hiveminds community!
                    </p>
                    <button
                        onClick={() => onNavigate && onNavigate('upload-artwork')}
                        className="button-hexagon"
                        style={{ marginTop: '20px' }}
                    >
                        Upload your first Artwork
                    </button>
                </div>
            )}
        </div>
    );
}

export default ArtistArtworks;
