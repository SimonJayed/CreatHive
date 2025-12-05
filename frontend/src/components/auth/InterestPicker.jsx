import React, { useState } from "react";
import { usePopup } from "../../context/PopupContext";
import { updateArtist } from "../../api/artistApi";
import { getAllTags, likeTag } from "../../api/tagApi";
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
    const { showAlert } = usePopup();
    const [selectedInterests, setSelectedInterests] = useState([]);
    const [allTags, setAllTags] = useState([]);

    React.useEffect(() => {
        const fetchTags = async () => {
            try {
                const tags = await getAllTags();
                setAllTags(tags);
            } catch (error) {
                console.error("Failed to fetch tags", error);
            }
        };
        fetchTags();
    }, []);

    const toggleInterest = (interest) => {
        if (selectedInterests.includes(interest)) {
            setSelectedInterests(selectedInterests.filter(i => i !== interest));
        } else {
            setSelectedInterests([...selectedInterests, interest]);
        }
    };

    const handleContinue = async () => {
        if (selectedInterests.length < 3) {
            showAlert("Selection Required", "Please select at least three categories.");
            return;
        }

        try {
            // 1. Update artist profile string (legacy/backup)
            const interestString = selectedInterests.join(", ");
            await updateArtist(artistId, { interest: interestString });

            // 2. Like the corresponding tags
            const likePromises = selectedInterests.map(interestName => {
                const tag = allTags.find(t => t.name.toLowerCase() === interestName.toLowerCase());
                if (tag) {
                    return likeTag(tag.tagId, artistId);
                }
                return Promise.resolve();
            });

            await Promise.all(likePromises);

            onComplete();
        } catch (error) {
            console.error("Failed to update interests", error);
            showAlert("Error", "Failed to save interests. Please try again.");
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
