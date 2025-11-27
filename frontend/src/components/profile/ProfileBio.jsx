import React from 'react';
import EditableText from './EditableText';

function ProfileBio({
    profileData,
    isEditing,
    onBioChange,
    onWebsiteChange
}) {
    return (
        <>
            {/* Bio Section */}
            {isEditing ? (
                <textarea
                    value={profileData.bio}
                    onChange={onBioChange}
                    placeholder="Add a bio to tell others about yourself and your artistic journey."
                    className="bio-textarea"
                />
            ) : (
                <p className="bio-text">
                    {profileData.bio || 'Add a bio to tell others about yourself and your artistic journey.'}
                </p>
            )}

            {/* Location & Website */}
            <div className="profile-details-list">

                <div className="detail-item">
                    <span className="detail-icon">🌐</span>
                    <EditableText
                        isEditing={isEditing}
                        value={profileData.website}
                        onChange={onWebsiteChange}
                        placeholder="Add your website"
                        className="detail-text"
                        inputClassName="detail-input"
                    />
                </div>
            </div >
        </>
    );
}

export default ProfileBio;
