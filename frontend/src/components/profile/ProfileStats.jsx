import React from 'react';

function ProfileStats({ profileData }) {
    return (
        <div className="profile-stats-container">
            {/* Vertical Stats List */}
            <div className="stats-list">
                <div className="stat-row">
                    <span className="stat-icon">⭐</span>
                    <span className="stat-label">Level {profileData.level}</span>
                </div>
                <div className="stat-row">
                    <span className="stat-icon">🏆</span>
                    <span className="stat-label">{profileData.xp} XP</span>
                </div>
                <div className="stat-row">
                    <span className="stat-icon">📅</span>
                    <span className="stat-label">Joined {profileData.joinedDate}</span>
                </div>
            </div>

            {/* Horizontal Summary */}
            <div className="stats-summary">
                <span className="summary-item"><strong>{profileData.artworks}</strong> Artworks</span>
                <span className="summary-item"><strong>{profileData.totalXP}</strong> Total XP</span>
                <span className="summary-item"><strong>{profileData.levels}</strong> Level</span>
            </div>
        </div>
    );
}

export default ProfileStats;
