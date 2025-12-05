import React, { useState, useEffect } from "react";
import { register } from "../../api/artistApi";
import '../../styles/Auth.css';

function Register({ onRegisterSuccess, initialData, onClearPendingData }) {
    const [formData, setFormData] = useState({
        name: "",
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [error, setError] = useState("");

    // Populate form with initial data if coming back from InterestPicker
    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        }
    }, [initialData]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
        // Clear pending data when user starts typing (indicates new registration attempt)
        if (initialData && onClearPendingData) {
            onClearPendingData();
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        try {
            // Create artist object (excluding confirmPassword)
            const artistData = {
                name: formData.name,
                username: formData.username,
                email: formData.email,
                password: formData.password,
                // Default values for other fields
                bio: "",
                interest: "",
            };

            const newArtist = await register(artistData);
            if (onRegisterSuccess) {
                // Pass both artist object and form data for persistence
                onRegisterSuccess(newArtist, formData);
            }
        } catch (err) {
            // Display specific error message from backend if available
            setError(err.message || "Registration failed. Please try again.");
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2 className="auth-title">
                    Create Account
                </h2>
                <p className="auth-subtitle">
                    Join our community of student artists
                </p>

                {error && (
                    <div className="auth-error">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">
                            Full Name
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Enter your full name"
                            className="form-input"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">
                            Username
                        </label>
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            placeholder="Choose a username"
                            className="form-input"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">
                            Email Address
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Enter your @gmail.com email"
                            className="form-input"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">
                            Password
                        </label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Create a password"
                            className="form-input"
                            required
                        />
                    </div>

                    <div className="form-group" style={{ marginBottom: '24px' }}>
                        <label className="form-label">
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            placeholder="Confirm your password"
                            className="form-input"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="button-hexagon auth-btn"
                    >
                        Create Account
                    </button>
                </form>

                <div className="auth-footer">
                    Already have an account?{' '}
                    <span
                        onClick={() => {
                            // Clear pending registration data before navigating to sign in
                            if (onClearPendingData) {
                                onClearPendingData();
                            }
                            window.history.pushState({}, "", "/signin");
                            window.location.reload();
                        }}
                        className="auth-link"
                    >
                        Sign in here
                    </span>
                </div>
            </div>
        </div>
    );
}

export default Register;
