import React from 'react';
import EditableText from './EditableText';

function ProfileHeader({
    profileData,
    isEditing,
    onEditToggle,
    onImageUpload,
    onNameChange,
    readOnly
}) {
    return (
        <div className="profile-header">
            <div className="profile-main-info">
                {/* Profile Picture */}
                <div className={`profile-image-container ${isEditing ? 'editable' : ''}`}>
                    <img
                        src={profileData.profileImage || "/images/profile/default_profile.png"}
                        alt="Profile"
                        className="profile-image"
                    />
                    {isEditing && (
                        <div className="edit-overlay">
                            Change
                            <input
                                type="file"
                                accept="image/*"
                                onChange={onImageUpload}
                                className="file-input"
                            />
                        </div>
                    )}
                </div>

                {/* Name and Email */}
                <div className="profile-identity">
                    <EditableText
                        isEditing={isEditing}
                        value={profileData.name}
                        onChange={onNameChange}
                        placeholder="Full Name"
                        tag="h2"
                        className="profile-name"
                        inputClassName="profile-name-input"
                    />
                    <p className="profile-email">{profileData.email}</p>
                </div>
            </div>

            {/* Edit/Save Button */}
            {/* Edit/Save Button */}
            {!readOnly && (
                <button onClick={onEditToggle} className="button-hexagon edit-button">
                    {isEditing ? 'Save Changes' : 'Edit Profile'}
                </button>
            )}
        </div>
    );
}

export default ProfileHeader;
