import React from 'react';

function HeroSection() {
    return (
        <div className="hero-section">
            {/* Left Side - Text */}
            <div className="hero-text-container">
                <h1 className="hero-title">
                    UNLEASH<br />
                    YOUR<br />
                    CREATIVE<br />
                    POTENTIAL
                </h1>
                <p className="hero-description">
                    Join a thriving community of student artists where creativity knows no bounds. Showcase your artwork to a wider audience, take part in exciting challenges that spark inspiration, collaborate with fellow creatives, and grow your skills while building a professional portfolio that reflects your unique artistic journey.
                </p>
            </div>

            {/* Right Side - Image */}
            <div className="hero-image-container">
                <img
                    src="https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800"
                    alt="Artist at work"
                    className="hero-image"
                />
            </div>
        </div>
    );
}

export default HeroSection;
