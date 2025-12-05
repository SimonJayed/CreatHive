import React, { createContext, useContext, useState, useCallback } from 'react';

const PopupContext = createContext();

export const usePopup = () => {
    const context = useContext(PopupContext);
    if (!context) {
        throw new Error('usePopup must be used within a PopupProvider');
    }
    return context;
};

export const PopupProvider = ({ children }) => {
    const [popupState, setPopupState] = useState({
        isOpen: false,
        type: 'alert', // 'alert' or 'confirm'
        title: '',
        message: '',
        onConfirm: null,
        onCancel: null,
        confirmText: 'OK',
        cancelText: 'Cancel'
    });

    const closePopup = useCallback(() => {
        setPopupState(prev => ({ ...prev, isOpen: false }));
    }, []);

    const showAlert = useCallback((title, message, onConfirm = null) => {
        setPopupState({
            isOpen: true,
            type: 'alert',
            title,
            message,
            onConfirm: () => {
                if (onConfirm) onConfirm();
                closePopup();
            },
            onCancel: null,
            confirmText: 'OK',
            cancelText: null
        });
    }, [closePopup]);

    const showConfirm = useCallback((title, message, onConfirm, onCancel = null, confirmText = 'Yes', cancelText = 'No') => {
        setPopupState({
            isOpen: true,
            type: 'confirm',
            title,
            message,
            onConfirm: () => {
                if (onConfirm) onConfirm();
                closePopup();
            },
            onCancel: () => {
                if (onCancel) onCancel();
                closePopup();
            },
            confirmText,
            cancelText
        });
    }, [closePopup]);

    return (
        <PopupContext.Provider value={{ popupState, closePopup, showAlert, showConfirm }}>
            {children}
        </PopupContext.Provider>
    );
};
