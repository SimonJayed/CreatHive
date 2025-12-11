import React from 'react';
import '../../styles/RelatedItems.css';

const RelatedItems = ({ items, type, onNavigate }) => {
    if (!items || items.length === 0) {
        return (
            <div className="related-items-container empty-state">
                <h3 className="related-items-title">You might also like</h3>
                <p style={{ opacity: 0.6, fontSize: '14px' }}>No related items found.</p>
            </div>
        );
    }

    return (
        <div className="related-items-container">
            <h3 className="related-items-title">
                You might also like
            </h3>
            <div className="related-items-list">
                {items.map(item => (
                    <a
                        key={item.id}
                        href={`/${type === 'artwork' ? 'artwork' : 'blog'}/${item.id}`}
                        className="related-item-card"
                        onClick={(e) => {
                            e.preventDefault();
                            onNavigate(type, item.id);
                            window.scrollTo(0, 0);
                        }}
                    >
                        {/* Only show image if it exists AND type is NOT blog */}
                        {item.image && type !== 'blog' && (
                            <img src={item.image} alt={item.title} className="related-item-image" />
                        )}
                        <div className="related-item-info">
                            <h4 className="related-item-title">{item.title}</h4>
                            <span className="related-item-author">
                                by {item.authorName}
                            </span>
                        </div>
                    </a>
                ))}
            </div>
        </div>
    );
};

export default RelatedItems;
