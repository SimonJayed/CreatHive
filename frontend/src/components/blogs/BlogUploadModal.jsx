import React, { useState, useEffect } from "react";
import "../../styles/BlogCRUD.css";

function BlogUploadModal({ isOpen, onClose, onSubmit, editingBlog }) {
    const [form, setForm] = useState({
        title: "",
        content: "",
        visibility: "public",
    });

    useEffect(() => {
        if (editingBlog) {
            setForm({
                title: editingBlog.title,
                content: editingBlog.content,
                visibility: editingBlog.visibility || "public",
            });
        } else {
            setForm({ title: "", content: "", visibility: "public" });
        }
    }, [editingBlog, isOpen]);

    const handleSubmit = () => {
        if (form.title && form.content) {
            onSubmit(form);
            setForm({ title: "", content: "", visibility: "public" });
        }
    };

    if (!isOpen) return null;

    return (
        <div className="blog-crud-overlay">
            <div className="blog-crud-modal">
                <div className="blog-crud-header">
                    <h2 className="blog-crud-title">
                        Upload Blog
                    </h2>
                    <p className="blog-crud-subtitle">
                        Share your creative work with the Hivenminds community!
                    </p>
                </div>

                <div className="blog-crud-body">
                    <div className="blog-crud-form-group">
                        <label className="blog-crud-label">
                            Title*
                        </label>
                        <input
                            type="text"
                            value={form.title}
                            onChange={(e) => setForm({ ...form, title: e.target.value })}
                            placeholder="Give your blog a title"
                            className="blog-crud-input"
                        />
                    </div>

                    <div className="blog-crud-form-group">
                        <label className="blog-crud-label">
                            Content*
                        </label>
                        <textarea
                            value={form.content}
                            onChange={(e) => setForm({ ...form, content: e.target.value })}
                            placeholder="Tell us about your thoughts..."
                            rows="6"
                            className="blog-crud-textarea"
                        />
                    </div>

                    <div className="blog-crud-visibility-group">
                        <label className="blog-crud-label" style={{ marginBottom: '12px' }}>
                            Visibility
                        </label>
                        <div className="blog-crud-visibility-options">
                            <label className="blog-crud-radio-label">
                                <input
                                    type="radio"
                                    name="visibility"
                                    value="public"
                                    checked={form.visibility === "public"}
                                    onChange={(e) => setForm({ ...form, visibility: e.target.value })}
                                    className="blog-crud-radio-input"
                                />
                                <div>
                                    <span className="blog-crud-radio-text">Public</span>
                                    <span className="blog-crud-radio-subtext"> - Anyone can see this artwork</span>
                                </div>
                            </label>

                            <label className="blog-crud-radio-label">
                                <input
                                    type="radio"
                                    name="visibility"
                                    value="unlisted"
                                    checked={form.visibility === "unlisted"}
                                    onChange={(e) => setForm({ ...form, visibility: e.target.value })}
                                    className="blog-crud-radio-input"
                                />
                                <div>
                                    <span className="blog-crud-radio-text">Unlisted</span>
                                    <span className="blog-crud-radio-subtext"> - Only people with the link can see it</span>
                                </div>
                            </label>

                            <label className="blog-crud-radio-label">
                                <input
                                    type="radio"
                                    name="visibility"
                                    value="private"
                                    checked={form.visibility === "private"}
                                    onChange={(e) => setForm({ ...form, visibility: e.target.value })}
                                    className="blog-crud-radio-input"
                                />
                                <div>
                                    <span className="blog-crud-radio-text">Private</span>
                                    <span className="blog-crud-radio-subtext"> - Only you can see this artwork</span>
                                </div>
                            </label>
                        </div>
                    </div>

                    <div className="blog-crud-actions">
                        <button
                            onClick={onClose}
                            className="blog-crud-btn-cancel"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSubmit}
                            className="button-hexagon blog-crud-btn-submit"
                        >
                            Upload Blog
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default BlogUploadModal;
