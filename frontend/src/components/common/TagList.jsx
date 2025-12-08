import React from 'react';
import '../../styles/TagSelector.css'; // Reuse existing styles

/**
 * Reusable component to display a list of tags.
 * 
 * @param {Object} props
 * @param {Array} props.tags - Array of tag objects or strings
 * @param {Function} props.getLabel - Optional function to extract label from tag (default: attempts .name or checks string)
 * @param {Function} props.onRemove - Optional callback to remove a tag. If provided, X button appears.
 * @param {Function} props.onTagClick - Optional callback when a tag chip is clicked (e.g. for filtering)
 * @param {Boolean} props.readOnly - Hides remove buttons even if onRemove is passed (useful logic override)
 */
const TagList = ({
    tags = [],
    getLabel,
    onRemove,
    onTagClick,
    readOnly = false,
    className = ""
}) => {
    if (!tags || tags.length === 0) return null;

    const resolveLabel = (tag) => {
        if (getLabel) return getLabel(tag);
        if (typeof tag === 'string') return tag;
        return tag.name || 'Unknown Tag';
    };

    return (
        <div className={`selected-tags-list ${className}`}>
            {tags.map((tag, index) => {
                const label = resolveLabel(tag);
                // Use tagId if available for key, else index
                const key = tag.tagId || label || index;

                return (
                    <span
                        key={key}
                        className={`tag-chip ${onTagClick ? 'clickable' : ''}`}
                        onClick={(e) => {
                            if (onTagClick) {
                                e.stopPropagation();
                                onTagClick(tag);
                            }
                        }}
                        style={onTagClick ? { cursor: 'pointer' } : {}}
                    >
                        {label}
                        {!readOnly && onRemove && (
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onRemove(tag);
                                }}
                                className="remove-tag-btn"
                                aria-label={`Remove tag ${label}`}
                            >
                                ×
                            </button>
                        )}
                    </span>
                );
            })}
        </div>
    );
};

export default TagList;
