import React, { useState, useEffect } from 'react';
import { getAllTags, insertTag } from '../../api/tagApi';
import '../../styles/TagSelector.css';
import TagList from './TagList';

/**
 * Reusable Tag Selector Component
 * 
 * @param {Object} props
 * @param {Array} props.selectedTags - Array of currently selected tag names (strings)
 * @param {Function} props.onTagSelect - Callback when tags change (returns new array of strings)
 * @param {Boolean} props.allowCreation - Whether to allow creating new tags inline
 * @param {Boolean} props.readOnly - If true, interactions are disabled
 */
function TagSelector({ selectedTags = [], onTagSelect, allowCreation = true, readOnly = false }) {
    const [availableTags, setAvailableTags] = useState([]);
    const [newTagInput, setNewTagInput] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadTags();
    }, []);

    const loadTags = async () => {
        try {
            const tags = await getAllTags();
            setAvailableTags(tags || []);
        } catch (error) {
            console.error("Failed to load tags for selector", error);
        }
    };

    const handleSelectChange = (e) => {
        const tagName = e.target.value;
        if (tagName && !selectedTags.includes(tagName)) {
            onTagSelect([...selectedTags, tagName]);
        }
        e.target.value = ""; // Reset select
    };

    const handleAddCustomTag = async () => {
        if (!allowCreation || !newTagInput.trim()) return;

        const tagName = newTagInput.trim();

        // Optimistic update if it doesn't exist in selection
        if (!selectedTags.includes(tagName)) {
            onTagSelect([...selectedTags, tagName]);
            setNewTagInput('');
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAddCustomTag();
        }
    };

    const removeTag = (tagToRemove) => {
        if (readOnly) return;
        onTagSelect(selectedTags.filter(tag => tag !== tagToRemove));
    };

    return (
        <div className="tag-selector-container">
            {!readOnly && (
                <div className="tag-controls">
                    <div className="tag-select-wrapper">
                        <select
                            className="tag-select"
                            onChange={handleSelectChange}
                            disabled={loading}
                        >
                            <option value="">Select existing tag...</option>
                            {availableTags.map(tag => (
                                <option
                                    key={tag.tagId}
                                    value={tag.name}
                                    disabled={selectedTags.includes(tag.name)}
                                >
                                    {tag.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {allowCreation && (
                        <div className="new-tag-wrapper" style={{ marginTop: '10px' }}>
                            <input
                                type="text"
                                value={newTagInput}
                                onChange={(e) => setNewTagInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Or create new..."
                                className="new-tag-input"
                            />
                            <button
                                type="button"
                                onClick={handleAddCustomTag}
                                className="add-tag-btn"
                                disabled={!newTagInput.trim()}
                            >
                                Add
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* Reused TagList Component */}
            <TagList
                tags={selectedTags}
                onRemove={removeTag}
                readOnly={readOnly}
                getLabel={(tag) => tag} // selectedTags are strings here
            />

            {!readOnly && (
                <p className="tag-selector-helper-text">
                    Select relevant tags to help others discover your post.
                </p>
            )}
        </div>
    );
}

export default TagSelector;
