import React from 'react';
import '../../styles/Learn.css';
import { BookOpen, Video, Download, PlayCircle } from 'lucide-react';

function Learn() {
    return (
        <div className="learn-container">
            <h1 className="learn-title">Learning Resources</h1>
            <p className="learn-subtitle">Expand your skills with curated tutorials and practice sheets.</p>

            <div className="resources-section">
                <h2 className="section-header">
                    <Video size={24} className="section-icon" /> Video Tutorials
                </h2>
                <div className="resource-grid">
                    {/* Placeholder Video Items */}
                    {[1, 2, 3].map((item) => (
                        <div key={item} className="resource-card video-card">
                            <div className="video-thumbnail">
                                <PlayCircle size={48} color="white" />
                            </div>
                            <div className="resource-info">
                                <h3>Character Design Basics {item}</h3>
                                <p>Learn the fundamentals of shape language and silhouette.</p>
                                <span className="duration">15 min</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="resources-section">
                <h2 className="section-header">
                    <Download size={24} className="section-icon" /> Practice Sheets
                </h2>
                <div className="resource-grid">
                    {/* Placeholder Download Items */}
                    {[1, 2, 3, 4].map((item) => (
                        <div key={item} className="resource-card download-card">
                            <div className="download-icon-area">
                                <BookOpen size={32} />
                            </div>
                            <div className="resource-info">
                                <h3>Anatomy Study Guide {item}</h3>
                                <button className="btn-download">Download PDF</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Learn;
