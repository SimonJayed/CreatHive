import React, { useState } from 'react';

function Settings() {
    const [darkMode, setDarkMode] = useState(true);
    const [pushNotifications, setPushNotifications] = useState(true);
    const [emailNotifications, setEmailNotifications] = useState(true);
    const [language, setLanguage] = useState('');

    const handlePasswordReset = () => {
        alert('Password reset link will be sent to your email');
    };

    const ToggleSwitch = ({ checked, onChange }) => (
        <div
            onClick={() => onChange(!checked)}
            style={{
                width: '50px',
                height: '26px',
                backgroundColor: checked ? '#FFB800' : '#ddd',
                borderRadius: '13px',
                position: 'relative',
                cursor: 'pointer',
                transition: 'background-color 0.2s'
            }}
        >
            <div style={{
                width: '22px',
                height: '22px',
                backgroundColor: 'white',
                borderRadius: '50%',
                position: 'absolute',
                top: '2px',
                left: checked ? '26px' : '2px',
                transition: 'left 0.2s'
            }} />
        </div>
    );

    return (
        <div style={{
            height: '100vh',
            padding: '60px 80px',
            backgroundColor: 'black',
            overflow: 'auto',
            boxSizing: 'border-box'
        }}>
            <h1 style={{ color: '#FFB800', fontSize: '32px', marginBottom: '24px', marginTop: 0 }}>Settings</h1>

            {/* Appearance Section */}
            <div style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                padding: '30px',
                marginBottom: '24px'
            }}>
                <h2 style={{ color: '#FFB800', fontSize: '24px', marginTop: 0, marginBottom: '20px' }}>
                    Appearance
                </h2>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h3 style={{ fontSize: '16px', marginBottom: '4px', marginTop: 0 }}>Dark Mode</h3>
                        <p style={{ fontSize: '14px', color: '#666', margin: 0 }}>
                            Toggle between light and dark theme
                        </p>
                    </div>
                    <ToggleSwitch checked={darkMode} onChange={setDarkMode} />
                </div>
            </div>

            {/* Notifications Section */}
            <div style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                padding: '30px',
                marginBottom: '24px'
            }}>
                <h2 style={{ color: '#FFB800', fontSize: '24px', marginTop: 0, marginBottom: '20px' }}>
                    Notifications
                </h2>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <div>
                        <h3 style={{ fontSize: '16px', marginBottom: '4px', marginTop: 0 }}>Push Notifications</h3>
                        <p style={{ fontSize: '14px', color: '#666', margin: 0 }}>
                            Receive notifications about your artworks and activities
                        </p>
                    </div>
                    <ToggleSwitch checked={pushNotifications} onChange={setPushNotifications} />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h3 style={{ fontSize: '16px', marginBottom: '4px', marginTop: 0 }}>Email Notifications</h3>
                        <p style={{ fontSize: '14px', color: '#666', margin: 0 }}>
                            Get updates and announcements via email
                        </p>
                    </div>
                    <ToggleSwitch checked={emailNotifications} onChange={setEmailNotifications} />
                </div>
            </div>

            {/* Language Preferences Section */}
            <div style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                padding: '30px',
                marginBottom: '24px'
            }}>
                <h2 style={{ color: '#FFB800', fontSize: '24px', marginTop: 0, marginBottom: '20px' }}>
                    Language Preferences
                </h2>
                <div>
                    <h3 style={{ fontSize: '16px', marginBottom: '8px', marginTop: 0 }}>Language</h3>
                    <select
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '12px',
                            borderRadius: '8px',
                            border: '1px solid #ddd',
                            fontSize: '14px',
                            backgroundColor: 'white',
                            cursor: 'pointer'
                        }}
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
            <div style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                padding: '30px'
            }}>
                <h2 style={{ color: '#FFB800', fontSize: '24px', marginTop: 0, marginBottom: '20px' }}>
                    Security
                </h2>
                <div>
                    <h3 style={{ fontSize: '16px', marginBottom: '4px', marginTop: 0 }}>Password Reset</h3>
                    <p style={{ fontSize: '14px', color: '#666', marginBottom: '16px' }}>
                        Request a password reset link via email
                    </p>
                    <button
                        onClick={handlePasswordReset}
                        style={{
                            backgroundColor: '#FFB800',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            padding: '10px 24px',
                            fontSize: '14px',
                            fontWeight: '600',
                            cursor: 'pointer'
                        }}
                    >
                        Reset Password
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Settings;
