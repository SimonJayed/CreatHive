import React, { useState } from "react";
import { updateArtist } from "../../api/artistApi";

const INTERESTS = [
    "Anime", "Abstract", "Cartoon Style",
    "Chibi Style", "Concept Art", "Cubism",
    "Cyberpunk", "Dark Art", "Digital Illustration",
    "Expressionism", "Fantasy", "Gothic Art",
    "Hyperrealism", "Impressionism", "Minimalism",
    "Pop Art", "Realism", "Sci-Fi Art",
    "Surrealism", "Semi-Realism", "Vintage Style"
];

function InterestPicker({ artistId, onComplete }) {
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

    return (
        <div style={{
            minHeight: '100vh',
            backgroundColor: 'white',
            padding: '40px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
        }}>
            <div style={{ width: '100%', maxWidth: '800px', position: 'relative' }}>
                <button
                    onClick={() => window.history.back()}
                    style={{
                        position: 'absolute',
                        left: 0,
                        top: 0,
                        padding: '10px 20px',
                        backgroundColor: '#FFB800',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        fontWeight: 'bold',
                        cursor: 'pointer'
                    }}
                >
                    Back
                </button>

                <div style={{ textAlign: 'center', marginTop: '60px', marginBottom: '40px' }}>
                    <h1 style={{ color: '#FFB800', fontSize: '36px', marginBottom: '10px' }}>
                        Pick your interest
                    </h1>
                    <p style={{ color: '#333', fontSize: '18px' }}>
                        Select at least three categories
                    </p>
                </div>

                <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                    gap: '15px',
                    marginBottom: '40px'
                }}>
                    {INTERESTS.map((interest) => (
                        <button
                            key={interest}
                            onClick={() => toggleInterest(interest)}
                            style={{
                                padding: '12px 24px',
                                borderRadius: '8px',
                                border: 'none',
                                backgroundColor: selectedInterests.includes(interest) ? '#FFB800' : '#FFC107', // Active vs Inactive yellow
                                color: 'white',
                                fontSize: '16px',
                                fontWeight: '600',
                                cursor: 'pointer',
                                opacity: selectedInterests.includes(interest) ? 1 : 0.7,
                                transition: 'all 0.2s'
                            }}
                        >
                            {interest}
                        </button>
                    ))}
                </div>

                <div style={{ textAlign: 'right' }}>
                    <button
                        onClick={handleContinue}
                        style={{
                            padding: '12px 40px',
                            backgroundColor: '#FFB800',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: '18px',
                            fontWeight: 'bold',
                            cursor: 'pointer'
                        }}
                    >
                        Continue →
                    </button>
                </div>
            </div>
        </div>
    );
}

export default InterestPicker;
