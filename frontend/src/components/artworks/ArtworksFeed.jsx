import React, { useState, useEffect } from 'react';
import { usePopup } from '../../context/PopupContext';
import { getAllArtworks, likeArtwork, favoriteArtwork, getFavoriteArtworks } from '../../api/artworkApi';
import { getAllUserArtworks } from '../../api/userArtworkApi';
import { getAllArtists } from '../../api/artistApi';
import ArtworkCard from './ArtworkCard';
import { ArrowUpDown } from 'lucide-react';
import '../../styles/ArtworksFeed.css';

function ArtworksFeed({ onNavigate }) {
    const { showAlert } = usePopup();
    const [artworks, setArtworks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sortOrder, setSortOrder] = useState('newest');
    const [favorites, setFavorites] = useState(new Set()); // Store favorited artwork IDs

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const user = JSON.parse(localStorage.getItem('currentArtist'));
            const requests = [
                getAllArtworks(),
                getAllUserArtworks(),
                getAllArtists()
            ];

            if (user) {
                requests.push(getFavoriteArtworks(user.artistId));
            }

            const results = await Promise.all(requests);
            const artworksData = results[0];
            const userArtworksData = results[1];
            const artistsData = results[2];
            const favoritesData = user ? results[3] : [];

            // Map artists by ID
            const artistsMap = {};
            artistsData.forEach(artist => {
                artistsMap[artist.artistId] = artist;
            });

            // Map artworkId to userId
            const artworkUserMap = {};
            userArtworksData.forEach(link => {
                artworkUserMap[link.id.artworkId] = link.id.artistId;
            });

            // Set favorites
            const favSet = new Set(favoritesData.map(f => f.artworkId));
            setFavorites(favSet);

            // Combine data
            const enrichedArtworks = artworksData.map(artwork => {
                const artistId = artworkUserMap[artwork.artworkId];
                const artist = artistsMap[artistId];
                return {
                    ...artwork,
                    artist: artist || { name: 'Unknown Artist', profileImage: null }
                };
            });

            setArtworks(enrichedArtworks);
        } catch (error) {
            console.error("Failed to fetch artworks feed", error);
        } finally {
            setLoading(false);
        }
    };

    // Sort
    const sortedArtworks = [...artworks].sort((a, b) => {
        const dateA = new Date(a.creationDate || 0).getTime();
        const dateB = new Date(b.creationDate || 0).getTime();
        if (sortOrder === 'newest') return dateB - dateA;
        return dateA - dateB;
    });

    const handleLike = async (artworkId) => {
        const user = JSON.parse(localStorage.getItem('currentArtist'));
        if (!user) {
            showAlert("Login Required", "Please login to like");
            return;
        }
        try {
            const updatedArtwork = await likeArtwork(artworkId, user.artistId);
            setArtworks(prev => prev.map(a => a.artworkId === artworkId ? { ...a, likeCount: updatedArtwork.likeCount, isLiked: updatedArtwork.isLiked } : a));
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

    if (loading) return <div className="loading-text" style={{ color: 'var(--primary-color)', textAlign: 'center', marginTop: '20px' }}>Loading artworks...</div>;

    return (
        <div className="artworks-feed-container">
            <div className="feed-header">
                <div className="feed-title-group">
                    <h2 className="feed-title" style={{ fontFamily: 'var(--font-family)', color: 'var(--primary-color)', letterSpacing: 'var(--letter-spacing-wide)' }}>Community Artworks</h2>
                    <div className="sort-controls" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary-color)' }}>
                        <ArrowUpDown className="icon-hexagon" size={16} />
                        <span>Sort by:</span>
                        <select
                            value={sortOrder}
                            onChange={(e) => setSortOrder(e.target.value)}
                            className="input-hexagon"
                            style={{
                                padding: '4px 8px',
                                width: 'auto',
                                backgroundColor: 'transparent',
                                color: 'var(--primary-color)',
                                border: 'none',
                                cursor: 'pointer',
                                fontWeight: '600',
                                clipPath: 'none'
                            }}
                        >
                            <option value="newest" style={{ color: 'black' }}>Newest First</option>
                            <option value="oldest" style={{ color: 'black' }}>Oldest First</option>
                        </select>
                    </div>
                </div>

                <button
                    onClick={() => onNavigate('upload-artwork')}
                    className="button-hexagon"
                >
                    + Upload Artwork
                </button>
            </div>

            <div className="artworks-masonry">
                {sortedArtworks.length > 0 ? (
                    sortedArtworks.map((artwork) => (
                        <ArtworkCard
                            key={artwork.artworkId}
                            artwork={artwork}
                            onLike={handleLike}
                            onFavorite={handleFavorite}
                            isFavorited={favorites.has(artwork.artworkId)}
                            onComment={() => console.log("Comment clicked for", artwork.artworkId)}
                        />
                    ))
                ) : (
                    <div className="no-artworks" style={{ color: 'var(--secondary-text-color)', textAlign: 'center', padding: '20px' }}>
                        No artworks found.
                    </div>
                )}
            </div>
        </div>
    );
}

export default ArtworksFeed;
