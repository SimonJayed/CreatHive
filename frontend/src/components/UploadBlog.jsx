import React, { useState } from 'react';
import { insertBlog } from '../api/blogApi';

function UploadBlog() {
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
            await insertBlog(formData);
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
        <div style={{
            height: '100vh',
            padding: '60px 40px 20px 40px',
            backgroundColor: 'black',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            boxSizing: 'border-box'
        }}>
            <div style={{ flexShrink: 0, width: '100%', maxWidth: '800px' }}>
                <h1 style={{ color: '#FFB800', fontSize: '32px', marginBottom: '6px', marginTop: 0 }}>
                    Upload Blog
                </h1>
                <p style={{ color: '#FFB800', marginBottom: '16px', marginTop: 0, fontSize: '14px' }}>
                    Share your creative work with the Hiveminds community!
                </p>
            </div>

            <div style={{
                backgroundColor: 'white',
                borderRadius: '8px',
                padding: '24px',
                width: '100%',
                maxWidth: '800px',
                flex: 1,
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column'
            }}>
                <div style={{ flex: 1, overflowY: 'auto', paddingRight: '4px' }}>
                    {/* Title */}
                    <div style={{ marginBottom: '16px' }}>
                        <label style={{
                            display: 'block',
                            marginBottom: '6px',
                            color: '#000',
                            fontWeight: '600',
                            fontSize: '14px'
                        }}>
                            Title*
                        </label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="Give your blog a title"
                            style={{
                                width: '100%',
                                padding: '10px 12px',
                                borderRadius: '4px',
                                border: '1px solid #ddd',
                                fontSize: '14px',
                                boxSizing: 'border-box'
                            }}
                        />
                    </div>

                    {/* Description */}
                    <div style={{ marginBottom: '16px' }}>
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
                            name="content"
                            value={formData.content}
                            onChange={handleChange}
                            placeholder="Tell us about your thoughts..."
                            rows="4"
                            style={{
                                width: '100%',
                                padding: '10px 12px',
                                borderRadius: '4px',
                                border: '1px solid #ddd',
                                fontSize: '14px',
                                boxSizing: 'border-box',
                                resize: 'vertical',
                                minHeight: '100px'
                            }}
                        />
                    </div>

                    {/* Visibility */}
                    <div style={{ marginBottom: '16px' }}>
                        <label style={{
                            display: 'block',
                            marginBottom: '10px',
                            color: '#000',
                            fontWeight: '600',
                            fontSize: '14px'
                        }}>
                            Visibility
                        </label>
                        <div>
                            <label style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', cursor: 'pointer' }}>
                                <input
                                    type="radio"
                                    name="visibility"
                                    value="public"
                                    checked={formData.visibility === 'public'}
                                    onChange={handleChange}
                                    style={{ marginRight: '8px' }}
                                />
                                <span style={{ fontSize: '14px' }}>
                                    <strong>Public</strong> - Anyone can see this artwork
                                </span>
                            </label>
                            <label style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', cursor: 'pointer' }}>
                                <input
                                    type="radio"
                                    name="visibility"
                                    value="unlisted"
                                    checked={formData.visibility === 'unlisted'}
                                    onChange={handleChange}
                                    style={{ marginRight: '8px' }}
                                />
                                <span style={{ fontSize: '14px' }}>
                                    <strong>Unlisted</strong> - Only people with the link can see this artwork
                                </span>
                            </label>
                            <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                                <input
                                    type="radio"
                                    name="visibility"
                                    value="private"
                                    checked={formData.visibility === 'private'}
                                    onChange={handleChange}
                                    style={{ marginRight: '8px' }}
                                />
                                <span style={{ fontSize: '14px' }}>
                                    <strong>Private</strong> - Only you can see this artwork
                                </span>
                            </label>
                        </div>
                    </div>
                </div>

                {/* Buttons - Fixed at bottom */}
                <div style={{
                    flexShrink: 0,
                    display: 'flex',
                    justifyContent: 'flex-end',
                    gap: '12px',
                    paddingTop: '16px',
                    borderTop: '1px solid #eee'
                }}>
                    <button
                        onClick={handleCancel}
                        style={{
                            padding: '10px 28px',
                            backgroundColor: 'white',
                            color: '#FFB800',
                            border: '2px solid #FFB800',
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
                            padding: '10px 28px',
                            backgroundColor: '#FFB800',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: '14px',
                            fontWeight: '600',
                            cursor: 'pointer'
                        }}
                    >
                        Upload Blog
                    </button>
                </div>
            </div>
        </div>
    );
}

export default UploadBlog;
