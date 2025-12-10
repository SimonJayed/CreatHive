import React, { useState, useEffect } from 'react';
import { usePopup } from '../context/PopupContext';
import { insertArtwork } from '../api/artworkApi';
import { getAllTags, insertTag, insertArtworkTag } from '../api/tagApi';
import TagSelector from './common/TagSelector';
import '../styles/UploadArtwork.css';

function UploadArtwork({ artistData, onNavigate, challengeId, challengeTheme, requiredTag }) {
    const { showAlert } = usePopup();
    const [formData, setFormData] = useState({
        title: '',
        description: ''
    });
    const [imageFile, setImageFile] = useState(null);
    const [selectedTags, setSelectedTags] = useState([]);
    const [availableTags, setAvailableTags] = useState([]);

    useEffect(() => {
        getAllTags().then(tags => setAvailableTags(tags || []));
    }, []);

    // Auto-select required tag if provided
    useEffect(() => {
        if (requiredTag) {
            setSelectedTags(prev => {
                const exists = prev.some(t => t.toLowerCase() === requiredTag.toLowerCase());
                return exists ? prev : [...prev, requiredTag];
            });
        }
    }, [requiredTag]);

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

    const handleSubmit = async () => {
        if (!formData.title || !imageFile) {
            showAlert("Validation Error", "Please fill in all required fields and upload an image");
            return;
        }

        if (!artistData || !artistData.artistId) {
            showAlert("Session Error", "User session not found. Please log in again.");
            return;
        }

        // Validate required tag
        if (requiredTag && !selectedTags.some(t => t.toLowerCase() === requiredTag.toLowerCase())) {
            showAlert("Challenge Requirement", `You must include the tag "${requiredTag}" to submit to this challenge.`);
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
                    creationDate: new Date().toISOString().slice(0, 19),
                    challenge: challengeId ? { challengeId: challengeId } : null
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
                    if (challengeId) {
                        onNavigate('challenges'); // Return to challenge page
                    } else {
                        onNavigate('profile');
                    }
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
        if (challengeId) {
            onNavigate('challenges');
        } else {
            onNavigate('explore');
        }
    };

    return (
        <div className="upload-artwork-container">
            <div className="upload-header">
                <h1 className="upload-title">
                    {challengeId ? `Challenge Submission: ${challengeTheme}` : 'Upload Artwork'}
                </h1>
                <p className="upload-subtitle">
                    {challengeId
                        ? 'Show off your skills and participate in the weekly challenge!'
                        : 'Share your creative work with the Hiveminds community!'
                    }
                </p>
                {challengeId && (
                    <div className="challenge-alert-box">
                        <span>🏆 You are submitting to the weekly challenge!</span>
                        {requiredTag && <span className="challenge-tag-info">ℹ️ Required Tag: <strong>{requiredTag}</strong> (Auto-selected)</span>}
                    </div>
                )}
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
                            <TagSelector
                                selectedTags={selectedTags}
                                onTagSelect={setSelectedTags}
                                allowCreation={true}
                            />
                            {requiredTag && (
                                <p className="tag-requirement-note">
                                    Tag <strong>{requiredTag}</strong> is required for this challenge.
                                </p>
                            )}
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
