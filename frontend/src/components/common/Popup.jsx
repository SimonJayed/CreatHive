import React from 'react';
import { usePopup } from '../../context/PopupContext';
import { AlertTriangle, Info, CheckCircle, HelpCircle } from 'lucide-react';
import '../../styles/Popup.css';

const Popup = () => {
    const { popupState, closePopup } = usePopup();
    const { isOpen, type, title, message, onConfirm, onCancel, confirmText, cancelText } = popupState;

    if (!isOpen) return null;

    const getIcon = () => {
        if (type === 'confirm') return <HelpCircle size={48} className="popup-icon" />;
        // Simple heuristic for alert types based on title/message content could be added here
        // For now, default to Info or AlertTriangle based on type
        return <Info size={48} className="popup-icon" />;
    };

    return (
        <div className="popup-overlay" onClick={closePopup}>
            <div className="popup-content" onClick={(e) => e.stopPropagation()}>
                <div className="popup-header">
                    {getIcon()}
                    <h3 className="popup-title">{title}</h3>
                </div>
                <div className="popup-message">{message}</div>
                <div className="popup-actions">
                    {type === 'confirm' && (
                        <button
                            className="button-hexagon popup-btn secondary"
                            onClick={onCancel || closePopup}
                        >
                            {cancelText}
                        </button>
                    )}
                    <button
                        className="button-hexagon popup-btn"
                        onClick={onConfirm || closePopup}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Popup;
