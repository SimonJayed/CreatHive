import React, { useState, useEffect } from 'react';
import { Menu } from 'lucide-react';
import BlogsFeed from './blogs/BlogsFeed';
import BlogDetails from './blogs/BlogDetails';
import UploadBlog from './UploadBlog';
import UploadArtwork from './UploadArtwork';
import Explore from './Explore';
import Profile from './Profile';
import ArtworkDetails from './artworks/ArtworkDetails';

import Sidebar from './homepage/Sidebar';
import HeroSection from './homepage/HeroSection';
import FeaturesSection from './homepage/FeaturesSection';
import Challenges from './challenges/Challenges';
import Learn from './learn/Learn';
import ModeratorDashboard from './moderation/ModeratorDashboard';
import '../styles/Homepage.css';

function Homepage({ onLogout, artistData, onProfileUpdate }) {
    // ...

    const [activeTab, setActiveTabState] = useState(() => {
        const path = window.location.pathname.substring(1);
        const parts = path.split('/');
        const mainTab = parts[0];
        const validTabs = ['home', 'blogs', 'blog', 'upload-blog', 'explore', 'upload-artwork', 'profile', 'learning', 'challenges', 'moderation', 'artwork'];
        return validTabs.includes(mainTab) ? mainTab : 'home';
    });

    const [profileId, setProfileId] = useState(() => {
        const path = window.location.pathname;
        if (path.startsWith('/profile/')) {
            return path.split('/')[2];
        }
        return null;
    });

    const [artworkId, setArtworkId] = useState(() => {
        const path = window.location.pathname;
        if (path.startsWith('/artwork/')) {
            return path.split('/')[2];
        }
        return null;
    });

    const [blogId, setBlogId] = useState(() => {
        const path = window.location.pathname;
        if (path.startsWith('/blog/')) {
            return path.split('/')[2];
        }
        return null;
    });

    const [navData, setNavData] = useState(null);

    const setActiveTab = (tab, data = null) => {
        setActiveTabState(tab);
        if (typeof data === 'object') {
            setNavData(data);
        } else {
            setNavData(null);
        }

        if (tab === 'profile' && (typeof data === 'string' || typeof data === 'number')) {
            setProfileId(data);
            window.history.pushState({}, "", `/profile/${data}`);
        } else if (tab === 'profile' && data?.id) {
            setProfileId(data.id);
            window.history.pushState({}, "", `/profile/${data.id}`);
        } else if (tab === 'artwork' && (typeof data === 'string' || typeof data === 'number')) {
            // support setActiveTab('artwork', '123') or 123
            setArtworkId(data);
            window.history.pushState({}, "", `/artwork/${data}`);
        } else if (tab === 'artwork' && data?.id) {
            setArtworkId(data.id);
            window.history.pushState({}, "", `/artwork/${data.id}`);
        } else if (tab === 'blog' && (typeof data === 'string' || typeof data === 'number')) {
            setBlogId(data);
            window.history.pushState({}, "", `/blog/${data}`);
        } else if (tab === 'blog' && data?.id) {
            setBlogId(data.id);
            window.history.pushState({}, "", `/blog/${data.id}`);
        } else {
            setProfileId(null);
            setArtworkId(null);
            setBlogId(null);
            window.history.pushState({}, "", `/${tab}`);
        }
    };

    useEffect(() => {
        const handlePopState = () => {
            const path = window.location.pathname.substring(1);
            const parts = path.split('/');
            const mainTab = parts[0];
            const validTabs = ['home', 'blogs', 'blog', 'upload-blog', 'explore', 'upload-artwork', 'profile', 'learning', 'challenges', 'moderation', 'artwork'];
            if (validTabs.includes(mainTab)) {
                setActiveTabState(mainTab);
                if (mainTab === 'profile' && parts[1]) {
                    setProfileId(parts[1]);
                } else if (mainTab === 'artwork' && parts[1]) {
                    setArtworkId(parts[1]);
                } else if (mainTab === 'blog' && parts[1]) {
                    setBlogId(parts[1]);
                } else {
                    setProfileId(null);
                    setArtworkId(null);
                    setBlogId(null);
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
                return <BlogsFeed onNavigate={setActiveTab} currentUser={artistData} initialData={navData} />;
            case 'blog':
                return <BlogDetails blogId={blogId} currentUser={artistData} onNavigate={setActiveTab} />;
            case 'upload-blog':
                return <UploadBlog artistData={artistData} onNavigate={setActiveTab} blogToEdit={navData?.blogToEdit} />;
            case 'explore':
                return <Explore currentUser={artistData} onNavigate={setActiveTab} initialData={navData} />;
            case 'upload-artwork':
                return (
                    <UploadArtwork
                        artistData={artistData}
                        onNavigate={setActiveTab}
                        challengeId={navData?.challengeId}
                        challengeTheme={navData?.theme}
                        requiredTag={navData?.requiredTag}
                    />
                );
            case 'profile':
                return <Profile userData={artistData} onNavigate={setActiveTab} onProfileUpdate={onProfileUpdate} viewingArtistId={profileId} />;
            case 'artwork':
                return <ArtworkDetails artworkId={artworkId} currentUser={artistData} onNavigate={setActiveTab} />;
            case 'challenges':
                return <Challenges currentUser={artistData} onNavigate={setActiveTab} />;
            case 'learning':
                return <Learn />;
            case 'moderation':
                return <ModeratorDashboard currentUser={artistData} />;
        }
    };

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    return (
        <div className="homepage-container">
            <Sidebar
                activeTab={activeTab}
                setActiveTab={(tab, data) => {
                    setActiveTab(tab, data);
                    setIsSidebarOpen(false); // Close sidebar on nav
                }}
                onLogout={onLogout}
                role={artistData?.role}
                mobileOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
            />
            <div className="main-content-wrapper">
                {/* Mobile Menu Button */}
                <button
                    className="mobile-menu-btn"
                    onClick={toggleSidebar}
                    aria-label="Toggle Menu"
                >
                    <Menu size={24} />
                </button>

                <div className="content-scroll-container">
                    {renderContent()}
                </div>
            </div>

            {/* Overlay for mobile sidebar */}
            {isSidebarOpen && (
                <div
                    className="sidebar-overlay"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}
        </div>
    );
}

export default Homepage;
