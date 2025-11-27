import React, { useState, useEffect } from "react";
import { register } from "../../api/artistApi";

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
            setError("Registration failed. Please try again.");
        }
    };

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            backgroundColor: 'white'
        }}>
            <div style={{
                backgroundColor: 'white',
                padding: '40px',
                borderRadius: '8px',
                boxShadow: '0 4px 20px rgba(255, 184, 0, 0.3)',
                width: '100%',
                maxWidth: '400px',
                border: '2px solid #FFB800'
            }}>
                <h2 style={{
                    color: '#FFB800',
                    textAlign: 'center',
                    marginBottom: '8px',
                    fontSize: '24px',
                    fontWeight: 'bold'
                }}>
                    Create Account
                </h2>
                <p style={{
                    textAlign: 'center',
                    color: '#666',
                    fontSize: '14px',
                    marginBottom: '24px'
                }}>
                    Join our community of student artists
                </p>

                {error && (
                    <div style={{
                        backgroundColor: '#ffebee',
                        color: '#c62828',
                        padding: '10px',
                        borderRadius: '4px',
                        marginBottom: '16px',
                        textAlign: 'center',
                        fontSize: '14px'
                    }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '16px' }}>
                        <label style={{
                            display: 'block',
                            marginBottom: '6px',
                            color: '#333',
                            fontWeight: '600',
                            fontSize: '14px'
                        }}>
                            Full Name
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Enter your full name"
                            style={{
                                width: '100%',
                                padding: '10px 12px',
                                borderRadius: '4px',
                                border: '1px solid #ddd',
                                fontSize: '14px',
                                boxSizing: 'border-box'
                            }}
                            required
                        />
                    </div>

                    <div style={{ marginBottom: '16px' }}>
                        <label style={{
                            display: 'block',
                            marginBottom: '6px',
                            color: '#333',
                            fontWeight: '600',
                            fontSize: '14px'
                        }}>
                            Username
                        </label>
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            placeholder="Choose a username"
                            style={{
                                width: '100%',
                                padding: '10px 12px',
                                borderRadius: '4px',
                                border: '1px solid #ddd',
                                fontSize: '14px',
                                boxSizing: 'border-box'
                            }}
                            required
                        />
                    </div>

                    <div style={{ marginBottom: '16px' }}>
                        <label style={{
                            display: 'block',
                            marginBottom: '6px',
                            color: '#333',
                            fontWeight: '600',
                            fontSize: '14px'
                        }}>
                            Email Address
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Enter your @gmail.com email"
                            style={{
                                width: '100%',
                                padding: '10px 12px',
                                borderRadius: '4px',
                                border: '1px solid #ddd',
                                fontSize: '14px',
                                boxSizing: 'border-box'
                            }}
                            required
                        />
                    </div>

                    <div style={{ marginBottom: '16px' }}>
                        <label style={{
                            display: 'block',
                            marginBottom: '6px',
                            color: '#333',
                            fontWeight: '600',
                            fontSize: '14px'
                        }}>
                            Password
                        </label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Create a password"
                            style={{
                                width: '100%',
                                padding: '10px 12px',
                                borderRadius: '4px',
                                border: '1px solid #ddd',
                                fontSize: '14px',
                                boxSizing: 'border-box'
                            }}
                            required
                        />
                    </div>

                    <div style={{ marginBottom: '24px' }}>
                        <label style={{
                            display: 'block',
                            marginBottom: '6px',
                            color: '#333',
                            fontWeight: '600',
                            fontSize: '14px'
                        }}>
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            placeholder="Confirm your password"
                            style={{
                                width: '100%',
                                padding: '10px 12px',
                                borderRadius: '4px',
                                border: '1px solid #ddd',
                                fontSize: '14px',
                                boxSizing: 'border-box'
                            }}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        style={{
                            width: '100%',
                            padding: '12px',
                            backgroundColor: '#FFB800',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            fontSize: '16px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            transition: 'background-color 0.2s'
                        }}
                    >
                        Create Account
                    </button>
                </form>

                <div style={{
                    textAlign: 'center',
                    marginTop: '16px',
                    fontSize: '14px',
                    color: '#333'
                }}>
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
                        style={{
                            color: '#FFB800',
                            cursor: 'pointer',
                            fontWeight: '600'
                        }}
                    >
                        Sign in here
                    </span>
                </div>
            </div>
        </div>
    );
}

export default Register;
