import React, { useState } from 'react';
import '../styles/Explore.css';

function Explore() {
    const [searchQuery, setSearchQuery] = useState('');

    const featuredTags = [
        { name: 'Anime', submissions: 123, image: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=400' },
        { name: 'Realism', submissions: 123, image: 'https://images.unsplash.com/photo-1536924940846-227afb31e2a5?w=400' },
        { name: 'Pop Art', submissions: 123, image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400' }
    ];

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
                    <h2 className="featured-title">Featured Tags</h2>
                    <p className="featured-description">
                        CreatHive lets student artists showcase their works under different genres and styles, making it easier for the community to discover art that speaks to them. Categories include popular styles such as anime, realistic, abstract, surrealism, minimalist, fantasy, and many more—allowing every artist to find their space and every viewer to explore what inspires them.
                    </p>
                </div>

                {/* Tag Cards */}
                <div className="tags-grid">
                    {featuredTags.map((tag) => (
                        <div key={tag.name} className="tag-card" style={{ backgroundImage: `url(${tag.image})` }}>
                            <div className="tag-overlay">
                                <div className="tag-header">
                                    <h3 className="tag-name">{tag.name}</h3>
                                    <span className="tag-icon">💛</span>
                                </div>

                                <div>
                                    <p className="tag-stats">
                                        {tag.submissions} submissions
                                    </p>
                                    <button className="btn-create">
                                        Create
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Explore;
