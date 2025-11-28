import React, { useState } from 'react';
import { insertArtwork } from '../api/artworkApi';
import '../styles/UploadArtwork.css';

function UploadArtwork({ artistData, onNavigate }) {
    const [formData, setFormData] = useState({
        title: '',
        category: '',
        description: '',
        tags: '',
        visibility: 'public'
    });
    const [imageFile, setImageFile] = useState(null);

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
            alert('Please fill in all required fields and upload an image');
            return;
        }

        if (!artistData || !artistData.artistId) {
            alert('User session not found. Please log in again.');
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
                    category: formData.category,
                    description: formData.description,
                    tags: formData.tags,
                    visibility: formData.visibility,
                    image: base64Image,
                    artistId: artistData.artistId,
                    creationDate: new Date().toISOString().slice(0, 19) // Remove 'Z' for LocalDateTime compatibility
                };

                const user = JSON.parse(localStorage.getItem('currentArtist'));
                if (!user || !user.artistId) {
                    alert('You must be logged in to upload artwork.');
                    return;
                }
                const artistId = user.artistId;
                await insertArtwork(artworkData, artistId);
                alert('Artwork uploaded successfully!');
                setFormData({ title: '', category: '', description: '', tags: '', visibility: 'public' });
                setImageFile(null);
                if (onNavigate) onNavigate('profile');
            };
        } catch (error) {
            console.error('Failed to upload artwork:', error);
            alert('Failed to upload artwork. Please try again.');
        }
    };

    const handleCancel = () => {
        setFormData({ title: '', category: '', description: '', tags: '', visibility: 'public' });
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
                    {/* Artwork Image Upload - Spans full width */}
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

                        {/* Category */}
                        <div className="form-group">
                            <label className="form-label">Category</label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                className="form-select"
                            >
                                <option value="">Select a category</option>
                                <option value="digital">Digital Art</option>
                                <option value="traditional">Traditional Art</option>
                                <option value="3d">3D Art</option>
                                <option value="photography">Photography</option>
                            </select>
                        </div>

                        {/* Tags */}
                        <div className="form-group">
                            <label className="form-label">Tags</label>
                            <input
                                type="text"
                                name="tags"
                                value={formData.tags}
                                onChange={handleChange}
                                placeholder="digital art, fantasy..."
                                className="form-input"
                            />
                            <p className="upload-subtext" style={{ marginTop: '4px' }}>
                                Tags help others discover your artwork
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

                    {/* Visibility - Spans full width */}
                    <div className="full-width">
                        <label className="form-label">Visibility</label>
                        <div className="visibility-options">
                            <label className="radio-label">
                                <input
                                    type="radio"
                                    name="visibility"
                                    value="public"
                                    checked={formData.visibility === 'public'}
                                    onChange={handleChange}
                                    className="radio-input"
                                />
                                <span className="radio-text"><strong>Public</strong></span>
                            </label>
                            <label className="radio-label">
                                <input
                                    type="radio"
                                    name="visibility"
                                    value="unlisted"
                                    checked={formData.visibility === 'unlisted'}
                                    onChange={handleChange}
                                    className="radio-input"
                                />
                                <span className="radio-text"><strong>Unlisted</strong></span>
                            </label>
                            <label className="radio-label">
                                <input
                                    type="radio"
                                    name="visibility"
                                    value="private"
                                    checked={formData.visibility === 'private'}
                                    onChange={handleChange}
                                    className="radio-input"
                                />
                                <span className="radio-text"><strong>Private</strong></span>
                            </label>
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="form-actions">
                        <button onClick={handleCancel} className="btn-cancel">
                            Cancel
                        </button>
                        <button onClick={handleSubmit} className="btn-submit">
                            Upload Artwork
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UploadArtwork;
