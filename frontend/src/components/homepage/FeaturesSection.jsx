import React from 'react';

function FeaturesSection() {
    const features = [
        {
            icon: '🎨',
            title: 'Showcase Your Work',
            text: 'Upload and share your artwork with a global community of student artists. Get feedback and inspiration from peers.'
        },
        {
            icon: '✏️',
            title: 'Art Fights',
            text: 'Participate in creative battles where you draw characters or styles created by other users. Win points and recognition!'
        },
        {
            icon: '🏆',
            title: 'Learn & Grow',
            text: 'Access tutorials, participate in challenges, and connect with mentors to improve your artistic skills.'
        }
    ];

    return (
        <div className="features-section">
            <h2 className="features-title">
                Why <span className="highlight-text">CreatHive?</span>
            </h2>
            <p className="features-description">
                CreativHive is a vibrant community platform where student artists can showcase their work, connect with fellow creatives, and collaborate on ideas. Like a hive buzzing with creativity, it provides a space for inspiration, growth, and meaningful artistic exchange.
            </p>

            {/* Feature Cards */}
            <div className="features-grid">
                {features.map((feature, index) => (
                    <div key={index} className="feature-card">
                        <div className="feature-icon">
                            {feature.icon}
                        </div>
                        <h3 className="feature-card-title">
                            {feature.title}
                        </h3>
                        <p className="feature-card-text">
                            {feature.text}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default FeaturesSection;
