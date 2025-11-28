import React, { useState } from 'react';
import { insertBlog } from '../api/blogApi';
import '../styles/UploadBlog.css';

function UploadBlog({ artistData }) {
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        visibility: 'public'
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        if (!formData.title || !formData.content) {
            alert('Please fill in all required fields');
            return;
        }

        try {
            // Include artistId in the blog data
            const blogData = {
                ...formData,
                artistId: artistData?.artistId || 0
            };
            console.log("Uploading blog with data:", blogData);
            console.log("Artist data:", artistData);
            const artistId = artistData?.artistId || 0;
            if (artistId === 0) {
                alert('You must be logged in to upload a blog.');
                return;
            }
            await insertBlog(blogData, artistId);
            alert('Blog uploaded successfully!');
            setFormData({ title: '', content: '', visibility: 'public' });
        } catch (error) {
            console.error('Failed to upload blog:', error);
            alert('Failed to upload blog. Please try again.');
        }
    };

    const handleCancel = () => {
        setFormData({ title: '', content: '', visibility: 'public' });
    };

    return (
        <div className="upload-blog-container">
            <div className="upload-header">
                <h1 className="upload-title">Upload Blog</h1>
                <p className="upload-subtitle">
                    Share your creative work with the Hiveminds community!
                </p>
            </div>

            <div className="upload-form-card">
                <div className="form-content">
                    {/* Title */}
                    <div className="form-group">
                        <label className="form-label">Title*</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="Give your blog a title"
                            className="form-input"
                        />
                    </div>

                    {/* Description */}
                    <div className="form-group">
                        <label className="form-label">Description</label>
                        <textarea
                            name="content"
                            value={formData.content}
                            onChange={handleChange}
                            placeholder="Tell us about your thoughts..."
                            rows="4"
                            className="form-textarea"
                        />
                    </div>

                    {/* Visibility */}
                    <div className="form-group">
                        <label className="form-label" style={{ marginBottom: '10px' }}>Visibility</label>
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
                                <span className="radio-text">
                                    <strong>Public</strong> - Anyone can see this artwork
                                </span>
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
                                <span className="radio-text">
                                    <strong>Unlisted</strong> - Only people with the link can see this artwork
                                </span>
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
                                <span className="radio-text">
                                    <strong>Private</strong> - Only you can see this artwork
                                </span>
                            </label>
                        </div>
                    </div>
                </div>

                {/* Buttons */}
                <div className="form-actions">
                    <button onClick={handleCancel} className="btn-cancel">
                        Cancel
                    </button>
                    <button onClick={handleSubmit} className="btn-submit">
                        Upload Blog
                    </button>
                </div>
            </div>
        </div>
    );
}

export default UploadBlog;
