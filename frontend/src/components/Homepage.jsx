import React, { useState, useEffect } from 'react';
import UploadBlog from './UploadBlog';
import UploadArtwork from './UploadArtwork';
import Explore from './Explore';
import Profile from './Profile';
import Settings from './Settings';
import Sidebar from './homepage/Sidebar';
import HeroSection from './homepage/HeroSection';
import FeaturesSection from './homepage/FeaturesSection';
import '../styles/Homepage.css';

function Homepage({ onLogout, artistData, onProfileUpdate }) {
    // Initialize activeTab from URL
    const [activeTab, setActiveTabState] = useState(() => {
        const path = window.location.pathname.substring(1); // remove leading slash
        const validTabs = ['home', 'upload-blog', 'explore', 'upload-artwork', 'profile', 'settings'];
        return validTabs.includes(path) ? path : 'home';
    });

    // Wrapper to update state and URL
    const setActiveTab = (tab) => {
        setActiveTabState(tab);
        window.history.pushState({}, "", `/${tab}`);
    };

    // Handle back/forward browser buttons
    useEffect(() => {
        const handlePopState = () => {
            const path = window.location.pathname.substring(1);
            const validTabs = ['home', 'upload-blog', 'explore', 'upload-artwork', 'profile', 'settings'];
            if (validTabs.includes(path)) {
                setActiveTabState(path);
            }
        };

        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, []);

    const renderContent = () => {
        switch (activeTab) {
            case 'home':
                return (
                    <div className="home-tab-container">
                        <div className="creathive-title">CreatHive</div>
                        <HeroSection />
                        <FeaturesSection />
                    </div>
                );
            case 'upload-blog':
                return <UploadBlog artistData={artistData} />;
            case 'explore':
                return <Explore />;
            case 'upload-artwork':
                return <UploadArtwork artistData={artistData} onNavigate={setActiveTab} />;
            case 'profile':
                return <Profile userData={artistData} onNavigate={setActiveTab} onProfileUpdate={onProfileUpdate} />;
            case 'settings':
                return <Settings />;
            default:
                return null;
        }
    };

    return (
        <div className="homepage-container">
            <Sidebar
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                onLogout={onLogout}
            />
            <div className="main-content-wrapper">
                <div className="content-scroll-container">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
}

export default Homepage;
