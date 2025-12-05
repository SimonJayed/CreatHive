import React from 'react';
import { Home, MessageSquare, Search, Image, User, Settings, LogOut, Hexagon } from 'lucide-react';
import './Sidebar.css';

function Sidebar({ activeTab, setActiveTab, onLogout }) {
    const navItems = [
        { id: 'home', icon: <Home size={20} />, title: 'Home' },
        { id: 'blogs', icon: <MessageSquare size={20} />, title: 'Blog' },
        { id: 'explore', icon: <Search size={20} />, title: 'Explore' },
        { id: 'artworks', icon: <Image size={20} />, title: 'Artworks' },
        { id: 'profile', icon: <User size={20} />, title: 'Profile' },
        { id: 'settings', icon: <Settings size={20} />, title: 'Settings' }
    ];

    return (
        <div className="sidebar">
            {/* Logo */}
            <div className="sidebar-logo">
                <Hexagon size={40} color="#FFB800" fill="#FFB800" fillOpacity={0.2} strokeWidth={2} className="icon-hexagon" />
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
                        <span className="icon-hexagon">{item.icon}</span>
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
                    <LogOut size={20} className="icon-hexagon" />
                    <span>Logout</span>
                </button>
            </div>
        </div>
    );
}

export default Sidebar;
