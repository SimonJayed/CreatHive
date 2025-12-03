import React, { useEffect, useState } from "react";
import {
    getAllArtists,
    insertArtist,
    updateArtist,
    deleteArtist,
} from "../../api/artistApi";
import "../../styles/ArtistCRUD.css";

function ArtistUploadModal({ isOpen, onClose, onSubmit, editingArtist }) {
    const [form, setForm] = useState({
        name: "",
        bio: "",
        interest: "",
    });

    useEffect(() => {
        if (editingArtist) {
            setForm({
                name: editingArtist.name,
                bio: editingArtist.bio,
                interest: editingArtist.interest,
            });
        } else {
            setForm({ name: "", bio: "", interest: "" });
        }
    }, [editingArtist, isOpen]);

    const handleSubmit = () => {
        if (form.name && form.bio && form.interest) {
            onSubmit(form);
            setForm({ name: "", bio: "", interest: "" });
        }
    };

    if (!isOpen) return null;

    return (
        <div className="artist-crud-overlay">
            <div className="artist-crud-modal">
                <div className="artist-crud-header">
                    <h2 className="artist-crud-title">
                        {editingArtist ? 'Edit Artist' : 'Add Artist'}
                    </h2>
                    <p className="artist-crud-subtitle">
                        Showcase your talent to the world!
                    </p>
                </div>

                <div className="artist-crud-body">
                    <div className="artist-crud-form-group">
                        <label className="artist-crud-label">
                            Name*
                        </label>
                        <input
                            type="text"
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            placeholder="Artist Name"
                            className="artist-crud-input"
                        />
                    </div>

                    <div className="artist-crud-form-group">
                        <label className="artist-crud-label">
                            Bio*
                        </label>
                        <textarea
                            value={form.bio}
                            onChange={(e) => setForm({ ...form, bio: e.target.value })}
                            placeholder="Tell us about yourself..."
                            rows="4"
                            className="artist-crud-textarea"
                        />
                    </div>

                    <div className="artist-crud-form-group">
                        <label className="artist-crud-label">
                            Interest*
                        </label>
                        <input
                            type="text"
                            value={form.interest}
                            onChange={(e) => setForm({ ...form, interest: e.target.value })}
                            placeholder="e.g. Digital Art, Oil Painting"
                            className="artist-crud-input"
                        />
                    </div>

                    <div className="artist-crud-actions">
                        <button
                            onClick={onClose}
                            className="artist-crud-btn-cancel"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSubmit}
                            className="artist-crud-btn-submit"
                        >
                            {editingArtist ? 'Update Artist' : 'Add Artist'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function ArtistCRUD() {
    const [artists, setArtists] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingArtist, setEditingArtist] = useState(null);

    const loadArtists = async () => {
        const data = await getAllArtists();
        setArtists(data);
    };

    useEffect(() => {
        loadArtists();
    }, []);

    const handleSubmit = async (form) => {
        if (editingArtist) {
            await updateArtist(editingArtist.artistId, form);
        } else {
            await insertArtist(form);
        }
        setIsModalOpen(false);
        setEditingArtist(null);
        loadArtists();
    };

    const handleEdit = (artist) => {
        setEditingArtist(artist);
        setIsModalOpen(true);
    };

    return (
        <div className="artist-crud-container">
            <div className="artist-crud-top-bar">
                <h2 className="artist-crud-main-title">Artist Management</h2>
                <button
                    onClick={() => {
                        setEditingArtist(null);
                        setIsModalOpen(true);
                    }}
                    className="artist-crud-add-btn"
                >
                    Add New Artist
                </button>
            </div>

            <div className="artist-crud-grid">
                {artists.map((artist) => (
                    <div key={artist.artistId} className="artist-card">
                        <h3 className="artist-card-name">{artist.name}</h3>
                        <p className="artist-card-interest"><strong>Interest:</strong> {artist.interest}</p>
                        <p className="artist-card-bio">{artist.bio}</p>

                        <div className="artist-card-actions">
                            <button
                                onClick={() => handleEdit(artist)}
                                className="artist-card-btn-edit"
                            >
                                Edit
                            </button>
                            <button
                                onClick={() => deleteArtist(artist.artistId).then(loadArtists)}
                                className="artist-card-btn-delete"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <ArtistUploadModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setEditingArtist(null);
                }}
                onSubmit={handleSubmit}
                editingArtist={editingArtist}
            />
        </div>
    );
}

export default ArtistCRUD;
