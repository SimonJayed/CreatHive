import React from "react";
import BlogCRUD from "./blogs/BlogCRUD";
import TagCRUD from "./tags/TagCRUD";
import SignIn from "./auth/SignIn";
import Register from "./auth/Register";
import InterestPicker from "./auth/InterestPicker";
import Homepage from "./Homepage";
import { useAppNavigation } from "../hooks/useAppNavigation";

function MainContent() {
    const {
        activePage,
        setActivePage,
        currentArtist,
        currentArtistId,
        pendingRegistrationData,
        setPendingRegistrationData,
        handleRegisterSuccess,
        handleInterestComplete,
        handleBackToRegister,
        handleLoginSuccess,
        handleLogout,
        handleProfileUpdate
    } = useAppNavigation();

    if (activePage === "signin") {
        return <SignIn onLoginSuccess={handleLoginSuccess} />;
    }

    if (activePage === "register") {
        return (
            <Register
                onRegisterSuccess={handleRegisterSuccess}
                initialData={pendingRegistrationData}
                onClearPendingData={() => setPendingRegistrationData(null)}
            />
        );
    }

    if (activePage === "interests") {
        return (
            <InterestPicker
                artistId={currentArtistId}
                onComplete={handleInterestComplete}
                onBack={handleBackToRegister}
            />
        );
    }

    if (activePage === "home") {
        return <Homepage onLogout={handleLogout} artistData={currentArtist} onProfileUpdate={handleProfileUpdate} />;
    }

    return (
        <div className="app-container">
            {/* MENU PAGE */}
            {!activePage && (
                <div>
                    <h1 className="app-title">CreatHive</h1>

                    <button className="app-btn" onClick={() => setActivePage("blogs")}>
                        Manage Blogs
                    </button>

                    <button className="app-btn" onClick={() => setActivePage("tags")}>
                        Manage Tags
                    </button>

                    <button className="app-btn" onClick={() => {
                        window.history.pushState({}, "", "/signin");
                        setActivePage("signin");
                    }}>
                        Sign In
                    </button>

                    <button className="app-btn" onClick={() => {
                        window.history.pushState({}, "", "/register");
                        setActivePage("register");
                    }}>
                        Register
                    </button>
                </div>
            )}

            {/* BLOG CRUD */}
            {activePage === "blogs" && (
                <>
                    <button className="app-back-btn" onClick={() => setActivePage(null)}>
                        Back
                    </button>
                    <BlogCRUD />
                </>
            )}

            {/* TAG CRUD */}
            {activePage === "tags" && (
                <>
                    <button className="app-back-btn" onClick={() => setActivePage(null)}>
                        Back
                    </button>
                    <TagCRUD />
                </>
            )}
        </div>
    );
}

export default MainContent;
