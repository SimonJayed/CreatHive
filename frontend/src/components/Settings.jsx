import React, { useState } from 'react';
import { usePopup } from '../context/PopupContext';
import '../styles/Settings.css';

function Settings() {
    const { showAlert } = usePopup();

    const handlePasswordReset = () => {
        showAlert("Password Reset", "Password reset link will be sent to your email");
    };

    return (
        <div className="settings-container">
            <h1 className="settings-title">Settings</h1>

            {/* Security Section (Password Reset Only) */}
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
