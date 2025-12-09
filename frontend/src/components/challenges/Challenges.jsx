import React, { useState, useEffect } from 'react';
import ArtworkCard from '../artworks/ArtworkCard';
import '../../styles/Challenges.css';
import { likeArtwork, favoriteArtwork } from '../../api/artworkApi';
// Remove unused import from userArtworkApi if it was only for toggleFavorite
// import { toggleFavorite } from '../../api/userArtworkApi';

function Challenges({ currentUser, onNavigate }) {
    const [challenge, setChallenge] = useState(null);
    const [entries, setEntries] = useState([]);
    const [streak, setStreak] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchChallengeData();
    }, []);

    const fetchChallengeData = async () => {
        try {
            // 1. Get Current Challenge
            const challengeResponse = await fetch('http://localhost:8080/challenges/current');
            if (challengeResponse.ok) {
                const challengeData = await challengeResponse.json();
                setChallenge(challengeData);

                // 2. Get Entries for this challenge
                const userId = currentUser?.artistId || 0;
                const entriesResponse = await fetch(`http://localhost:8080/challenges/${challengeData.challengeId}/entries?userId=${userId}`);
                if (entriesResponse.ok) {
                    const entriesData = await entriesResponse.json();
                    setEntries(entriesData);
                }
            }

            // 3. Get User Streak
            if (currentUser) {
                const streakResponse = await fetch(`http://localhost:8080/challenges/streak/${currentUser.artistId}`);
                if (streakResponse.ok) {
                    const streakData = await streakResponse.json();
                    setStreak(streakData);
                }
            }

        } catch (error) {
            console.error("Failed to fetch challenge data:", error);
        } finally {
            setLoading(false);
        }
    };

    const hasSubmitted = entries.some(artwork => currentUser && artwork.artist?.artistId === currentUser.artistId);

    const handleJoinChallenge = () => {
        if (!challenge) return;
        // Navigate to upload page with challenge state AND required tag
        onNavigate('upload-artwork', {
            challengeId: challenge.challengeId,
            theme: challenge.theme,
            requiredTag: challenge.tags
        });
    };

    const handleLike = async (artworkId) => {
        if (!currentUser) return;
        try {
            const updatedArtwork = await likeArtwork(artworkId, currentUser.artistId);
            setEntries(prev => prev.map(a =>
                a.artworkId === artworkId ? { ...a, likeCount: updatedArtwork.likeCount, isLiked: updatedArtwork.isLiked } : a
            ));
        } catch (error) {
            console.error("Failed to like artwork:", error);
        }
    };

    const handleFavorite = async (artworkId) => {
        if (!currentUser) return;
        try {
            await favoriteArtwork(artworkId, currentUser.artistId);
            setEntries(prev => prev.map(a => {
                if (a.artworkId === artworkId) {
                    return { ...a, isFavorited: !a.isFavorited };
                }
                return a;
            }));
        } catch (error) {
            console.error("Failed to toggle favorite:", error);
        }
    };

    if (loading) {
        return <div className="challenges-loading">Loading Challenge...</div>;
    }

    if (!challenge) {
        return <div className="challenges-empty">No active challenge found. Check back later!</div>;
    }

    return (
        <div className="challenges-container">
            {/* Header / Hero */}
            <div className="challenge-hero">
                <div className="challenge-hero-content">
                    <h1 className="challenge-title">Weekly Challenge</h1>
                    <div className="challenge-theme-box">
                        <span className="theme-label">Theme:</span>
                        <h2 className="theme-text">{challenge.theme}</h2>
                    </div>
                    <div className="challenge-tag-requirement">
                        Required Tag: <span className="highlight-tag">{challenge.tags}</span>
                    </div>
                    <p className="challenge-description">{challenge.description}</p>

                    {hasSubmitted ? (
                        <button className="btn-join-challenge disabled" disabled>
                            Entry Submitted
                        </button>
                    ) : (
                        <button onClick={handleJoinChallenge} className="btn-join-challenge">
                            Join Challenge
                        </button>
                    )}
                </div>

                {/* Streak Badge (Only show if logged in) */}
                {currentUser && (
                    <div className="streak-badge">
                        <div className="streak-count">{streak}</div>
                        <div className="streak-label">Week Streak</div>
                    </div>
                )}
            </div>

            {/* Submissions Grid */}
            <div className="challenge-submissions">
                <h3 className="submissions-title">Community Submissions</h3>
                <div className="submissions-grid">
                    {entries.length > 0 ? (
                        entries.map(artwork => (
                            <ArtworkCard
                                key={artwork.artworkId}
                                artwork={artwork}
                                // Disable heavy interactions or keep them, simpler for now
                                isOwner={currentUser && currentUser.artistId === artwork.artist?.artistId}
                                onLike={handleLike}
                                onFavorite={handleFavorite}
                                isFavorited={artwork.isFavorited}
                                showFavorite={true}
                                currentUser={currentUser}
                            />
                        ))
                    ) : (
                        <div className="no-entries">
                            Be the first to submit for this challenge!
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Challenges;
