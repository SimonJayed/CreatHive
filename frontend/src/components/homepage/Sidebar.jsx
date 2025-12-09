import React from 'react';
import { Home, MessageSquare, Search, Image, User, LogOut, Hexagon, BookOpen, Trophy, Shield } from 'lucide-react';
import './Sidebar.css';

const baseNavItems = [
    { id: 'home', icon: <Home size={20} />, title: 'Home' },
    { id: 'challenges', icon: <Trophy size={20} />, title: 'Challenges' },
    { id: 'blogs', icon: <MessageSquare size={20} />, title: 'Blog' },
    { id: 'explore', icon: <Search size={20} />, title: 'Explore' },
    { id: 'learning', icon: <BookOpen size={20} />, title: 'Learning' },
    { id: 'profile', icon: <User size={20} />, title: 'Profile' }
];

// Assuming currentUser/userRole is not passed directly, but maybe we can infer it or we need to pass it.
// Ideally Sidebar should receive the full user object or role.
// The previous prompt said "Update App.js / Sidebar.jsx". Sidebar receives onLogout.
// I will check if Sidebar receives artistData... wait, Step 1076 shows: function Sidebar({ activeTab, setActiveTab, onLogout })
// It does NOT receive artistData. I need to update it to receive artistData or role.
// For now, I will modify the component to accept `role`.

function Sidebar({ activeTab, setActiveTab, onLogout, role }) {
    const navItems = [...baseNavItems];

    if (role === 'MODERATOR' || role === 'ADMIN') {
        // Insert Moderation before Settings
        navItems.splice(navItems.length - 1, 0, { id: 'moderation', icon: <Shield size={20} />, title: 'Moderation' });
    }

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
