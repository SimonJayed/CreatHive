import React, { useEffect, useState } from "react";
import {
    getAllArtists,
    insertArtist,
    updateArtist,
    deleteArtist,
} from "../../api/artistApi";

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
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
        }}>
            <div style={{
                backgroundColor: '#000',
                borderRadius: '8px',
                width: '90%',
                maxWidth: '600px',
                boxShadow: '0 4px 20px rgba(255, 184, 0, 0.3)',
                border: '2px solid #FFB800'
            }}>
                <div style={{
                    padding: '24px',
                    borderBottom: '1px solid #333'
                }}>
                    <h2 style={{
                        fontSize: '24px',
                        fontWeight: 'bold',
                        color: '#FFB800',
                        margin: '0 0 8px 0'
                    }}>
                        {editingArtist ? 'Edit Artist' : 'Add Artist'}
                    </h2>
                    <p style={{
                        fontSize: '14px',
                        color: '#FFB800',
                        margin: 0
                    }}>
                        Showcase your talent to the world!
                    </p>
                </div>

                <div style={{ padding: '24px', backgroundColor: '#fff' }}>
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{
                            display: 'block',
                            fontSize: '14px',
                            fontWeight: '600',
                            color: '#000',
                            marginBottom: '8px'
                        }}>
                            Name*
                        </label>
                        <input
                            type="text"
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            placeholder="Artist Name"
                            style={{
                                width: '100%',
                                padding: '10px 12px',
                                border: '1px solid #ddd',
                                borderRadius: '4px',
                                fontSize: '14px',
                                boxSizing: 'border-box'
                            }}
                        />
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                        <label style={{
                            display: 'block',
                            fontSize: '14px',
                            fontWeight: '600',
                            color: '#000',
                            marginBottom: '8px'
                        }}>
                            Bio*
                        </label>
                        <textarea
                            value={form.bio}
                            onChange={(e) => setForm({ ...form, bio: e.target.value })}
                            placeholder="Tell us about yourself..."
                            rows="4"
                            style={{
                                width: '100%',
                                padding: '10px 12px',
                                border: '1px solid #ddd',
                                borderRadius: '4px',
                                fontSize: '14px',
                                resize: 'none',
                                boxSizing: 'border-box',
                                fontFamily: 'inherit'
                            }}
                        />
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                        <label style={{
                            display: 'block',
                            fontSize: '14px',
                            fontWeight: '600',
                            color: '#000',
                            marginBottom: '8px'
                        }}>
                            Interest*
                        </label>
                        <input
                            type="text"
                            value={form.interest}
                            onChange={(e) => setForm({ ...form, interest: e.target.value })}
                            placeholder="e.g. Digital Art, Oil Painting"
                            style={{
                                width: '100%',
                                padding: '10px 12px',
                                border: '1px solid #ddd',
                                borderRadius: '4px',
                                fontSize: '14px',
                                boxSizing: 'border-box'
                            }}
                        />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                        <button
                            onClick={onClose}
                            style={{
                                padding: '10px 24px',
                                backgroundColor: 'white',
                                color: '#FFB800',
                                border: '1px solid #FFB800',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontSize: '14px',
                                fontWeight: '500'
                            }}
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSubmit}
                            style={{
                                padding: '10px 24px',
                                backgroundColor: '#FFB800',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontSize: '14px',
                                fontWeight: '600'
                            }}
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
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ color: '#FFB800', margin: 0 }}>Artist Management</h2>
                <button
                    onClick={() => {
                        setEditingArtist(null);
                        setIsModalOpen(true);
                    }}
                    style={{
                        padding: '10px 20px',
                        backgroundColor: '#FFB800',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontWeight: 'bold'
                    }}
                >
                    Add New Artist
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                {artists.map((artist) => (
                    <div key={artist.artistId} style={{
                        border: '1px solid #ddd',
                        borderRadius: '8px',
                        padding: '16px',
                        backgroundColor: 'white',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }}>
                        <h3 style={{ margin: '0 0 8px 0', color: '#333' }}>{artist.name}</h3>
                        <p style={{ margin: '0 0 8px 0', color: '#666', fontSize: '14px' }}><strong>Interest:</strong> {artist.interest}</p>
                        <p style={{ margin: '0 0 16px 0', color: '#444', fontSize: '14px' }}>{artist.bio}</p>

                        <div style={{ display: 'flex', gap: '8px' }}>
                            <button
                                onClick={() => handleEdit(artist)}
                                style={{
                                    padding: '6px 12px',
                                    backgroundColor: 'white',
                                    color: '#FFB800',
                                    border: '1px solid #FFB800',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    fontSize: '13px'
                                }}
                            >
                                Edit
                            </button>
                            <button
                                onClick={() => deleteArtist(artist.artistId).then(loadArtists)}
                                style={{
                                    padding: '6px 12px',
                                    backgroundColor: '#ff4444',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    fontSize: '13px'
                                }}
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
