import React, { useState, useEffect } from "react";
import BlogCRUD from "./components/blogs/BlogCRUD";
import TagCRUD from "./components/tags/TagCRUD";
import SignIn from "./components/auth/SignIn";
import Register from "./components/auth/Register";
import InterestPicker from "./components/auth/InterestPicker";
import Homepage from "./components/Homepage";
import './App.css';

import { getArtistById } from "./api/artistApi";

function App() {
  const [activePage, setActivePage] = useState(() => {
    // Check if user is logged in
    const savedArtist = localStorage.getItem("currentArtist");
    if (savedArtist && savedArtist !== "undefined") {
      // If logged in, check if current path is a valid homepage route
      const path = window.location.pathname;
      const validHomeRoutes = ["/home", "/blogs", "/upload-blog", "/upload-artwork", "/explore", "/profile", "/settings"];
      if (validHomeRoutes.includes(path)) {
        return "home";
      }
      return "home"; // Default to home if path is unknown but logged in
    }
    // Default to signin if not logged in and on root
    const path = window.location.pathname;
    if (path === "/" || path === "/signin") return "signin";
    if (path === "/register" || path === "/interests") return "register";
    return "signin";
  });

  // Initialize state from localStorage if available
  const [currentArtistId, setCurrentArtistId] = useState(() => {
    const saved = localStorage.getItem("currentArtistId");
    if (!saved || saved === "undefined") return null;
    try {
      return JSON.parse(saved);
    } catch (e) {
      return null;
    }
  });
  const [currentArtist, setCurrentArtist] = useState(() => {
    const saved = localStorage.getItem("currentArtist");
    if (!saved || saved === "undefined") return null;
    try {
      return JSON.parse(saved);
    } catch (e) {
      return null;
    }
  });

  // State for persisting registration form data when navigating to InterestPicker
  const [pendingRegistrationData, setPendingRegistrationData] = useState(null);

  // Fetch full artist data on load to get the profile image without bloating localStorage
  useEffect(() => {
    const fetchArtistData = async () => {
      if (currentArtistId) {
        try {
          const artistData = await getArtistById(currentArtistId);
          if (artistData) {
            setCurrentArtist(artistData);
          }
        } catch (error) {
          console.error("Failed to fetch artist data on load", error);
        }
      }
    };
    fetchArtistData();
  }, [currentArtistId]);

  // Simple routing check on load
  useEffect(() => {
    const path = window.location.pathname;
    // Only redirect if not logged in
    if (!currentArtist && (path === "/" || path === "/signin")) {
      if (path === "/") window.history.replaceState({}, "", "/signin");
      setActivePage("signin");
    } else if (currentArtist && (path === "/" || path === "/signin")) {
      // Redirect to home if logged in and trying to access signin
      window.history.replaceState({}, "", "/home");
      setActivePage("home");
    }
  }, [currentArtist]);

  const handleRegisterSuccess = (artist, formData) => {
    // Store both ID and full artist data in state
    setCurrentArtistId(artist.artistId);
    setCurrentArtist(artist);

    // Store registration form data for potential back navigation
    setPendingRegistrationData(formData);

    // NOTE: We do NOT save to localStorage yet. We wait until InterestPicker is done.
    // This prevents "logging in" if the user refreshes during the interest step.

    window.history.pushState({}, "", "/interests");
    setActivePage("interests");
  };

  const handleInterestComplete = () => {
    // Save to localStorage now that the flow is complete
    if (currentArtist) {
      localStorage.setItem("currentArtistId", JSON.stringify(currentArtist.artistId));
      const artistToSave = { ...currentArtist, profileImage: null }; // Don't save image to localStorage
      localStorage.setItem("currentArtist", JSON.stringify(artistToSave));
    }

    // Clear pending registration data after successful completion
    setPendingRegistrationData(null);
    window.history.pushState({}, "", "/home");
    setActivePage("home");
  };

  const handleBackToRegister = () => {
    // Navigate back to register page (data will persist via pendingRegistrationData)
    window.history.pushState({}, "", "/register");
    setActivePage("register");
  };

  const handleLoginSuccess = (artist) => {
    // Store full artist data in state
    setCurrentArtistId(artist.artistId);
    setCurrentArtist(artist);

    // Store ID and sanitized artist (no image) in localStorage
    localStorage.setItem("currentArtistId", JSON.stringify(artist.artistId));
    const artistToSave = { ...artist, profileImage: null }; // Don't save image to localStorage
    localStorage.setItem("currentArtist", JSON.stringify(artistToSave));

    window.history.pushState({}, "", "/home");
    setActivePage("home");
  };

  const handleLogout = () => {
    // Clear artist data on logout (per System.md)
    setCurrentArtistId(null);
    setCurrentArtist(null);
    localStorage.removeItem("currentArtistId");
    localStorage.removeItem("currentArtist");
    alert("Successfully logged out!");
    window.history.pushState({}, "", "/signin");
    setActivePage("signin");
  };

  const handleProfileUpdate = (updatedArtist) => {
    // Update state with full data (including new image)
    setCurrentArtist(updatedArtist);

    // Update localStorage with sanitized data
    const artistToSave = { ...updatedArtist, profileImage: null };
    localStorage.setItem("currentArtist", JSON.stringify(artistToSave));
  };

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

export default App;
