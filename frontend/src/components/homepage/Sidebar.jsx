import React from 'react';
import { FaHome, FaCommentDots, FaSearch, FaImages, FaUser, FaCog, FaSignOutAlt, FaPalette } from 'react-icons/fa';
import './Sidebar.css';

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
        <div className="sidebar">
            {/* Logo */}
            <div className="sidebar-logo">
                <FaPalette size={40} color="#FFB800" className="icon" />
                <h1>CreatHive</h1>
            </div>

            {/* Nav Icons */}
            <nav className="sidebar-nav">
                {navItems.map(item => (
                    <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        className={`sidebar-item ${activeTab === item.id ? 'active' : ''}`}
                    >
                        <span style={{ fontSize: '20px' }} className="icon">{item.icon}</span>
                        <span>{item.title}</span>
                    </button>
                ))}
            </nav>

            {/* Logout Button */}
            <div className="sidebar-footer">
                <button
                    onClick={onLogout}
                    className="sidebar-item"
                >
                    <FaSignOutAlt size={20} className="icon" />
                    <span>Logout</span>
                </button>
            </div>
        </div>
    );
}

export default Sidebar;
