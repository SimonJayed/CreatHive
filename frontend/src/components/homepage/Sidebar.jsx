import React from 'react';
import { FaHome, FaCommentDots, FaSearch, FaImages, FaUser, FaCog, FaSignOutAlt, FaPalette } from 'react-icons/fa';

function Sidebar({ activeTab, setActiveTab, onLogout }) {
    const navItems = [
        { id: 'home', icon: <FaHome />, title: 'Home' },
        { id: 'blogs', icon: <FaCommentDots />, title: 'Blog' },
        { id: 'explore', icon: <FaSearch />, title: 'Explore' },
        { id: 'artworks', icon: <FaImages />, title: 'Artworks' },
        { id: 'profile', icon: <FaUser />, title: 'Profile' },
        { id: 'settings', icon: <FaCog />, title: 'Settings' }
    ];

    return (
        <div className="sidebar" style={{
            width: '250px',
            height: '100vh',
            backgroundColor: 'black',
            display: 'flex',
            flexDirection: 'column',
            padding: '40px 20px',
            position: 'fixed',
            left: 0,
            top: 0,
            color: '#FFB800',
            boxSizing: 'border-box',
            zIndex: 1000,
            borderRight: '1px solid #FFB800'
        }}>
            {/* Logo */}
            <div className="sidebar-logo" style={{
                marginBottom: '60px',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '10px'
            }}>
                <FaPalette size={40} color="#FFB800" />
                <h1 style={{
                    margin: 0,
                    fontSize: '24px',
                    fontWeight: 'bold',
                    color: '#FFB800',
                    letterSpacing: '1px'
                }}>CreatHive</h1>
            </div>

            {/* Nav Icons */}
            <nav className="sidebar-nav" style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '20px',
                flex: 1
            }}>
                {navItems.map(item => (
                    <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '16px',
                            background: 'none',
                            border: 'none',
                            color: activeTab === item.id ? '#FFB800' : '#FFB800',
                            fontSize: '16px',
                            cursor: 'pointer',
                            padding: '10px 16px',
                            borderRadius: '8px',
                            transition: 'background-color 0.2s',
                            textAlign: 'left',
                            fontWeight: activeTab === item.id ? 'bold' : 'normal',
                            opacity: activeTab === item.id ? 1 : 0.8
                        }}
                        onMouseEnter={(e) => e.target.style.opacity = 1}
                        onMouseLeave={(e) => { if (activeTab !== item.id) e.target.style.opacity = 0.8 }}
                    >
                        <span style={{ fontSize: '20px' }}>{item.icon}</span>
                        <span>{item.title}</span>
                    </button>
                ))}
            </nav>

            {/* Logout Button */}
            <button
                onClick={onLogout}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    background: 'none',
                    border: 'none',
                    color: '#FFB800',
                    fontSize: '16px',
                    cursor: 'pointer',
                    padding: '10px 16px',
                    marginTop: 'auto',
                    opacity: 0.8
                }}
            >
                <FaSignOutAlt size={20} />
                <span>Logout</span>
            </button>
        </div>
    );
}

export default Sidebar;
