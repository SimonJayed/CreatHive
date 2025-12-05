import React, { useState, useEffect } from 'react';
import { usePopup } from '../context/PopupContext';
import { updateArtist, getArtistById } from '../api/artistApi';
import { getArtworksByArtistId, getArchivedArtworksByArtistId, archiveArtwork, getFavoriteArtworks } from '../api/artworkApi';
import { getBlogsByArtistId } from '../api/blogApi';
import { getAllTags } from '../api/tagApi';
import { resizeImage } from '../utils/imageUtils';
import ArtistArtworks from './profile/ArtistArtworks';
import ArtistBlogs from './profile/ArtistBlogs';
import FavoriteArtworks from './profile/FavoriteArtworks';
import ProfileHeader from './profile/ProfileHeader';
import ProfileBio from './profile/ProfileBio';
import '../styles/Profile.css';

function Profile({ userData: currentUser, onNavigate, onProfileUpdate, viewingArtistId: propViewingId }) {
    const { showAlert } = usePopup();
    const [isEditing, setIsEditing] = useState(false);
    const [profileData, setProfileData] = useState(null);
    const [userArtworks, setUserArtworks] = useState([]);
    const [archivedArtworks, setArchivedArtworks] = useState([]);
    const [userBlogs, setUserBlogs] = useState([]);
    const [favoriteArtworks, setFavoriteArtworks] = useState([]);
    const [likedTags, setLikedTags] = useState([]);
    const [activeTab, setActiveTab] = useState('artworks');

    // Determine if we are viewing our own profile
    const viewingArtistId = propViewingId ? parseInt(propViewingId) : currentUser?.artistId;
    const isOwner = currentUser?.artistId === viewingArtistId;

    useEffect(() => {
        loadProfile();
    }, [viewingArtistId, currentUser]);

    const loadProfile = async () => {
        if (!viewingArtistId) return;

        try {
            let artist;
            if (isOwner && currentUser) {
                artist = currentUser;
            } else {
                artist = await getArtistById(viewingArtistId);
            }

            if (artist) {
                // Sanitize data
                const sanitizedData = Object.fromEntries(
                    Object.entries(artist).map(([key, value]) => [key, value === null ? '' : value])
                );
                setProfileData({
                    name: 'John Doe', email: '', bio: '', interest: '',
                    website: '', profileImage: '',
                    joinedDate: 'November 2025', artworks: 0,
                    ...sanitizedData
                });
                fetchUserContent(artist.artistId, artist);
                fetchInterests(artist.artistId);
            }
        } catch (error) {
            console.error("Failed to load profile", error);
            showAlert("Error", "Failed to load profile.");
        }
    };

    const fetchUserContent = async (artistId, artistObj) => {
        try {
            const [artworks, blogs, favorites] = await Promise.all([
                getArtworksByArtistId(artistId),
                getBlogsByArtistId(artistId),
                getFavoriteArtworks(artistId)
            ]);

            if (Array.isArray(artworks)) {
                // Attach artist data if missing to fix "by Unknown"
                const currentArtistInfo = artistObj || profileData || { artistId, name: 'Artist' };
                const artworksWithArtist = artworks.map(a => ({
                    ...a,
                    artist: a.artist || currentArtistInfo
                }));
                setUserArtworks(artworksWithArtist);
                setProfileData(prev => ({ ...prev, artworks: artworks.length }));
            }

            if (Array.isArray(blogs)) setUserBlogs(blogs);
            if (Array.isArray(favorites)) setFavoriteArtworks(favorites);

            if (isOwner) {
                const archived = await getArchivedArtworksByArtistId(artistId);
                if (Array.isArray(archived)) {
                    const currentArtistInfo = artistObj || profileData || { artistId, name: 'Artist' };
                    const archivedWithArtist = archived.map(a => ({
                        ...a,
                        artist: a.artist || currentArtistInfo
                    }));
                    setArchivedArtworks(archivedWithArtist);
                }
            }
        } catch (error) {
            console.error("Failed to fetch user content", error);
        }
    };

    const fetchInterests = async (artistId) => {
        try {
            const tags = await getAllTags(artistId);
            // Filter tags where 'liked' is true for this user
            // Note: getAllTags returns liked status relative to the *requesting* user if passed.
            // But here we want to see what tags *this profile user* likes.
            // The current backend implementation of getAllTags(userId) checks if the *userId passed* likes the tag.
            // So passing the profile's artistId works correctly to get *their* likes.
            const liked = tags.filter(t => t.liked);
            setLikedTags(liked);
        } catch (error) {
            console.error("Failed to fetch interests", error);
        }
    };

    const handleSave = async () => {
        try {
            const result = await updateArtist(profileData.artistId, profileData);
            if (onProfileUpdate && isOwner) onProfileUpdate(result);
            setIsEditing(false);
            showAlert("Success", "Profile updated successfully!");
        } catch (error) {
            console.error("Failed to update profile", error);
            showAlert("Error", "Failed to update profile.");
        }
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (file) {
            try {
                const resizedImage = await resizeImage(file);
                setProfileData(prev => ({ ...prev, profileImage: resizedImage }));
            } catch (error) {
                console.error("Error resizing image:", error);
                showAlert("Error", "Failed to process image. Please try another one.");
            }
        }
    };

    const handleArchive = async (artworkId, isArchived) => {
        try {
            await archiveArtwork(artworkId, !isArchived, viewingArtistId);
            fetchUserContent(viewingArtistId);
        } catch (error) {
            console.error("Failed to archive artwork", error);
        }
    };

    const updateField = (field) => (e) => setProfileData(prev => ({ ...prev, [field]: e.target.value }));

    if (!profileData) return <div className="loading">Loading Profile...</div>;

    return (
        <div className="profile-container">
            <div className="profile-card">
                <ProfileHeader
                    profileData={profileData}
                    isEditing={isEditing}
                    onEditToggle={() => isOwner ? (isEditing ? handleSave() : setIsEditing(true)) : null}
                    onImageUpload={isOwner ? handleImageUpload : null}
                    onNameChange={updateField('name')}
                    readOnly={!isOwner}
                />
                <ProfileBio
                    profileData={profileData}
                    isEditing={isEditing}
                    onBioChange={updateField('bio')}
                    onWebsiteChange={updateField('website')}
                    readOnly={!isOwner}
                />

                {/* Interests Section */}
                <div className="profile-interests">
                    <h3 className="interests-title">Interests</h3>
                    <div className="interests-list">
                        {likedTags.length > 0 ? (
                            likedTags.map(tag => (
                                <span key={tag.tagId} className="tag-chip">
                                    {tag.name}
                                </span>
                            ))
                        ) : (
                            <p className="no-interests">No interests selected yet.</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Tab Navigation */}
            <div className="profile-tabs">
                <button
                    className={`tab-button ${activeTab === 'artworks' ? 'active' : ''}`}
                    onClick={() => setActiveTab('artworks')}
                >
                    Artworks
                </button>
                <button
                    className={`tab-button ${activeTab === 'blogs' ? 'active' : ''}`}
                    onClick={() => setActiveTab('blogs')}
                >
                    Blogs
                </button>
                <button
                    className={`tab-button ${activeTab === 'favorites' ? 'active' : ''}`}
                    onClick={() => setActiveTab('favorites')}
                >
                    Favorites
                </button>
                {isOwner && (
                    <button
                        className={`tab-button ${activeTab === 'archived' ? 'active' : ''}`}
                        onClick={() => setActiveTab('archived')}
                    >
                        Archived
                    </button>
                )}

            </div>

            {/* Tab Content */}
            <div className="profile-content-area">
                {activeTab === 'artworks' && (
                    <div className="tab-content-wrapper">
                        <ArtistArtworks
                            artworks={userArtworks}
                            onNavigate={onNavigate}
                            isOwner={isOwner}
                            onArchive={isOwner ? (id) => handleArchive(id, false) : null}
                        />
                    </div>
                )}
                {activeTab === 'blogs' && (
                    <div className="tab-content-wrapper">
                        <ArtistBlogs blogs={userBlogs} artist={profileData} onNavigate={onNavigate} isOwner={isOwner} />
                    </div>
                )}
                {activeTab === 'favorites' && (
                    <div className="tab-content-wrapper">
                        <FavoriteArtworks favorites={favoriteArtworks} onNavigate={onNavigate} />
                    </div>
                )}
                {activeTab === 'archived' && isOwner && (
                    <div className="tab-content-wrapper">
                        <ArtistArtworks
                            artworks={archivedArtworks}
                            onNavigate={onNavigate}
                            isOwner={isOwner}
                            onArchive={isOwner ? (id) => handleArchive(id, true) : null}
                            isArchivedView={true}
                        />
                    </div>
                )}

            </div>
        </div>
    );
}

export default Profile;