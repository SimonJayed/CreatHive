import React, { useState } from 'react';

function Explore() {
    const [searchQuery, setSearchQuery] = useState('');

    const featuredTags = [
        { name: 'Anime', submissions: 123, image: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=400' },
        { name: 'Realism', submissions: 123, image: 'https://images.unsplash.com/photo-1536924940846-227afb31e2a5?w=400' },
        { name: 'Pop Art', submissions: 123, image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400' }
    ];

    return (
        <div style={{
            height: '100vh',
            padding: '60px 80px',
            backgroundColor: 'black',
            backgroundImage: 'linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url("https://images.unsplash.com/photo-1536924940846-227afb31e2a5?w=1600")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            boxSizing: 'border-box'
        }}>
            {/* Search Bar */}
            <div style={{
                backgroundColor: '#FFB800',
                borderRadius: '50px',
                padding: '12px 24px',
                display: 'flex',
                alignItems: 'center',
                marginBottom: '40px',
                flexShrink: 0
            }}>
                <span style={{ fontSize: '20px', marginRight: '12px' }}>🔍</span>
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search artworks, artists, tags..."
                    style={{
                        flex: 1,
                        backgroundColor: 'transparent',
                        border: 'none',
                        outline: 'none',
                        fontSize: '16px',
                        color: 'black'
                    }}
                />
            </div>

            {/* Featured Tags Section */}
            <div style={{ flex: 1, overflowY: 'auto' }}>
                <div style={{
                    textAlign: 'center',
                    marginBottom: '30px',
                    borderBottom: '2px solid #FFB800',
                    paddingBottom: '20px'
                }}>
                    <h2 style={{ color: '#FFB800', fontSize: '32px', marginBottom: '12px', marginTop: 0 }}>
                        Featured Tags
                    </h2>
                    <p style={{ color: '#FFB800', fontSize: '14px', lineHeight: '1.6', maxWidth: '700px', margin: '0 auto' }}>
                        CreatHive lets student artists showcase their works under different genres and styles, making it easier for the community to discover art that speaks to them. Categories include popular styles such as anime, realistic, abstract, surrealism, minimalist, fantasy, and many more—allowing every artist to find their space and every viewer to explore what inspires them.
                    </p>
                </div>

                {/* Tag Cards */}
                <div style={{
                    display: 'flex',
                    gap: '30px',
                    justifyContent: 'center',
                    flexWrap: 'wrap'
                }}>
                    {featuredTags.map((tag) => (
                        <div key={tag.name} style={{
                            width: '280px',
                            height: '360px',
                            borderRadius: '12px',
                            border: '3px solid #FFB800',
                            overflow: 'hidden',
                            position: 'relative',
                            backgroundImage: `url(${tag.image})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center'
                        }}>
                            <div style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                background: 'linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.7))',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between',
                                padding: '20px'
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <h3 style={{ color: '#FFB800', fontSize: '24px', margin: 0 }}>{tag.name}</h3>
                                    <span style={{ fontSize: '24px' }}>💛</span>
                                </div>

                                <div>
                                    <p style={{ color: 'white', fontSize: '14px', marginBottom: '12px' }}>
                                        {tag.submissions} submissions
                                    </p>
                                    <button style={{
                                        backgroundColor: '#FFB800',
                                        color: 'black',
                                        border: 'none',
                                        borderRadius: '8px',
                                        padding: '10px 24px',
                                        fontSize: '14px',
                                        fontWeight: '600',
                                        cursor: 'pointer'
                                    }}>
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
