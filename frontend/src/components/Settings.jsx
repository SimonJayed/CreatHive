import React, { useState } from 'react';
import { usePopup } from '../context/PopupContext';
import '../styles/Settings.css';

function Settings() {
    const { showAlert } = usePopup();
    const [darkMode, setDarkMode] = useState(true);
    const [pushNotifications, setPushNotifications] = useState(true);
    const [emailNotifications, setEmailNotifications] = useState(true);
    const [language, setLanguage] = useState('');

    const handlePasswordReset = () => {
        showAlert("Password Reset", "Password reset link will be sent to your email");
    };

    const ToggleSwitch = ({ checked, onChange }) => (
        <div
            onClick={() => onChange(!checked)}
            className={`toggle-switch ${checked ? 'active' : ''}`}
        >
            <div className="toggle-knob" />
        </div>
    );

    return (
        <div className="settings-container">
            <h1 className="settings-title">Settings</h1>

            {/* Appearance Section */}
            <div className="settings-section">
                <h2 className="section-title">Appearance</h2>
                <div className="setting-item">
                    <div className="setting-info">
                        <h3 className="setting-name">Dark Mode</h3>
                        <p className="setting-description">
                            Toggle between light and dark theme
                        </p>
                    </div>
                    <ToggleSwitch checked={darkMode} onChange={setDarkMode} />
                </div>
            </div>

            {/* Notifications Section */}
            <div className="settings-section">
                <h2 className="section-title">Notifications</h2>

                <div className="setting-item">
                    <div className="setting-info">
                        <h3 className="setting-name">Push Notifications</h3>
                        <p className="setting-description">
                            Receive notifications about your artworks and activities
                        </p>
                    </div>
                    <ToggleSwitch checked={pushNotifications} onChange={setPushNotifications} />
                </div>

                <div className="setting-item">
                    <div className="setting-info">
                        <h3 className="setting-name">Email Notifications</h3>
                        <p className="setting-description">
                            Get updates and announcements via email
                        </p>
                    </div>
                    <ToggleSwitch checked={emailNotifications} onChange={setEmailNotifications} />
                </div>
            </div>

            {/* Language Preferences Section */}
            <div className="settings-section">
                <h2 className="section-title">Language Preferences</h2>
                <div>
                    <h3 className="setting-name">Language</h3>
                    <select
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        className="language-select"
                    >
                        <option value="">Select a language</option>
                        <option value="en">English</option>
                        <option value="es">Spanish</option>
                        <option value="fr">French</option>
                        <option value="de">German</option>
                        <option value="ja">Japanese</option>
                        <option value="ko">Korean</option>
                        <option value="zh">Chinese</option>
                    </select>
                </div>
            </div>

            {/* Security Section */}
            <div className="settings-section">
                <h2 className="section-title">Security</h2>
                <div>
                    <h3 className="setting-name">Password Reset</h3>
                    <p className="setting-description mb-4">
                        Request a password reset link via email
                    </p>
                    <button onClick={handlePasswordReset} className="btn-reset">
                        Reset Password
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Settings;
