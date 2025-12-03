import React, { useState } from "react";
import { updateArtist } from "../../api/artistApi";
import '../../styles/InterestPicker.css';

const INTERESTS = [
    "Anime", "Abstract", "Cartoon Style",
    "Chibi Style", "Concept Art", "Cubism",
    "Cyberpunk", "Dark Art", "Digital Illustration",
    "Expressionism", "Fantasy", "Gothic Art",
    "Hyperrealism", "Impressionism", "Minimalism",
    "Pop Art", "Realism", "Sci-Fi Art",
    "Surrealism", "Semi-Realism", "Vintage Style"
];

function InterestPicker({ artistId, onComplete, onBack }) {
    const [selectedInterests, setSelectedInterests] = useState([]);

    const toggleInterest = (interest) => {
        if (selectedInterests.includes(interest)) {
            setSelectedInterests(selectedInterests.filter(i => i !== interest));
        } else {
            setSelectedInterests([...selectedInterests, interest]);
        }
    };

    const handleContinue = async () => {
        if (selectedInterests.length < 3) {
            alert("Please select at least three categories.");
            return;
        }

        try {
            // Assuming we update the artist with the selected interests as a comma-separated string
            // or however the backend expects it. For now, joining with commas.
            const interestString = selectedInterests.join(", ");
            await updateArtist(artistId, { interest: interestString });
            onComplete();
        } catch (error) {
            console.error("Failed to update interests", error);
            alert("Failed to save interests. Please try again.");
        }
    };

    const handleBack = () => {
        if (onBack) {
            onBack();
        } else {
            window.history.back();
        }
    };

    return (
        <div className="interest-picker-container">
            <div className="interest-content">
                <button
                    onClick={handleBack}
                    className="back-btn"
                >
                    Back
                </button>

                <div className="interest-header">
                    <h1 className="interest-title">
                        Pick your interest
                    </h1>
                    <p className="interest-subtitle">
                        Select at least three categories
                    </p>
                </div>

                <div className="interests-grid">
                    {INTERESTS.map((interest) => (
                        <button
                            key={interest}
                            onClick={() => toggleInterest(interest)}
                            className={`interest-btn ${selectedInterests.includes(interest) ? 'selected' : ''}`}
                        >
                            {interest}
                        </button>
                    ))}
                </div>

                <div className="continue-container">
                    <button
                        onClick={handleContinue}
                        className="continue-btn"
                    >
                        Continue →
                    </button>
                </div>
            </div>
        </div>
    );
}

export default InterestPicker;
