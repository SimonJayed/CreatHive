import React, { useState, useEffect } from "react";
import BlogCRUD from "./components/blogs/BlogCRUD";
import TagCRUD from "./components/tags/TagCRUD";
import SignIn from "./components/auth/SignIn";
import Register from "./components/auth/Register";
import InterestPicker from "./components/auth/InterestPicker";
import Homepage from "./components/Homepage";

import { getArtistById } from "./api/artistApi";

function App() {
  const [activePage, setActivePage] = useState(() => {
    // Check if user is logged in
    const savedArtist = localStorage.getItem("currentArtist");
    if (savedArtist) {
      // If logged in, check if current path is a valid homepage route
      const path = window.location.pathname;
      const validHomeRoutes = ["/home", "/upload-blog", "/upload-artwork", "/explore", "/profile", "/settings"];
      if (validHomeRoutes.includes(path)) {
        return "home";
      }
      return "home"; // Default to home if path is unknown but logged in
    }
    // Default to signin if not logged in and on root
    const path = window.location.pathname;
    if (path === "/" || path === "/signin") return "signin";
    if (path === "/register") return "register";
    return "signin";
  });

  // Initialize state from localStorage if available
  const [currentArtistId, setCurrentArtistId] = useState(() => {
    const saved = localStorage.getItem("currentArtistId");
    return saved ? JSON.parse(saved) : null;
  });
  const [currentArtist, setCurrentArtist] = useState(() => {
    const saved = localStorage.getItem("currentArtist");
    return saved ? JSON.parse(saved) : null;
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

    // Store ID and sanitized artist (no image) in localStorage
    localStorage.setItem("currentArtistId", JSON.stringify(artist.artistId));
    const artistToSave = { ...artist, profileImage: null }; // Don't save image to localStorage
    localStorage.setItem("currentArtist", JSON.stringify(artistToSave));

    window.history.pushState({}, "", "/interests");
    setActivePage("interests");
  };

  const handleInterestComplete = () => {
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

  const buttonStyle = {
    padding: "10px 24px",
    backgroundColor: "#FFB800",
    color: "#ffffffff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "600",
    margin: "10px",
  };

  const backButtonStyle = {
    ...buttonStyle,
    backgroundColor: "transparent",
    border: "2px solid #FFB800",
    color: "#FFB800",
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
    <div
      style={{
        backgroundColor: "black",
        minHeight: "100vh",
        color: "#FFB800",
        padding: "20px",
        textAlign: "center",
      }}
    >
      {/* MENU PAGE */}
      {!activePage && (
        <div>
          <h1 style={{ color: "#FFB800" }}>CreatHive</h1>

          <button style={buttonStyle} onClick={() => setActivePage("blogs")}>
            Manage Blogs
          </button>

          <button style={buttonStyle} onClick={() => setActivePage("tags")}>
            Manage Tags
          </button>

          <button style={buttonStyle} onClick={() => {
            window.history.pushState({}, "", "/signin");
            setActivePage("signin");
          }}>
            Sign In
          </button>

          <button style={buttonStyle} onClick={() => {
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
          <button style={backButtonStyle} onClick={() => setActivePage(null)}>
            Back
          </button>
          <BlogCRUD />
        </>
      )}

      {/* TAG CRUD */}
      {activePage === "tags" && (
        <>
          <button style={backButtonStyle} onClick={() => setActivePage(null)}>
            Back
          </button>
          <TagCRUD />
        </>
      )}
    </div>
  );
}

export default App;
