import React, { useState } from 'react';
import { insertArtwork } from '../api/artworkApi';
import '../styles/UploadArtwork.css';

function UploadArtwork({ artistData, onNavigate }) {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        tags: ''
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
                    description: formData.description,
                    tags: formData.tags,
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
                setFormData({ title: '', description: '', tags: '' });
                setImageFile(null);
                if (onNavigate) onNavigate('profile');
            };
        } catch (error) {
            console.error('Failed to upload artwork:', error);
            alert('Failed to upload artwork. Please try again.');
        }
    };

    const handleCancel = () => {
        setFormData({ title: '', description: '', tags: '' });
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
                                <div className="image-preview-container" style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    width: '100%',
                                    height: '100%',
                                    margin: 0,
                                    borderRadius: '12px',
                                    overflow: 'hidden',
                                    zIndex: 5,
                                    backgroundColor: '#f8f8f8'
                                }}>
                                    <img
                                        src={URL.createObjectURL(imageFile)}
                                        alt="Preview"
                                        className="image-preview"
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover',
                                            maxHeight: 'none',
                                            maxWidth: 'none'
                                        }}
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
