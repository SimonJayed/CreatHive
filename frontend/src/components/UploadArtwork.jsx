import React, { useState } from 'react';
import { insertArtwork } from '../api/artworkApi';

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
                    creationDate: new Date().toISOString()
                };

                await insertArtwork(artworkData);
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
        <div style={{
            height: '100vh',
            padding: '60px 40px 20px 40px',
            backgroundImage: 'linear-gradient(rgba(101, 67, 33, 0.8), rgba(101, 67, 33, 0.8)), url("https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=1600")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            boxSizing: 'border-box'
        }}>
            <div style={{ flexShrink: 0, width: '100%', maxWidth: '900px' }}>
                <h1 style={{ color: '#FFB800', fontSize: '32px', marginBottom: '6px', marginTop: 0 }}>
                    Upload Artwork
                </h1>
                <p style={{ color: '#FFB800', marginBottom: '16px', marginTop: 0, fontSize: '14px' }}>
                    Share your creative work with the Hiveminds community!
                </p>
            </div>

            <div style={{
                backgroundColor: 'rgba(255, 248, 240, 0.95)',
                borderRadius: '8px',
                padding: '24px',
                width: '100%',
                maxWidth: '900px',
                flex: 1,
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column'
            }}>
                <div style={{
                    flex: 1,
                    overflowY: 'auto',
                    paddingRight: '4px',
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '16px',
                    alignContent: 'start'
                }}>
                    {/* Artwork Image Upload - Spans 2 columns */}
                    <div style={{ gridColumn: '1 / -1' }}>
                        <label style={{
                            display: 'block',
                            marginBottom: '6px',
                            color: '#000',
                            fontWeight: '600',
                            fontSize: '14px'
                        }}>
                            Artwork Image*
                        </label>
                        <div style={{
                            border: '2px dashed #FFB800',
                            borderRadius: '8px',
                            padding: '30px 20px',
                            textAlign: 'center',
                            backgroundColor: 'rgba(255, 255, 255, 0.7)',
                            cursor: 'pointer',
                            position: 'relative'
                        }}>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    width: '100%',
                                    height: '100%',
                                    opacity: 0,
                                    cursor: 'pointer'
                                }}
                            />
                            <div style={{ color: '#FFB800', fontSize: '32px', marginBottom: '6px' }}>↑</div>
                            <p style={{ color: '#FFB800', fontWeight: '600', marginBottom: '4px', fontSize: '13px', margin: '0 0 4px 0' }}>
                                Click to upload or drag and drop
                            </p>
                            <p style={{ color: '#999', fontSize: '11px', margin: 0 }}>
                                PNG, JPG, GIF up to 10MB
                            </p>
                            {imageFile && (
                                <div style={{ marginTop: '16px', width: '100%', display: 'flex', justifyContent: 'center' }}>
                                    <img
                                        src={URL.createObjectURL(imageFile)}
                                        alt="Preview"
                                        style={{
                                            maxWidth: '100%',
                                            maxHeight: '200px',
                                            borderRadius: '8px',
                                            objectFit: 'contain'
                                        }}
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Left Column */}
                    <div>
                        {/* Title */}
                        <div style={{ marginBottom: '14px' }}>
                            <label style={{
                                display: 'block',
                                marginBottom: '6px',
                                color: '#000',
                                fontWeight: '600',
                                fontSize: '14px'
                            }}>
                                Title
                            </label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                placeholder="Give your artwork a title"
                                style={{
                                    width: '100%',
                                    padding: '8px 10px',
                                    borderRadius: '4px',
                                    border: '1px solid #ddd',
                                    fontSize: '14px',
                                    boxSizing: 'border-box'
                                }}
                            />
                        </div>

                        {/* Category */}
                        <div style={{ marginBottom: '14px' }}>
                            <label style={{
                                display: 'block',
                                marginBottom: '6px',
                                color: '#000',
                                fontWeight: '600',
                                fontSize: '14px'
                            }}>
                                Category
                            </label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                style={{
                                    width: '100%',
                                    padding: '8px 10px',
                                    borderRadius: '4px',
                                    border: '1px solid #ddd',
                                    fontSize: '14px',
                                    boxSizing: 'border-box',
                                    backgroundColor: 'white'
                                }}
                            >
                                <option value="">Select a category</option>
                                <option value="digital">Digital Art</option>
                                <option value="traditional">Traditional Art</option>
                                <option value="3d">3D Art</option>
                                <option value="photography">Photography</option>
                            </select>
                        </div>

                        {/* Tags */}
                        <div>
                            <label style={{
                                display: 'block',
                                marginBottom: '6px',
                                color: '#000',
                                fontWeight: '600',
                                fontSize: '14px'
                            }}>
                                Tags
                            </label>
                            <input
                                type="text"
                                name="tags"
                                value={formData.tags}
                                onChange={handleChange}
                                placeholder="digital art, fantasy..."
                                style={{
                                    width: '100%',
                                    padding: '8px 10px',
                                    borderRadius: '4px',
                                    border: '1px solid #ddd',
                                    fontSize: '14px',
                                    boxSizing: 'border-box'
                                }}
                            />
                            <p style={{ fontSize: '11px', color: '#666', marginTop: '3px', margin: '3px 0 0 0' }}>
                                Tags help others discover your artwork
                            </p>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div>
                        {/* Description */}
                        <div style={{ marginBottom: '14px' }}>
                            <label style={{
                                display: 'block',
                                marginBottom: '6px',
                                color: '#000',
                                fontWeight: '600',
                                fontSize: '14px'
                            }}>
                                Description
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Tell us about your artwork..."
                                rows="6"
                                style={{
                                    width: '100%',
                                    padding: '8px 10px',
                                    borderRadius: '4px',
                                    border: '1px solid #ddd',
                                    fontSize: '14px',
                                    boxSizing: 'border-box',
                                    resize: 'none'
                                }}
                            />
                        </div>
                    </div>

                    {/* Visibility - Spans 2 columns */}
                    <div style={{ gridColumn: '1 / -1' }}>
                        <label style={{
                            display: 'block',
                            marginBottom: '8px',
                            color: '#000',
                            fontWeight: '600',
                            fontSize: '14px'
                        }}>
                            Visibility
                        </label>
                        <div style={{ display: 'flex', gap: '20px' }}>
                            <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                                <input
                                    type="radio"
                                    name="visibility"
                                    value="public"
                                    checked={formData.visibility === 'public'}
                                    onChange={handleChange}
                                    style={{ marginRight: '6px' }}
                                />
                                <span style={{ fontSize: '13px' }}><strong>Public</strong></span>
                            </label>
                            <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                                <input
                                    type="radio"
                                    name="visibility"
                                    value="unlisted"
                                    checked={formData.visibility === 'unlisted'}
                                    onChange={handleChange}
                                    style={{ marginRight: '6px' }}
                                />
                                <span style={{ fontSize: '13px' }}><strong>Unlisted</strong></span>
                            </label>
                            <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                                <input
                                    type="radio"
                                    name="visibility"
                                    value="private"
                                    checked={formData.visibility === 'private'}
                                    onChange={handleChange}
                                    style={{ marginRight: '6px' }}
                                />
                                <span style={{ fontSize: '13px' }}><strong>Private</strong></span>
                            </label>
                        </div>
                    </div>
                </div>

                {/* Buttons - Fixed at bottom */}
                <div style={{
                    gridColumn: '1 / -1',
                    display: 'flex',
                    justifyContent: 'flex-end',
                    gap: '12px',
                    paddingTop: '16px',
                    borderTop: '1px solid #ddd',
                    flexShrink: 0
                }}>
                    <button
                        onClick={handleCancel}
                        style={{
                            padding: '8px 24px',
                            backgroundColor: 'transparent',
                            color: '#8B4513',
                            border: '2px solid #8B4513',
                            borderRadius: '8px',
                            fontSize: '14px',
                            fontWeight: '600',
                            cursor: 'pointer'
                        }}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        style={{
                            padding: '8px 24px',
                            backgroundColor: '#FFB800',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: '14px',
                            fontWeight: '600',
                            cursor: 'pointer'
                        }}
                    >
                        Upload Artwork
                    </button>
                </div>
            </div>
        </div>
    );
}

export default UploadArtwork;
