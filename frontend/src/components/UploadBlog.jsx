import React, { useState, useEffect } from 'react';
import { usePopup } from '../context/PopupContext';
import { insertBlog, updateBlog, insertBlogTag, getTagsByBlogId, updateBlogTags } from '../api/blogApi';
import { getAllTags } from '../api/tagApi';
import TagSelector from './common/TagSelector';
import '../styles/UploadBlog.css';

function UploadBlog({ artistData, onNavigate, blogToEdit = null }) {
    const { showAlert } = usePopup();
    const [formData, setFormData] = useState({
        title: '',
        content: ''
    });
    const [allTags, setAllTags] = useState([]);
    const [selectedTagNames, setSelectedTagNames] = useState([]);
    const [isEditMode, setIsEditMode] = useState(false);

    useEffect(() => {
        // Fetch all available tags for ID lookup
        getAllTags().then(tags => setAllTags(tags || []));

        if (blogToEdit) {
            setIsEditMode(true);
            setFormData({
                title: blogToEdit.title,
                content: blogToEdit.content
            });
            // Fetch existing tags for this blog
            getTagsByBlogId(blogToEdit.blogId).then(tags => {
                setSelectedTagNames(tags.map(t => t.name));
            });
        }
    }, [blogToEdit]);

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
            const artistId = artistData?.artistId || 0;
            if (artistId === 0) {
                showAlert("Login Required", "You must be logged in to upload a blog.");
                return;
            }

            // Resolve Tag IDs
            const tagIdsToSubmit = [];
            for (const tagName of selectedTagNames) {
                const existingTag = allTags.find(t => t.name.toLowerCase() === tagName.toLowerCase());
                if (existingTag) {
                    tagIdsToSubmit.push(existingTag.tagId);
                } else {
                    // Tag creation not supported in Blog for now, or could iterate loop to create.
                    // Ignoring new tags for now as per previous logic decision to keep it simple unless requested.
                }
            }

            if (isEditMode) {
                await updateBlog(blogToEdit.blogId, formData);

                // Update Tags
                await updateBlogTags(blogToEdit.blogId, tagIdsToSubmit);

                showAlert("Success", "Blog updated successfully!");
            } else {
                const blogData = {
                    ...formData,
                    artistId: artistId
                };
                const newBlog = await insertBlog(blogData, artistId);

                // Insert Tags
                if (tagIdsToSubmit.length > 0) {
                    await Promise.all(tagIdsToSubmit.map(tagId => insertBlogTag(newBlog.blogId, tagId)));
                }

                showAlert("Success", "Blog uploaded successfully!");
            }

            setFormData({ title: '', content: '' });
            setSelectedTagNames([]);
            if (onNavigate) onNavigate('blogs');
        } catch (error) {
            console.error('Failed to save blog:', error);
            showAlert("Error", "Failed to save blog. Please try again.");
        }
    };

    const handleCancel = () => {
        setFormData({ title: '', content: '' });
        if (onNavigate) onNavigate('blogs');
    };

    return (
        <div className="upload-blog-container">
            <div className="upload-header">
                <h1 className="upload-title">{isEditMode ? 'Edit Blog' : 'Upload Blog'}</h1>
                <p className="upload-subtitle">
                    {isEditMode ? 'Update your thoughts...' : 'Share your creative work with the Hiveminds community!'}
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

                    {/* Tags Selection */}
                    <div className="form-group">
                        <label className="form-label">Tags</label>
                        <TagSelector
                            selectedTags={selectedTagNames}
                            onTagSelect={setSelectedTagNames}
                            allowCreation={false}
                        />
                    </div>

                </div>

                {/* Buttons */}
                <div className="form-actions">
                    <button onClick={handleCancel} className="btn-cancel">
                        Cancel
                    </button>
                    <button onClick={handleSubmit} className="button-hexagon btn-submit">
                        {isEditMode ? 'Update Blog' : 'Upload Blog'}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default UploadBlog;
