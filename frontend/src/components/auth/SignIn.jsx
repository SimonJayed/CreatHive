import React, { useState } from "react";
import { login } from "../../api/artistApi";
import '../../styles/Auth.css';

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
        <div className="auth-container">
            <div className="auth-card">
                <h2 className="auth-title">
                    Welcome Back!
                </h2>
                <p className="auth-subtitle">
                    Sign in to your account to continue!
                </p>

                {error && (
                    <div className="auth-error">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">
                            Username
                        </label>
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            placeholder="Enter your username"
                            className="form-input"
                            required
                        />
                    </div>

                    <div className="form-group" style={{ marginBottom: '24px' }}>
                        <label className="form-label">
                            Password
                        </label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Enter your password"
                            className="form-input"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="auth-btn"
                    >
                        Sign In
                    </button>
                </form>

                <div className="auth-footer">
                    Don't have an account?{' '}
                    <span
                        onClick={() => {
                            window.history.pushState({}, "", "/register");
                            window.location.reload();
                        }}
                        className="auth-link"
                    >
                        Create one here
                    </span>
                </div>
            </div>
        </div>
    );
}

export default SignIn;
