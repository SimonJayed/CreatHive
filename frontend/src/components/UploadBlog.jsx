import React, { useState } from 'react';
import { usePopup } from '../context/PopupContext';
import { insertBlog } from '../api/blogApi';
import '../styles/UploadBlog.css';

function UploadBlog({ artistData }) {
    const { showAlert } = usePopup();
    const [formData, setFormData] = useState({
        title: '',
        content: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        if (!formData.title || !formData.content) {
            showAlert("Validation Error", "Please fill in all required fields");
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
                showAlert("Login Required", "You must be logged in to upload a blog.");
                return;
            }
            await insertBlog(blogData, artistId);
            showAlert("Success", "Blog uploaded successfully!");
            setFormData({ title: '', content: '' });
        } catch (error) {
            console.error('Failed to upload blog:', error);
            showAlert("Error", "Failed to upload blog. Please try again.");
        }
    };

    const handleCancel = () => {
        setFormData({ title: '', content: '' });
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

                </div>

                {/* Buttons */}
                <div className="form-actions">
                    <button onClick={handleCancel} className="btn-cancel">
                        Cancel
                    </button>
                    <button onClick={handleSubmit} className="button-hexagon btn-submit">
                        Upload Blog
                    </button>
                </div>
            </div>
        </div>
    );
}

export default UploadBlog;
