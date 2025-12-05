import { useState, useEffect } from 'react';
import { usePopup } from '../context/PopupContext';
import { getArtistById } from '../api/artistApi';

export const useAppNavigation = () => {
    const { showAlert } = usePopup();
    const [activePage, setActivePage] = useState(() => {
        const savedArtist = localStorage.getItem("currentArtist");
        if (savedArtist && savedArtist !== "undefined") {
            const path = window.location.pathname;
            const validHomeRoutes = ["/home", "/blogs", "/upload-blog", "/upload-artwork", "/explore", "/profile", "/settings"];
            if (validHomeRoutes.some(route => path.startsWith(route))) {
                return "home";
            }
            return "home";
        }
        const path = window.location.pathname;
        if (path === "/" || path === "/signin") return "signin";
        if (path === "/register" || path === "/interests") return "register";
        return "signin";
    });

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

    const [pendingRegistrationData, setPendingRegistrationData] = useState(null);

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

    useEffect(() => {
        const path = window.location.pathname;
        if (!currentArtist && (path === "/" || path === "/signin")) {
            if (path === "/") window.history.replaceState({}, "", "/signin");
            setActivePage("signin");
        } else if (currentArtist && (path === "/" || path === "/signin")) {
            window.history.replaceState({}, "", "/home");
            setActivePage("home");
        }
    }, [currentArtist]);

    const handleRegisterSuccess = (artist, formData) => {
        setCurrentArtistId(artist.artistId);
        setCurrentArtist(artist);
        setPendingRegistrationData(formData);
        window.history.pushState({}, "", "/interests");
        setActivePage("interests");
    };

    const handleInterestComplete = () => {
        if (currentArtist) {
            localStorage.setItem("currentArtistId", JSON.stringify(currentArtist.artistId));
            const artistToSave = { ...currentArtist, profileImage: null };
            localStorage.setItem("currentArtist", JSON.stringify(artistToSave));
        }
        setPendingRegistrationData(null);
        window.history.pushState({}, "", "/home");
        setActivePage("home");
    };

    const handleBackToRegister = () => {
        window.history.pushState({}, "", "/register");
        setActivePage("register");
    };

    const handleLoginSuccess = (artist) => {
        setCurrentArtistId(artist.artistId);
        setCurrentArtist(artist);
        localStorage.setItem("currentArtistId", JSON.stringify(artist.artistId));
        const artistToSave = { ...artist, profileImage: null };
        localStorage.setItem("currentArtist", JSON.stringify(artistToSave));
        window.history.pushState({}, "", "/home");
        setActivePage("home");
    };

    const handleLogout = () => {
        setCurrentArtistId(null);
        setCurrentArtist(null);
        localStorage.removeItem("currentArtistId");
        localStorage.removeItem("currentArtist");
        showAlert("Logged Out", "Successfully logged out!");
        window.history.pushState({}, "", "/signin");
        setActivePage("signin");
    };

    const handleProfileUpdate = (updatedArtist) => {
        setCurrentArtist(updatedArtist);
        const artistToSave = { ...updatedArtist, profileImage: null };
        localStorage.setItem("currentArtist", JSON.stringify(artistToSave));
    };

    return {
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
    };
};
