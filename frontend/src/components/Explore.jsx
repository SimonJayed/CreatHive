import React, { useState, useEffect } from 'react';
import { getAllTags, likeTag, unlikeTag } from '../api/tagApi';
import { getAllArtworks, getArtworksByTagId, likeArtwork, favoriteArtwork, getFavoriteArtworks } from '../api/artworkApi';
import { getAllUserArtworks } from '../api/userArtworkApi';
import { getAllArtists } from '../api/artistApi';
import ArtworkCard from './artworks/ArtworkCard';
import FilterSort from './common/FilterSort';
import { Hexagon, Search } from 'lucide-react';
import { usePopup } from '../context/PopupContext';
import '../styles/Explore.css';

function Explore({ currentUser, onNavigate }) {
    const { showAlert } = usePopup();
    const [activeTab, setActiveTab] = useState('artworks'); // Default to Artworks as per user request flow
    // Independent Search States
    const [tagSearchQuery, setTagSearchQuery] = useState('');
    const [artworkSearchQuery, setArtworkSearchQuery] = useState('');

    const [tags, setTags] = useState([]);
    const [artworks, setArtworks] = useState([]);
    const [selectedTag, setSelectedTag] = useState(null);
    const [loading, setLoading] = useState(true);
    const [favorites, setFavorites] = useState(new Set());

    // Filter/Sort State
    const [sortOrder, setSortOrder] = useState('newest');
    const [activeFilters, setActiveFilters] = useState([]); // Array of tagIds

    const sortOptions = [
        { label: 'Newest First', value: 'newest' },
        { label: 'Oldest First', value: 'oldest' },
        { label: 'Most Liked', value: 'most_liked' }
    ];

    useEffect(() => {
        loadTags(currentUser?.artistId || 0);
        loadArtworks();
    }, [currentUser]);

    // Handle Tag Click for Filter
    useEffect(() => {
        if (selectedTag) {
            setActiveTab('artworks');
            setActiveFilters([selectedTag.tagId]);
            // Clear artwork search when coming from a tag to see results clearly
            setArtworkSearchQuery('');
        }
    }, [selectedTag]);

    const loadTags = async (userId) => {
        try {
            const data = await getAllTags(userId);
            setTags(data);

            // Check for tag in URL
            const params = new URLSearchParams(window.location.search);
            const tagId = params.get('tag');
            if (tagId) {
                const tag = data.find(t => t.tagId === parseInt(tagId));
                if (tag) {
                    setSelectedTag(tag);
                }
            }
        } catch (error) {
            console.error("Failed to load tags", error);
        }
    };

    const loadArtworks = async () => {
        setLoading(true);
        try {
            const user = currentUser || JSON.parse(localStorage.getItem('currentArtist'));
            const requests = [
                getAllArtworks(user ? user.artistId : 0),
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
            const favoritesData = user && results.length > 3 ? results[3] : [];

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

            const favSet = new Set(favoritesData.map(f => f.artworkId));
            setFavorites(favSet);

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
            console.error("Failed to load artworks", error);
        } finally {
            setLoading(false);
        }
    };

    const handleLikeTag = async (e, tag) => {
        e.stopPropagation();
        if (!currentUser) {
            showAlert("Login Required", "Please login to like tags.");
            return;
        }

        try {
            if (tag.liked) {
                await unlikeTag(tag.tagId, currentUser.artistId);
            } else {
                await likeTag(tag.tagId, currentUser.artistId);
            }
            loadTags(currentUser.artistId);
        } catch (error) {
            console.error("Failed to toggle tag like", error);
        }
    };

    const handleLikeArtwork = async (artworkId) => {
        if (!currentUser) {
            showAlert("Login Required", "Please login to like artworks.");
            return;
        }

        try {
            const updatedArtwork = await likeArtwork(artworkId, currentUser.artistId);
            setArtworks(prev => prev.map(a => a.artworkId === artworkId ? { ...a, likeCount: updatedArtwork.likeCount, isLiked: updatedArtwork.isLiked } : a));
        } catch (error) {
            console.error("Failed to toggle artwork like", error);
        }
    };

    const handleFavorite = async (artworkId) => {
        if (!currentUser) {
            showAlert("Login Required", "Please login to favorite.");
            return;
        }
        try {
            await favoriteArtwork(artworkId, currentUser.artistId);
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
            console.error("Failed to favorite", error);
        }
    }


    const filteredArtworks = artworks.filter(artwork => {
        // 1. Search Query (Artwork Tab Specific)
        if (artworkSearchQuery) {
            const query = artworkSearchQuery.toLowerCase();
            const matchesSearch = (
                artwork.title?.toLowerCase().includes(query) ||
                artwork.description?.toLowerCase().includes(query) ||
                (artwork.artist?.name && artwork.artist.name.toLowerCase().includes(query)) ||
                (artwork.displayTags && artwork.displayTags.some(tag => tag.name.toLowerCase().includes(query)))
            );
            if (!matchesSearch) return false;
        }

        // 2. Tag Filter (Multi-select) - AND Logic
        if (activeFilters.length > 0) {
            if (!artwork.displayTags || artwork.displayTags.length === 0) return false;
            const artworkTagIds = artwork.displayTags.map(t => t.tagId);
            const hasAllTags = activeFilters.every(filterId => artworkTagIds.includes(filterId));
            if (!hasAllTags) return false;
        }

        return true;
    }).sort((a, b) => {
        if (sortOrder === 'newest') {
            return new Date(b.creationDate || 0) - new Date(a.creationDate || 0);
        } else if (sortOrder === 'oldest') {
            return new Date(a.creationDate || 0) - new Date(b.creationDate || 0);
        } else if (sortOrder === 'most_liked') {
            return (b.likeCount || 0) - (a.likeCount || 0);
        }
        return 0;
    });

    const handleClearFilters = () => {
        setSortOrder('newest');
        setActiveFilters([]);
        setSelectedTag(null);
        setArtworkSearchQuery('');
    };

    const filteredTags = tags.filter(tag =>
        tag.name.toLowerCase().includes(tagSearchQuery.toLowerCase())
    );

    return (
        <div className="explore-container">
            {/* Tabs */}
            <div className="explore-tabs">
                <button
                    className={`tab-button ${activeTab === 'artworks' ? 'active' : ''}`}
                    onClick={() => setActiveTab('artworks')}
                >
                    Artworks
                </button>
                <button
                    className={`tab-button ${activeTab === 'tags' ? 'active' : ''}`}
                    onClick={() => setActiveTab('tags')}
                >
                    Tags
                </button>
            </div>

            {/* Content */}
            {activeTab === 'tags' && (
                <div className="explore-content fade-in">
                    {/* Tag Search Bar */}
                    <div className="search-bar-container">
                        <div className="search-input-wrapper">
                            <Search className="search-icon-inside" size={20} />
                            <input
                                type="text"
                                value={tagSearchQuery}
                                onChange={(e) => setTagSearchQuery(e.target.value)}
                                placeholder="Search tags..."
                                className="search-input"
                            />
                        </div>
                    </div>

                    <div className="featured-header">
                        <h2 className="featured-title">Explore Tags</h2>
                        <p className="featured-description">
                            Browse categories to find inspiration.
                        </p>
                    </div>

                    <div className="tags-grid">
                        {(tagSearchQuery ? filteredTags : tags).map((tag) => (
                            <div
                                key={tag.tagId}
                                className={`tag-card ${selectedTag?.tagId === tag.tagId ? 'selected' : ''}`}
                                onClick={() => setSelectedTag(tag)}
                                style={{
                                    cursor: 'pointer',
                                    position: 'relative'
                                }}
                            >
                                <img
                                    src={`/images/tags/${tag.name.toLowerCase()}.jpg`}
                                    alt={tag.name}
                                    onError={(e) => {
                                        if (tag.firstArtworkImage && e.target.src !== tag.firstArtworkImage) {
                                            e.target.src = tag.firstArtworkImage;
                                        } else {
                                            e.target.style.display = 'none';
                                        }
                                    }}
                                    style={{
                                        position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 0
                                    }}
                                />
                                <div className="tag-overlay">
                                    <div className="tag-header">
                                        <h3 className="tag-name">{tag.name}</h3>
                                        <button
                                            className="tag-like-btn"
                                            onClick={(e) => handleLikeTag(e, tag)}
                                            style={{
                                                background: 'none', border: 'none', cursor: 'pointer', color: tag.liked ? 'var(--primary-color)' : 'white', display: 'flex', alignItems: 'center', padding: 0
                                            }}
                                        >
                                            <Hexagon size={20} fill={tag.liked ? "currentColor" : "none"} />
                                        </button>
                                    </div>
                                    <p className="tag-stats">{tag.submissionCount} submissions</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {activeTab === 'artworks' && (
                <div className="artworks-section fade-in">
                    {/* Artwork Search Bar + Upload Button */}
                    <div className="search-bar-container" style={{ display: 'flex', gap: '16px', alignItems: 'center', background: 'transparent', padding: 0, boxShadow: 'none' }}>
                        <div className="search-input-wrapper" style={{ flex: 1 }}>
                            <Search className="search-icon-inside" size={20} />
                            <input
                                type="text"
                                value={artworkSearchQuery}
                                onChange={(e) => setArtworkSearchQuery(e.target.value)}
                                placeholder="Search artworks, artists..."
                                className="search-input"
                            />
                        </div>
                        <button
                            onClick={() => onNavigate && onNavigate('upload-artwork')}
                            className="button-hexagon"
                            style={{ whiteSpace: 'nowrap', height: '48px', display: 'flex', alignItems: 'center' }}
                        >
                            + Upload Artwork
                        </button>
                    </div>

                    <div className="artworks-filter-header">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', flexWrap: 'wrap' }}>
                            <FilterSort
                                type="artwork"
                                sortOptions={sortOptions}
                                activeSort={sortOrder}
                                onSortChange={setSortOrder}
                                filterOptions={tags}
                                activeFilters={activeFilters}
                                onFilterChange={setActiveFilters}
                                onClear={handleClearFilters}
                            />

                            {(activeFilters.length > 0 || selectedTag) && (
                                <span style={{ color: 'var(--primary-color)', fontSize: '14px' }}>
                                    Filtering by: <b>
                                        {[...new Set([
                                            selectedTag?.name,
                                            ...activeFilters.map(id => tags.find(t => t.tagId === id)?.name).filter(Boolean)
                                        ].filter(Boolean))].join(', ')}
                                    </b>
                                </span>
                            )}
                        </div>
                    </div>

                    {loading ? (
                        <div className="loading-spinner">Loading...</div>
                    ) : (
                        <>
                            {filteredArtworks.length > 0 ? (
                                <div className="artworks-grid">
                                    {filteredArtworks.map((artwork) => (
                                        <ArtworkCard
                                            key={artwork.artworkId}
                                            artwork={artwork}
                                            onLike={handleLikeArtwork}
                                            onFavorite={handleFavorite}
                                            isFavorited={favorites.has(artwork.artworkId)}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <div className="no-results-container" style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    height: '100%',
                                    width: '100%',
                                    minHeight: '400px', // Ensure it has some height to center within
                                    color: 'var(--secondary-text-color)'
                                }}>
                                    <Hexagon size={48} style={{ marginBottom: '16px', opacity: 0.5, color: 'var(--primary-color)' }} />
                                    <p className="no-artworks-message">No artworks found matching your criteria.</p>
                                </div>
                            )}
                        </>
                    )}
                </div>
            )}
        </div >
    );
}

export default Explore;
