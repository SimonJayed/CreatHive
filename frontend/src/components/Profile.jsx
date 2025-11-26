import React, { useState, useEffect } from 'react';
import { updateArtist } from '../api/artistApi';
import { getAllArtworks } from '../api/artworkApi';
import { getAllBlogs } from '../api/blogApi';

// Profile component receives Artist data as userData prop
// In CreatHive, Artists ARE the users (ArtistEntity = User)
function Profile({ userData, onNavigate, onProfileUpdate }) {
    const [isEditing, setIsEditing] = useState(false);
    const [profileData, setProfileData] = useState({
        // Artist entity properties
        name: userData?.name || userData?.username || 'John Doe',
        email: userData?.email || 'johndoe@gmail.com',
        bio: userData?.bio || '',
        interest: userData?.interest || '',
        location: userData?.location || '',
        website: userData?.website || '',
        profileImage: userData?.profileImage || '',
        // Game progression properties (to be added to ArtistEntity)
        level: userData?.level || 1,
        xp: userData?.xp || 0,
        joinedDate: userData?.joinedDate || 'November 2025',
        artworks: userData?.artworks || 0,
        totalXP: userData?.totalXP || 0,
        levels: userData?.levels || 1
    });
    const [userArtworks, setUserArtworks] = useState([]);
    const [userBlogs, setUserBlogs] = useState([]);

    // Update local state when userData prop changes
    useEffect(() => {
        if (userData) {
            setProfileData(prev => ({
                ...prev,
                name: userData.name || userData.username || prev.name,
                email: userData.email || prev.email,
                bio: userData.bio || prev.bio,
                interest: userData.interest || prev.interest,
                location: userData.location || prev.location,
                website: userData.website || prev.website,
                profileImage: userData.profileImage || prev.profileImage
            }));
            fetchUserContent();
        }
    }, [userData]);

    const fetchUserContent = async () => {
        if (!userData?.artistId) return;
        try {
            // Fetch all and filter by artistId (temporary solution until backend supports filtering)
            const allArtworks = await getAllArtworks();
            const allBlogs = await getAllBlogs();

            // Assuming artworks and blogs have an artistId field. If not, this might need adjustment.
            // For now, we'll just set empty arrays if we can't filter properly or if the API returns empty.
            // In a real app, we'd check the structure.
            // Let's assume the API returns an array.
            if (Array.isArray(allArtworks)) {
                // Filter if the item has artistId, otherwise just show all (for demo) or none
                // Ideally: item.artistId === userData.artistId
                // For this demo, let's just show all to demonstrate the UI if we can't filter
                setUserArtworks(allArtworks);
            }
            if (Array.isArray(allBlogs)) {
                setUserBlogs(allBlogs);
            }
        } catch (error) {
            console.error("Failed to fetch user content", error);
        }
    };

    const handleSave = async () => {
        try {
            const updatedArtist = {
                ...userData, // Keep existing fields
                name: profileData.name,
                bio: profileData.bio,
                interest: profileData.interest,
                location: profileData.location,
                website: profileData.website,
                profileImage: profileData.profileImage
            };

            const result = await updateArtist(userData.artistId, updatedArtist);

            // Update parent state and localStorage
            if (onProfileUpdate) {
                onProfileUpdate(result);
            }

            setIsEditing(false);
            alert('Profile updated successfully!');
        } catch (error) {
            console.error("Failed to update profile", error);
            alert('Failed to update profile.');
        }
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfileData(prev => ({ ...prev, profileImage: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div style={{
            height: '100vh',
            padding: '60px 80px',
            backgroundColor: 'black',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            boxSizing: 'border-box'
        }}>
            {/* Profile Card */}
            <div style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                padding: '32px',
                marginBottom: '24px',
                flexShrink: 0
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '30px' }}>
                    <div style={{ display: 'flex', gap: '30px', alignItems: 'center' }}>
                        {/* Profile Picture */}
                        <div style={{
                            width: '120px',
                            height: '120px',
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, #ff0080, #ff8c00)',
                            overflow: 'hidden',
                            position: 'relative',
                            cursor: isEditing ? 'pointer' : 'default'
                        }}>
                            <img
                                src={profileData.profileImage || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200"}
                                alt="Profile"
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                            {isEditing && (
                                <div style={{
                                    position: 'absolute',
                                    bottom: 0,
                                    left: 0,
                                    width: '100%',
                                    backgroundColor: 'rgba(0,0,0,0.5)',
                                    color: 'white',
                                    fontSize: '10px',
                                    textAlign: 'center',
                                    padding: '4px 0'
                                }}>
                                    Change
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageUpload}
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
                                </div>
                            )}
                        </div>

                        {/* Profile Info */}
                        <div>
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={profileData.name}
                                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                                    placeholder="Full Name"
                                    style={{
                                        fontSize: '28px',
                                        marginBottom: '4px',
                                        marginTop: 0,
                                        fontWeight: 'bold',
                                        border: '1px solid #ddd',
                                        borderRadius: '4px',
                                        padding: '4px 8px',
                                        width: '300px'
                                    }}
                                />
                            ) : (
                                <h2 style={{ fontSize: '28px', marginBottom: '4px', marginTop: 0 }}>{profileData.name}</h2>
                            )}
                            <p style={{ color: '#666', fontSize: '14px', margin: 0 }}>{profileData.email}</p>
                        </div>
                    </div>

                    {/* Edit/Save Button */}
                    <button
                        onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                        style={{
                            backgroundColor: '#FFB800',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            padding: '10px 24px',
                            fontSize: '14px',
                            fontWeight: '600',
                            cursor: 'pointer'
                        }}
                    >
                        {isEditing ? 'Save Changes' : 'Edit Profile'}
                    </button>
                </div>

                {/* Bio Section */}
                {isEditing ? (
                    <textarea
                        value={profileData.bio}
                        onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                        placeholder="Add a bio to tell others about yourself and your artistic journey."
                        style={{
                            width: '100%',
                            padding: '12px',
                            borderRadius: '8px',
                            border: '1px solid #ddd',
                            fontSize: '14px',
                            marginBottom: '16px',
                            boxSizing: 'border-box',
                            minHeight: '60px'
                        }}
                    />
                ) : (
                    <p style={{ fontSize: '14px', color: '#666', marginBottom: '16px' }}>
                        {profileData.bio || 'Add a bio to tell others about yourself and your artistic journey.'}
                    </p>
                )}

                {/* Location & Website */}
                <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span>📍</span>
                        {isEditing ? (
                            <input
                                value={profileData.location}
                                onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                                placeholder="Add your location"
                                style={{
                                    padding: '6px 12px',
                                    borderRadius: '4px',
                                    border: '1px solid #ddd',
                                    fontSize: '14px'
                                }}
                            />
                        ) : (
                            <span style={{ fontSize: '14px', color: '#666' }}>
                                {profileData.location || 'Add your location'}
                            </span>
                        )}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span>🌐</span>
                        {isEditing ? (
                            <input
                                value={profileData.website}
                                onChange={(e) => setProfileData({ ...profileData, website: e.target.value })}
                                placeholder="Add your website"
                                style={{
                                    padding: '6px 12px',
                                    borderRadius: '4px',
                                    border: '1px solid #ddd',
                                    fontSize: '14px'
                                }}
                            />
                        ) : (
                            <span style={{ fontSize: '14px', color: '#666' }}>
                                {profileData.website || 'Add your website'}
                            </span>
                        )}
                    </div>
                </div>

                {/* Stats */}
                <div style={{ borderTop: '1px solid #eee', paddingTop: '16px' }}>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '8px' }}>
                        <span>⭐</span>
                        <span style={{ fontSize: '14px' }}>Level {profileData.level}</span>
                    </div>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '8px' }}>
                        <span>🏆</span>
                        <span style={{ fontSize: '14px' }}>{profileData.xp} XP</span>
                    </div>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '12px' }}>
                        <span>📅</span>
                        <span style={{ fontSize: '14px' }}>Joined {profileData.joinedDate}</span>
                    </div>
                    <div style={{ fontSize: '14px', color: '#666' }}>
                        <strong>{profileData.artworks}</strong> Artworks •
                        <strong> {profileData.totalXP}</strong> Total XP •
                        <strong> {profileData.levels}</strong> Level
                    </div>
                </div>
            </div>

            {/* Artworks & Blogs Section */}
            <div style={{
                flex: 1,
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '24px',
                minHeight: 0,
                overflowY: 'auto'
            }}>
                {/* Artworks Column */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <h3 style={{ color: '#FFB800', margin: '0 0 8px 0' }}>Artworks</h3>
                    {userArtworks.length > 0 ? (
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                            {userArtworks.map((artwork, index) => (
                                <div key={index} style={{
                                    backgroundColor: 'white',
                                    borderRadius: '8px',
                                    overflow: 'hidden',
                                    height: '200px'
                                }}>
                                    {/* Placeholder for artwork image since we might not have it in the basic list yet */}
                                    <div style={{ height: '100%', backgroundColor: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        {artwork.title}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div style={{
                            borderRadius: '12px',
                            backgroundImage: 'linear-gradient(rgba(100,100,100,0.7), rgba(100,100,100,0.7)), url("https://images.unsplash.com/photo-1536924940846-227afb31e2a5?w=600")',
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            padding: '32px',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            textAlign: 'center',
                            minHeight: '250px'
                        }}>
                            <span style={{ fontSize: '48px', marginBottom: '16px' }}>🖼️</span>
                            <h3 style={{ color: '#FFB800', fontSize: '24px', marginBottom: '12px' }}>No artworks yet</h3>
                            <p style={{ color: 'white', fontSize: '14px', marginBottom: '20px' }}>
                                Start sharing your creative work with the Hiveminds community!
                            </p>
                            <button
                                onClick={() => onNavigate && onNavigate('upload-artwork')}
                                style={{
                                    backgroundColor: '#FFB800',
                                    color: 'black',
                                    border: 'none',
                                    borderRadius: '8px',
                                    padding: '12px 28px',
                                    fontSize: '14px',
                                    fontWeight: '600',
                                    cursor: 'pointer'
                                }}>
                                Upload your first Artwork
                            </button>
                        </div>
                    )}
                </div>

                {/* Blogs Column */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <h3 style={{ color: '#FFB800', margin: '0 0 8px 0' }}>Blogs</h3>
                    {userBlogs.length > 0 ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {userBlogs.map((blog, index) => (
                                <div key={index} style={{
                                    backgroundColor: 'white',
                                    borderRadius: '8px',
                                    padding: '16px'
                                }}>
                                    <h4 style={{ margin: '0 0 8px 0' }}>{blog.title}</h4>
                                    <p style={{ fontSize: '14px', color: '#666', margin: 0 }}>{blog.content?.substring(0, 100)}...</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div style={{
                            borderRadius: '12px',
                            backgroundImage: 'linear-gradient(rgba(139,90,43,0.7), rgba(139,90,43,0.7)), url("https://images.unsplash.com/photo-1501706362039-c06b2d715385?w=600")',
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            padding: '32px',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            textAlign: 'center',
                            minHeight: '250px'
                        }}>
                            <span style={{ fontSize: '48px', marginBottom: '16px' }}>📝</span>
                            <h3 style={{ color: '#FFB800', fontSize: '24px', marginBottom: '12px' }}>No blogs yet</h3>
                            <p style={{ color: 'white', fontSize: '14px', marginBottom: '20px' }}>
                                Share your imagination and inspire the Hiveminds community!
                            </p>
                            <button
                                onClick={() => onNavigate && onNavigate('upload-blog')}
                                style={{
                                    backgroundColor: '#FFB800',
                                    color: 'black',
                                    border: 'none',
                                    borderRadius: '8px',
                                    padding: '12px 28px',
                                    fontSize: '14px',
                                    fontWeight: '600',
                                    cursor: 'pointer'
                                }}>
                                Upload your first blog
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Profile;