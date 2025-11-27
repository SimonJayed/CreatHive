import React from 'react';

function Sidebar({ activeTab, setActiveTab, onLogout }) {
    const navItems = [
        { id: 'home', icon: '🏠', title: 'Home' },
        { id: 'upload-blog', icon: '📝', title: 'Upload Blog' },
        { id: 'explore', icon: '🔍', title: 'Explore' },
        { id: 'upload-artwork', icon: '🖼️', title: 'Upload Artwork' },
        { id: 'profile', icon: '👤', title: 'Profile' },
        { id: 'settings', icon: '⚙️', title: 'Settings' }
    ];

    return (
        <div className="sidebar">
            {/* Logo */}
            <div className="sidebar-logo">C</div>

            {/* Nav Icons */}
            <nav className="sidebar-nav">
                {navItems.map(item => (
                    <button
                        key={item.id}
                        className={`nav-button ${activeTab === item.id ? 'active' : ''}`}
                        onClick={() => setActiveTab(item.id)}
                        title={item.title}
                    >
                        {item.icon}
                    </button>
                ))}
            </nav>

            {/* Logout Button */}
            <button
                onClick={onLogout}
                className="logout-button"
                title="Logout"
            >
                🚪
            </button>
        </div>
    );
}

export default Sidebar;
