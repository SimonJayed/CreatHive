import React, { useState } from "react";
import { login } from "../../api/artistApi";

function SignIn({ onLoginSuccess }) {
    const [formData, setFormData] = useState({
        username: "",
        password: "",
    });
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        try {
            const artist = await login(formData);
            if (onLoginSuccess) {
                onLoginSuccess(artist);
            }
        } catch (err) {
            setError("Invalid username or password");
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
                    Welcome Back!
                </h2>
                <p style={{
                    textAlign: 'center',
                    color: '#666',
                    fontSize: '14px',
                    marginBottom: '24px'
                }}>
                    Sign in to your account to continue!
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
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{
                            display: 'block',
                            marginBottom: '8px',
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
                            placeholder="Enter your username"
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
                            marginBottom: '8px',
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
                            placeholder="Enter your password"
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
                        Sign In
                    </button>
                </form>

                <div style={{
                    textAlign: 'center',
                    marginTop: '16px',
                    fontSize: '14px',
                    color: '#333'
                }}>
                    Don't have an account?{' '}
                    <span
                        onClick={() => {
                            window.history.pushState({}, "", "/register");
                            window.location.reload();
                        }}
                        style={{
                            color: '#FFB800',
                            cursor: 'pointer',
                            fontWeight: '600'
                        }}
                    >
                        Create one here
                    </span>
                </div>
            </div>
        </div>
    );
}

export default SignIn;
