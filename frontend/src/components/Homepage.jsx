import React, { useState } from 'react';
import UploadBlog from './UploadBlog';
import UploadArtwork from './UploadArtwork';
import Explore from './Explore';
import Profile from './Profile';
import Settings from './Settings';

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
    React.useEffect(() => {
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
                    <div style={{
                        height: '100vh',
                        overflowY: 'scroll',
                        scrollSnapType: 'y mandatory',
                        scrollBehavior: 'smooth',
                        WebkitOverflowScrolling: 'touch'
                    }}>
                        {/* CreatHive Title - Scrolls with content */}
                        <div style={{
                            position: 'absolute',
                            top: '30px',
                            left: '120px',
                            zIndex: 100,
                            color: '#FFB800',
                            fontSize: '28px',
                            fontWeight: 'bold'
                        }}>
                            CreatHive
                        </div>

                        {/* Section 1 - Hero */}
                        <div style={{
                            height: '100vh',
                            scrollSnapAlign: 'start',
                            scrollSnapStop: 'always',
                            display: 'flex',
                            alignItems: 'center',
                            padding: '0 80px',
                            gap: '60px',
                            backgroundColor: 'black'
                        }}>
                            {/* Left Side - Text */}
                            <div style={{
                                flex: 1,
                                background: 'linear-gradient(135deg, #FFB800 0%, #FF8C00 100%)',
                                padding: '60px 50px',
                                borderRadius: '20px',
                                color: 'white'
                            }}>
                                <h1 style={{
                                    fontSize: '48px',
                                    fontWeight: 'bold',
                                    marginBottom: '30px',
                                    lineHeight: '1.2'
                                }}>
                                    UNLEASH<br />
                                    YOUR<br />
                                    CREATIVE<br />
                                    POTENTIAL
                                </h1>
                                <p style={{
                                    fontSize: '14px',
                                    lineHeight: '1.6',
                                    opacity: 0.9
                                }}>
                                    Join a thriving community of student artists where creativity knows no bounds. Showcase your artwork to a wider audience, take part in exciting challenges that spark inspiration, collaborate with fellow creatives, and grow your skills while building a professional portfolio that reflects your unique artistic journey.
                                </p>
                            </div>

                            {/* Right Side - Image */}
                            <div style={{ flex: 1 }}>
                                <img
                                    src="https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800"
                                    alt="Artist at work"
                                    style={{
                                        width: '100%',
                                        borderRadius: '20px',
                                        objectFit: 'cover',
                                        height: '450px'
                                    }}
                                />
                            </div>
                        </div>

                        {/* Section 2 - Why CreatHive */}
                        <div style={{
                            height: '100vh',
                            scrollSnapAlign: 'start',
                            scrollSnapStop: 'always',
                            padding: '60px 80px',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            backgroundColor: 'black'
                        }}>
                            <h2 style={{
                                color: 'white',
                                fontSize: '24px',
                                marginBottom: '20px',
                                textAlign: 'center'
                            }}>
                                Why <span style={{ color: '#FFB800' }}>CreatHive?</span>
                            </h2>
                            <p style={{
                                color: '#FFB800',
                                maxWidth: '800px',
                                margin: '0 auto 50px',
                                lineHeight: '1.6',
                                textAlign: 'center'
                            }}>
                                CreativHive is a vibrant community platform where student artists can showcase their work, connect with fellow creatives, and collaborate on ideas. Like a hive buzzing with creativity, it provides a space for inspiration, growth, and meaningful artistic exchange.
                            </p>

                            {/* Feature Cards */}
                            <div style={{
                                display: 'flex',
                                gap: '40px',
                                justifyContent: 'center',
                                marginTop: '40px'
                            }}>
                                <div style={{ flex: '0 0 250px', textAlign: 'center' }}>
                                    <div style={{
                                        width: '80px',
                                        height: '80px',
                                        backgroundColor: '#FFB800',
                                        borderRadius: '16px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        margin: '0 auto 20px',
                                        fontSize: '36px'
                                    }}>
                                        🎨
                                    </div>
                                    <h3 style={{ color: '#FFB800', marginBottom: '12px', fontSize: '18px' }}>
                                        Showcase Your Work
                                    </h3>
                                    <p style={{ color: '#FFB800', fontSize: '14px', lineHeight: '1.5' }}>
                                        Upload and share your artwork with a global community of student artists. Get feedback and inspiration from peers.
                                    </p>
                                </div>

                                <div style={{ flex: '0 0 250px', textAlign: 'center' }}>
                                    <div style={{
                                        width: '80px',
                                        height: '80px',
                                        backgroundColor: '#FFB800',
                                        borderRadius: '16px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        margin: '0 auto 20px',
                                        fontSize: '36px'
                                    }}>
                                        ✏️
                                    </div>
                                    <h3 style={{ color: '#FFB800', marginBottom: '12px', fontSize: '18px' }}>
                                        Art Fights
                                    </h3>
                                    <p style={{ color: '#FFB800', fontSize: '14px', lineHeight: '1.5' }}>
                                        Participate in creative battles where you draw characters or styles created by other users. Win points and recognition!
                                    </p>
                                </div>

                                <div style={{ flex: '0 0 250px', textAlign: 'center' }}>
                                    <div style={{
                                        width: '80px',
                                        height: '80px',
                                        backgroundColor: '#FFB800',
                                        borderRadius: '16px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        margin: '0 auto 20px',
                                        fontSize: '36px'
                                    }}>
                                        🏆
                                    </div>
                                    <h3 style={{ color: '#FFB800', marginBottom: '12px', fontSize: '18px' }}>
                                        Learn & Grow
                                    </h3>
                                    <p style={{ color: '#FFB800', fontSize: '14px', lineHeight: '1.5' }}>
                                        Access tutorials, participate in challenges, and connect with mentors to improve your artistic skills.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 'upload-blog':
                return <UploadBlog />;
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

    const navButtonStyle = (tabName) => ({
        display: 'block',
        width: '100%',
        padding: '10px 24px',
        marginBottom: '10px',
        backgroundColor: activeTab === tabName ? '#FFB800' : 'transparent',
        color: activeTab === tabName ? 'black' : '#FFB800',
        border: 'none',
        borderRadius: '8px',
        textAlign: 'left',
        fontSize: '14px',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'all 0.2s',
    });

    return (
        <div style={{ display: 'flex', height: '100vh', backgroundColor: 'black', overflow: 'hidden' }}>
            {/* Sidebar */}
            <div style={{
                width: '80px',
                backgroundColor: 'black',
                borderRight: '1px solid #333',
                padding: '30px 0',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
            }}>
                {/* Logo */}
                <div style={{
                    width: '40px',
                    height: '40px',
                    backgroundColor: '#FFB800',
                    borderRadius: '8px',
                    marginBottom: '60px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '24px',
                    fontWeight: 'bold',
                    color: 'black'
                }}>
                    C
                </div>

                {/* Nav Icons */}
                <nav style={{ flex: 1, width: '100%', padding: '0 15px' }}>
                    <button
                        style={{
                            ...navButtonStyle('home'),
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '14px'
                        }}
                        onClick={() => setActiveTab('home')}
                        title="Home"
                    >
                        🏠
                    </button>
                    <button
                        style={{
                            ...navButtonStyle('upload-blog'),
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '14px'
                        }}
                        onClick={() => setActiveTab('upload-blog')}
                        title="Upload Blog"
                    >
                        📝
                    </button>
                    <button
                        style={{
                            ...navButtonStyle('explore'),
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '14px'
                        }}
                        onClick={() => setActiveTab('explore')}
                        title="Explore"
                    >
                        🔍
                    </button>
                    <button
                        style={{
                            ...navButtonStyle('upload-artwork'),
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '14px'
                        }}
                        onClick={() => setActiveTab('upload-artwork')}
                        title="Upload Artwork"
                    >
                        🖼️
                    </button>
                    <button
                        style={{
                            ...navButtonStyle('profile'),
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '14px'
                        }}
                        onClick={() => setActiveTab('profile')}
                        title="Profile"
                    >
                        👤
                    </button>
                    <button
                        style={{
                            ...navButtonStyle('settings'),
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '14px'
                        }}
                        onClick={() => setActiveTab('settings')}
                        title="Settings"
                    >
                        ⚙️
                    </button>
                </nav>

                {/* Logout Button */}
                <button
                    onClick={onLogout}
                    style={{
                        width: '50px',
                        height: '50px',
                        backgroundColor: 'transparent',
                        color: '#ff4444',
                        border: '1px solid #ff4444',
                        borderRadius: '8px',
                        fontSize: '20px',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        marginTop: 'auto'
                    }}
                    title="Logout"
                >
                    🚪
                </button>
            </div>

            {/* Main Content */}
            <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
                <div style={{ height: '100%', overflow: 'hidden' }}>
                    {renderContent()}
                </div>
            </div>
        </div>
    );
}

export default Homepage;
