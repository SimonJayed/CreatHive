import React from 'react';

function ArtistBlogs({ blogs, onNavigate }) {
    // Sort blogs by most recent first (assuming blogId is auto-increment)
    const sortedBlogs = [...blogs].sort((a, b) => b.blogId - a.blogId);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3 style={{ color: '#FFB800', margin: '0 0 8px 0', fontSize: '18px', fontWeight: '600' }}>
                Blogs
            </h3>
            {sortedBlogs.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {sortedBlogs.map((blog) => (
                        <div
                            key={blog.blogId}
                            style={{
                                backgroundColor: 'white',
                                borderRadius: '8px',
                                padding: '16px',
                                border: '1px solid #eee'
                            }}
                        >
                            {/* Title */}
                            <div style={{ marginBottom: '8px' }}>
                                <h4 style={{ margin: 0, fontSize: '16px', fontWeight: '600', color: '#000' }}>
                                    {blog.title}
                                </h4>
                            </div>

                            {/* Content Preview */}
                            <p style={{ margin: 0, fontSize: '14px', color: '#666', lineHeight: '1.5' }}>
                                {blog.content && blog.content.length > 150
                                    ? `${blog.content.substring(0, 150)}...`
                                    : blog.content}
                            </p>

                            {/* Date Posted */}
                            {blog.date_posted && (
                                <p style={{ margin: '8px 0 0 0', fontSize: '12px', color: '#999' }}>
                                    Posted: {new Date(blog.date_posted).toLocaleDateString()}
                                </p>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <div style={{
                    borderRadius: '12px',
                    backgroundImage: 'linear-gradient(rgba(139,90,43,0.7), rgba(139,90,43,0.7)), url("https://images.unsplash.com/photo-1501706362039-c06b2d715385?w=600")',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    padding: '32px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    textAlign: 'center',
                    minHeight: '250px'
                }}>
                    <span style={{ fontSize: '48px', marginBottom: '16px' }}>📝</span>
                    <h3 style={{ color: '#FFB800', fontSize: '24px', marginBottom: '12px', margin: '0 0 12px 0' }}>
                        No blogs yet
                    </h3>
                    <p style={{ color: 'white', fontSize: '14px', marginBottom: '20px', margin: '0 0 20px 0' }}>
                        Share your imagination and inspire the Hiveminds community!
                    </p>
                    <button
                        onClick={() => onNavigate && onNavigate('upload-blog')}
                        style={{
                            backgroundColor: '#FFB800',
                            color: 'black',
                            border: 'none',
                            borderRadius: '8px',
                            padding: '12px 28px',
                            fontSize: '14px',
                            fontWeight: '600',
                            cursor: 'pointer'
                        }}
                    >
                        Upload your blog
                    </button>
                </div>
            )}
        </div>
    );
}

export default ArtistBlogs;
