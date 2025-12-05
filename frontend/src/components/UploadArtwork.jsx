import React, { useState, useEffect } from 'react';
import { usePopup } from '../context/PopupContext';
import { insertArtwork } from '../api/artworkApi';
import { getAllTags, insertTag, insertArtworkTag } from '../api/tagApi';
import '../styles/UploadArtwork.css';

function UploadArtwork({ artistData, onNavigate }) {
    const { showAlert } = usePopup();
    const [formData, setFormData] = useState({
        title: '',
        description: ''
    });
    const [imageFile, setImageFile] = useState(null);
    const [tagInput, setTagInput] = useState('');
    const [selectedTags, setSelectedTags] = useState([]);
    const [availableTags, setAvailableTags] = useState([]);

    useEffect(() => {
        loadTags();
    }, []);

    const loadTags = async () => {
        try {
            const tags = await getAllTags();
            setAvailableTags(tags);
        } catch (error) {
            console.error("Failed to load tags", error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
        }
    };

    const handleTagKeyDown = (e) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            addTag(tagInput);
        }
    };

    const addTag = (tagName) => {
        const trimmedTag = tagName.trim();
        if (trimmedTag && !selectedTags.includes(trimmedTag)) {
            setSelectedTags([...selectedTags, trimmedTag]);
            setTagInput('');
        }
    };

    const removeTag = (tagToRemove) => {
        setSelectedTags(selectedTags.filter(tag => tag !== tagToRemove));
    };

    const handleSubmit = async () => {
        if (!formData.title || !imageFile) {
            showAlert("Validation Error", "Please fill in all required fields and upload an image");
            return;
        }

        if (!artistData || !artistData.artistId) {
            showAlert("Session Error", "User session not found. Please log in again.");
            return;
        }

        try {
            // Convert image to Base64
            const reader = new FileReader();
            reader.readAsDataURL(imageFile);
            reader.onloadend = async () => {
                const base64Image = reader.result;

                const artworkData = {
                    title: formData.title,
                    description: formData.description,
                    image: base64Image,
                    artistId: artistData.artistId,
                    creationDate: new Date().toISOString().slice(0, 19)
                };

                // 1. Insert Artwork
                const savedArtwork = await insertArtwork(artworkData, artistData.artistId);

                // 2. Handle Tags
                for (const tagName of selectedTags) {
                    let tagId;
                    // Check if tag exists
                    const existingTag = availableTags.find(t => t.name.toLowerCase() === tagName.toLowerCase());

                    if (existingTag) {
                        tagId = existingTag.tagId;
                    } else {
                        // Create new tag
                        const newTag = await insertTag({ name: tagName, description: 'User created tag' });
                        tagId = newTag.tagId;
                    }

                    // Link tag to artwork
                    try {
                        await insertArtworkTag(savedArtwork.artworkId, tagId);
                    } catch (tagError) {
                        console.error(`Failed to link tag ${tagName} to artwork`, tagError);
                        // Continue linking other tags even if one fails
                    }
                }

                showAlert("Success", "Artwork uploaded successfully!", () => {
                    if (onNavigate) onNavigate('profile');
                });
                setFormData({ title: '', description: '' });
                setSelectedTags([]);
                setImageFile(null);
            };
        } catch (error) {
            console.error('Failed to upload artwork:', error);
            showAlert("Error", "Failed to upload artwork. Please try again.");
        }
    };

    const handleCancel = () => {
        setFormData({ title: '', description: '' });
        setSelectedTags([]);
        setImageFile(null);
    };

    return (
        <div className="upload-artwork-container">
            <div className="upload-header">
                <h1 className="upload-title">Upload Artwork</h1>
                <p className="upload-subtitle">
                    Share your creative work with the Hiveminds community!
                </p>
            </div>

            <div className="upload-form-card">
                <div className="form-grid">
                    {/* Artwork Image Upload */}
                    <div className="full-width">
                        <label className="form-label">Artwork Image*</label>
                        <div className="image-upload-area">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="file-input"
                            />
                            <div className="upload-icon">↑</div>
                            <p className="upload-text">Click to upload or drag and drop</p>
                            <p className="upload-subtext">PNG, JPG, GIF up to 10MB</p>
                            {imageFile && (
                                <div className="image-preview-container">
                                    <img
                                        src={URL.createObjectURL(imageFile)}
                                        alt="Preview"
                                        className="image-preview"
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Left Column */}
                    <div>
                        {/* Title */}
                        <div className="form-group">
                            <label className="form-label">Title</label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                placeholder="Give your artwork a title"
                                className="form-input"
                            />
                        </div>

                        {/* Tags */}
                        <div className="form-group">
                            <label className="form-label">Tags</label>

                            {/* Dropdown for existing tags */}
                            <select
                                className="form-input tag-select"
                                onChange={(e) => {
                                    if (e.target.value) {
                                        addTag(e.target.value);
                                        e.target.value = ""; // Reset select
                                    }
                                }}
                            >
                                <option value="">Select a tag...</option>
                                {availableTags.map(tag => (
                                    <option key={tag.tagId} value={tag.name}>{tag.name}</option>
                                ))}
                            </select>

                            {/* Input for new tags */}
                            <div className="new-tag-container">
                                <input
                                    type="text"
                                    value={tagInput}
                                    onChange={(e) => setTagInput(e.target.value)}
                                    onKeyDown={handleTagKeyDown}
                                    placeholder="Or create a new tag..."
                                    className="form-input new-tag-input"
                                />
                                <button
                                    onClick={() => addTag(tagInput)}
                                    className="btn-secondary add-tag-btn"
                                >
                                    Add
                                </button>
                            </div>

                            <div className="tags-list">
                                {selectedTags.map((tag, index) => (
                                    <span key={index} className="tag-chip">
                                        {tag}
                                        <button onClick={() => removeTag(tag)} className="remove-tag-btn">×</button>
                                    </span>
                                ))}
                            </div>
                            <p className="upload-subtext tag-help-text">
                                Select from existing tags or create your own to help others discover your artwork
                            </p>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div>
                        {/* Description */}
                        <div className="form-group">
                            <label className="form-label">Description</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Tell us about your artwork..."
                                rows="6"
                                className="form-textarea"
                            />
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="form-actions">
                        <button onClick={handleCancel} className="btn-cancel">
                            Cancel
                        </button>
                        <button onClick={handleSubmit} className="button-hexagon btn-submit">
                            Upload Artwork
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UploadArtwork;
