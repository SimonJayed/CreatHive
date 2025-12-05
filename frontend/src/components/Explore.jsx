import React, { useState, useEffect } from 'react';
import { getAllTags, likeTag, unlikeTag } from '../api/tagApi';
import { getAllArtworks, getArtworksByTagId, likeArtwork } from '../api/artworkApi';
import ArtworkCard from './artworks/ArtworkCard';
import FilterSort from './common/FilterSort';
import { Hexagon } from 'lucide-react';
import '../styles/Explore.css';

function Explore({ currentUser }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [tags, setTags] = useState([]);
    const [artworks, setArtworks] = useState([]);
    const [selectedTag, setSelectedTag] = useState(null);
    const [loading, setLoading] = useState(true);

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

    useEffect(() => {
        if (selectedTag) {
            loadArtworksByTag(selectedTag.tagId);
        } else {
            loadArtworks();
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
            const data = await getAllArtworks(currentUser?.artistId || 0);
            setArtworks(data);
        } catch (error) {
            console.error("Failed to load artworks", error);
        } finally {
            setLoading(false);
        }
    };

    const loadArtworksByTag = async (tagId) => {
        setLoading(true);
        try {
            const data = await getArtworksByTagId(tagId, currentUser?.artistId || 0);
            setArtworks(data);
        } catch (error) {
            console.error("Failed to load artworks by tag", error);
        } finally {
            setLoading(false);
        }
    };

    const handleLikeTag = async (e, tag) => {
        e.stopPropagation();
        if (!currentUser) {
            alert("Please login to like tags.");
            return;
        }

        try {
            if (tag.liked) {
                await unlikeTag(tag.tagId, currentUser.artistId);
            } else {
                await likeTag(tag.tagId, currentUser.artistId);
            }
            loadTags(currentUser.artistId); // Refresh to update state
        } catch (error) {
            console.error("Failed to toggle tag like", error);
        }
    };

    const handleLikeArtwork = async (artworkId) => {
        if (!currentUser) {
            alert("Please login to like artworks.");
            return;
        }

        try {
            await likeArtwork(artworkId, currentUser.artistId);
            // Optimistic update or re-fetch
            setArtworks(prevArtworks => prevArtworks.map(art => {
                if (art.artworkId === artworkId) {
                    const wasLiked = art.isLiked;
                    return {
                        ...art,
                        isLiked: !wasLiked,
                        likeCount: wasLiked ? (art.likeCount - 1) : (art.likeCount + 1)
                    };
                }
                return art;
            }));
        } catch (error) {
            console.error("Failed to toggle artwork like", error);
        }
    };

    const filteredArtworks = artworks.filter(artwork => {
        // 1. Search Query
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            const matchesSearch = (
                artwork.title?.toLowerCase().includes(query) ||
                artwork.description?.toLowerCase().includes(query) ||
                (artwork.artist?.name && artwork.artist.name.toLowerCase().includes(query))
            );
            if (!matchesSearch) return false;
        }

        // 2. Tag Filter (Multi-select)
        if (activeFilters.length > 0) {
            // Check if artwork has AT LEAST ONE of the selected tags
            // Or ALL? Usually "OR" for tags, but let's check if artwork has any of the selected tags.
            // If artwork.displayTags is populated:
            if (!artwork.displayTags || artwork.displayTags.length === 0) return false;
            const artworkTagIds = artwork.displayTags.map(t => t.tagId);
            const hasTag = activeFilters.some(filterId => artworkTagIds.includes(filterId));
            if (!hasTag) return false;
        }

        return true;
    }).sort((a, b) => {
        // 3. Sorting
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
        setSearchQuery('');
    };

    const filteredTags = tags.filter(tag =>
        tag.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="explore-container">
            {/* Search Bar */}
            <div className="search-bar-container">
                <span className="search-icon">🔍</span>
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search artworks, artists, tags..."
                    className="search-input"
                />
            </div>

            {/* Featured Tags Section */}
            <div className="explore-content">
                <div className="featured-header">
                    <h2 className="featured-title">Explore Tags</h2>
                    <p className="featured-description">
                        CreatHive lets student artists showcase their works under different genres and styles.
                        Select a tag to filter artworks.
                    </p>
                    {selectedTag && (
                        <button
                            className="clear-filter-btn"
                            onClick={() => setSelectedTag(null)}
                        >
                            Clear Filter ({selectedTag.name})
                        </button>
                    )}
                </div>

                {/* Tag Cloud */}
                <div className="tags-grid">
                    {(searchQuery ? filteredTags : tags).map((tag) => (
                        <div
                            key={tag.tagId}
                            className={`tag-card ${selectedTag?.tagId === tag.tagId ? 'selected' : ''}`}
                            onClick={() => setSelectedTag(tag)}
                            style={{
                                cursor: 'pointer',
                                position: 'relative'
                            }}
                        >
                            {/* Background Image with Fallback */}
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
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                    zIndex: 0
                                }}
                            />
                            <div className="tag-overlay">
                                <div className="tag-header">
                                    <h3 className="tag-name">{tag.name}</h3>
                                    <button
                                        className="tag-like-btn"
                                        onClick={(e) => handleLikeTag(e, tag)}
                                        style={{
                                            background: 'none',
                                            border: 'none',
                                            cursor: 'pointer',
                                            color: tag.liked ? 'var(--primary-color)' : 'white',
                                            display: 'flex',
                                            alignItems: 'center',
                                            padding: 0
                                        }}
                                    >
                                        <Hexagon size={20} fill={tag.liked ? "currentColor" : "none"} />
                                    </button>
                                </div>
                                <p className="tag-stats">
                                    {tag.submissionCount} submissions
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Artworks Grid */}
                <div className="artworks-section">
                    <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <h3 className="section-title" style={{ margin: 0 }}>
                            {selectedTag ? `${selectedTag.name} Artworks` : 'All Artworks'}
                        </h3>
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
                    </div>
                    {loading ? (
                        <div className="loading-spinner">Loading...</div>
                    ) : (
                        <div className="artworks-grid">
                            {filteredArtworks.length > 0 ? (
                                filteredArtworks.map((artwork) => (
                                    <ArtworkCard
                                        key={artwork.artworkId}
                                        artwork={artwork}
                                        onLike={handleLikeArtwork}
                                    />
                                ))
                            ) : (
                                <p className="no-artworks-message">No artworks found.</p>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Explore;
