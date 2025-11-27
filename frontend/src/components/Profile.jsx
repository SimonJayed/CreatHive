import React, { useState, useEffect } from 'react';
import { updateArtist } from '../api/artistApi';
import { getArtworksByArtistId } from '../api/artworkApi';
import { getBlogsByArtistId } from '../api/blogApi';
import { resizeImage } from '../utils/imageUtils';
import ArtistArtworks from './profile/ArtistArtworks';
import ArtistBlogs from './profile/ArtistBlogs';
import ProfileHeader from './profile/ProfileHeader';
import ProfileBio from './profile/ProfileBio';
import ProfileStats from './profile/ProfileStats';
import '../styles/Profile.css';

function Profile({ userData, onNavigate, onProfileUpdate }) {
    const [isEditing, setIsEditing] = useState(false);
    const [profileData, setProfileData] = useState({
        name: 'John Doe', email: 'johndoe@gmail.com', bio: '', interest: '',
        website: '', profileImage: '', level: 1, xp: 0,
        joinedDate: 'November 2025', artworks: 0, totalXP: 0, levels: 1,
        ...userData
    });
    const [userArtworks, setUserArtworks] = useState([]);
    const [userBlogs, setUserBlogs] = useState([]);
    const [activeTab, setActiveTab] = useState('artworks');

    useEffect(() => {
        if (userData) {
            // Sanitize userData to replace nulls with empty strings
            const sanitizedData = Object.fromEntries(
                Object.entries(userData).map(([key, value]) => [key, value === null ? '' : value])
            );
            setProfileData(prev => ({ ...prev, ...sanitizedData }));
            fetchUserContent();
        }
    }, [userData]);

    const fetchUserContent = async () => {
        if (!userData?.artistId) return;
        try {
            const [artworks, blogs] = await Promise.all([
                getArtworksByArtistId(userData.artistId),
                getBlogsByArtistId(userData.artistId)
            ]);
            if (Array.isArray(artworks)) {
                setUserArtworks(artworks);
                setProfileData(prev => ({ ...prev, artworks: artworks.length }));
            }
            if (Array.isArray(blogs)) setUserBlogs(blogs);
        } catch (error) {
            console.error("Failed to fetch user content", error);
        }
    };

    const handleSave = async () => {
        try {
            const result = await updateArtist(userData.artistId, { ...userData, ...profileData });
            if (onProfileUpdate) onProfileUpdate(result);
            setIsEditing(false);
            alert('Profile updated successfully!');
        } catch (error) {
            console.error("Failed to update profile", error);
            alert('Failed to update profile.');
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
                alert("Failed to process image. Please try another one.");
            }
        }
    };

    const updateField = (field) => (e) => setProfileData(prev => ({ ...prev, [field]: e.target.value }));

    return (
        <div className="profile-container">
            <div className="profile-card">
                <ProfileHeader
                    profileData={profileData}
                    isEditing={isEditing}
                    onEditToggle={() => isEditing ? handleSave() : setIsEditing(true)}
                    onImageUpload={handleImageUpload}
                    onNameChange={updateField('name')}
                />
                <ProfileBio
                    profileData={profileData}
                    isEditing={isEditing}
                    onBioChange={updateField('bio')}
                    onWebsiteChange={updateField('website')}
                />
                <ProfileStats profileData={profileData} />
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
            </div>

            {/* Tab Content */}
            <div className="profile-content-area">
                {activeTab === 'artworks' && (
                    <div className="tab-content-wrapper">
                        <ArtistArtworks artworks={userArtworks} onNavigate={onNavigate} />
                    </div>
                )}
                {activeTab === 'blogs' && (
                    <div className="tab-content-wrapper">
                        <ArtistBlogs blogs={userBlogs} onNavigate={onNavigate} />
                    </div>
                )}
            </div>
        </div>
    );
}

export default Profile;