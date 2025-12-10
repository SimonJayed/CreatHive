import React from 'react';
import '../../styles/Learn.css';
import { BookOpen, Video, PlayCircle, User } from 'lucide-react';
import { usePopup } from '../../context/PopupContext';

function Learn() {
    const { showConfirm } = usePopup();

    const openResource = (url) => {
        showConfirm(
            "External Link",
            "You are about to visit an external website. Continue?",
            () => window.open(url, "_blank")
        );
    };

    return (
        <div className="learn-container">
            <h1 className="learn-main-title">Learning Resources</h1>
            <p className="learn-subtitle-text">Expand your skills with curated tutorials and practice sheets.</p>

            {/* FUNDAMENTALS SECTION */}
            <div className="resources-section">
                <h2 className="section-header">
                    <BookOpen size={24} className="section-icon" /> Fundamentals
                </h2>
                <div className="resource-grid">
                    {/* Drawabox */}
                    <div className="resource-card" onClick={() => openResource("https://drawabox.com/")}>
                        <div className="resource-thumbnail" style={{ backgroundImage: "url('/images/tags/concept art.jpg')" }}>
                            <div className="resource-overlay">
                                <PlayCircle size={48} color="white" />
                            </div>
                        </div>
                        <div className="resource-info">
                            <h3>Drawabox</h3>
                            <p>Free, structured lessons on perspective and spatial reasoning.</p>
                            <span className="source-tag">Website</span>
                        </div>
                    </div>

                    {/* Proko */}
                    <div className="resource-card" onClick={() => openResource("https://www.proko.com/")}>
                        <div className="resource-thumbnail" style={{ backgroundImage: "url('/images/tags/realism.jpg')" }}>
                            <div className="resource-overlay">
                                <PlayCircle size={48} color="white" />
                            </div>
                        </div>
                        <div className="resource-info">
                            <h3>Proko</h3>
                            <p>In-depth anatomy and figure drawing tutorials.</p>
                            <span className="source-tag">Video Library</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* ANATOMY & GESTURE */}
            <div className="resources-section">
                <h2 className="section-header">
                    <User size={24} className="section-icon" /> Anatomy & Gesture
                </h2>
                <div className="resource-grid">
                    {/* Line of Action */}
                    <div className="resource-card" onClick={() => openResource("https://line-of-action.com/")}>
                        <div className="resource-thumbnail" style={{ backgroundImage: "url('/images/tags/expressionism.jpg')" }}>
                            <div className="resource-overlay">
                                <BookOpen size={48} color="white" />
                            </div>
                        </div>
                        <div className="resource-info">
                            <h3>Line of Action</h3>
                            <p>Timed photo reference sessions for gesture drawing.</p>
                            <span className="source-tag">Tool</span>
                        </div>
                    </div>

                    {/* Quickposes */}
                    <div className="resource-card" onClick={() => openResource("https://www.quickposes.com/en")}>
                        <div className="resource-thumbnail" style={{ backgroundImage: "url('/images/tags/academic art.jpg')" }}>
                            <div className="resource-overlay">
                                <BookOpen size={48} color="white" />
                            </div>
                        </div>
                        <div className="resource-info">
                            <h3>Quickposes</h3>
                            <p>Timed gesture drawing tool with vast library of poses.</p>
                            <span className="source-tag">Tool</span>
                        </div>
                    </div>
                </div>
            </div>


            {/* DIGITAL PAINTING */}
            <div className="resources-section">
                <h2 className="section-header">
                    <Video size={24} className="section-icon" /> Digital Painting
                </h2>
                <div className="resource-grid">
                    {/* Ctrl+Paint */}
                    <div className="resource-card" onClick={() => openResource("https://www.ctrlpaint.com/")}>
                        <div className="resource-thumbnail" style={{ backgroundImage: "url('/images/tags/concept art.jpg')" }}>
                            <div className="resource-overlay">
                                <PlayCircle size={48} color="white" />
                            </div>
                        </div>
                        <div className="resource-info">
                            <h3>Ctrl+Paint</h3>
                            <p>Free video library dedicated to the basics of digital painting.</p>
                            <span className="source-tag">Video Courses</span>
                        </div>
                    </div>

                    {/* Marco Bucci */}
                    <div className="resource-card" onClick={() => openResource("https://www.youtube.com/user/marcobucci")}>
                        <div className="resource-thumbnail" style={{ backgroundImage: "url('/images/tags/impressionism.jpg')" }}>
                            <div className="resource-overlay">
                                <PlayCircle size={48} color="white" />
                            </div>
                        </div>
                        <div className="resource-info">
                            <h3>Marco Bucci</h3>
                            <p>Expert logic on color theory, shape design, and painting.</p>
                            <span className="source-tag">YouTube</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* INSPIRATION & REFERENCE */}
            <div className="resources-section">
                <h2 className="section-header">
                    <BookOpen size={24} className="section-icon" /> Inspiration & Reference
                </h2>
                <div className="resource-grid">
                    {/* Sketchfab */}
                    <div className="resource-card" onClick={() => openResource("https://sketchfab.com/tags/anatomy")}>
                        <div className="resource-thumbnail" style={{ backgroundImage: "url('/images/tags/hyperrealism.jpg')" }}>
                            <div className="resource-overlay">
                                <BookOpen size={48} color="white" />
                            </div>
                        </div>
                        <div className="resource-info">
                            <h3>Sketchfab</h3>
                            <p>Interactive 3D models for understanding form and volume.</p>
                            <span className="source-tag">3D Reference</span>
                        </div>
                    </div>

                    {/* ArtStation */}
                    <div className="resource-card" onClick={() => openResource("https://www.artstation.com/")}>
                        <div className="resource-thumbnail" style={{ backgroundImage: "url('/images/tags/sci-fi art.jpg')" }}>
                            <div className="resource-overlay">
                                <BookOpen size={48} color="white" />
                            </div>
                        </div>
                        <div className="resource-info">
                            <h3>ArtStation</h3>
                            <p>The standard for industry artwork and professional portfolios.</p>
                            <span className="source-tag">Industry Standard</span>
                        </div>
                    </div>

                    {/* Google Arts & Culture */}
                    <div className="resource-card" onClick={() => openResource("https://artsandculture.google.com/")}>
                        <div className="resource-thumbnail" style={{ backgroundImage: "url('/images/tags/art nouveau.jpg')" }}>
                            <div className="resource-overlay">
                                <BookOpen size={48} color="white" />
                            </div>
                        </div>
                        <div className="resource-info">
                            <h3>Google Arts & Culture</h3>
                            <p>High-resolution scans of classic masterpieces for study.</p>
                            <span className="source-tag">Master Study</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Learn;
