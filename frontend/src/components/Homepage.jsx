import React, { useState, useEffect } from 'react';
import BlogsFeed from './blogs/BlogsFeed';
import UploadBlog from './UploadBlog';
import UploadArtwork from './UploadArtwork';
import Explore from './Explore';
import Profile from './Profile';
import Settings from './Settings';
import PlaceholderPage from './common/PlaceholderPage'; // Import Placeholder
import Sidebar from './homepage/Sidebar';
import HeroSection from './homepage/HeroSection';
import FeaturesSection from './homepage/FeaturesSection';
import '../styles/Homepage.css';

function Homepage({ onLogout, artistData, onProfileUpdate }) {
    // Initialize activeTab from URL
    const [activeTab, setActiveTabState] = useState(() => {
        const path = window.location.pathname.substring(1);
        const parts = path.split('/');
        const mainTab = parts[0];
        const validTabs = ['home', 'blogs', 'upload-blog', 'explore', 'upload-artwork', 'profile', 'settings', 'ai-studio', 'learning']; // Added new tabs
        return validTabs.includes(mainTab) ? mainTab : 'home';
    });

    const [profileId, setProfileId] = useState(() => {
        const path = window.location.pathname;
        if (path.startsWith('/profile/')) {
            return path.split('/')[2];
        }
        return null;
    });

    // Navigation Data State
    const [navData, setNavData] = useState(null);

    // Wrapper to update state and URL
    const setActiveTab = (tab, data = null) => {
        setActiveTabState(tab);
        if (typeof data === 'object') {
            setNavData(data);
        } else {
            setNavData(null);
        }

        if (tab === 'profile' && typeof data === 'string') {
            // Support legacy ID passing for profile: setActiveTab('profile', '123')
            setProfileId(data);
            window.history.pushState({}, "", `/profile/${data}`);
        } else if (tab === 'profile' && data?.id) {
            setProfileId(data.id);
            window.history.pushState({}, "", `/profile/${data.id}`);
        } else {
            setProfileId(null);
            window.history.pushState({}, "", `/${tab}`);
        }
    };

    // Handle back/forward browser buttons
    useEffect(() => {
        const handlePopState = () => {
            const path = window.location.pathname.substring(1);
            const parts = path.split('/');
            const mainTab = parts[0];
            const validTabs = ['home', 'blogs', 'upload-blog', 'explore', 'upload-artwork', 'profile', 'settings', 'ai-studio', 'learning'];
            if (validTabs.includes(mainTab)) {
                setActiveTabState(mainTab);
                if (mainTab === 'profile' && parts[1]) {
                    setProfileId(parts[1]);
                } else {
                    setProfileId(null);
                }
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
            case 'blogs':
                return <BlogsFeed onNavigate={setActiveTab} currentUser={artistData} />;
            case 'upload-blog':
                return <UploadBlog artistData={artistData} onNavigate={setActiveTab} blogToEdit={navData?.blogToEdit} />;
            case 'explore':
                return <Explore currentUser={artistData} onNavigate={setActiveTab} />;
            case 'upload-artwork':
                return <UploadArtwork artistData={artistData} onNavigate={setActiveTab} />;
            case 'profile':
                return <Profile userData={artistData} onNavigate={setActiveTab} onProfileUpdate={onProfileUpdate} viewingArtistId={profileId} />;
            case 'settings':
                return <Settings />;
            case 'ai-studio':
                return (
                    <PlaceholderPage
                        title="AI Studio"
                        message="AI-Assisted Discovery and Personalized Recommendations are coming soon!"
                    />
                );
            case 'learning':
                return (
                    <PlaceholderPage
                        title="Learning Resources"
                        message="Interactive lessons, tutorials, and progress tracking are under development."
                    />
                );
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
