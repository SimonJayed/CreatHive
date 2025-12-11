import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import '../../styles/ReportModal.css';
import { usePopup } from '../../context/PopupContext';

function ReportModal({ isOpen, onClose, reporterId, reportedItemId, itemType }) {
    const [reason, setReason] = useState('');
    const { showAlert } = usePopup();

    if (!isOpen) return null;

    const handleSubmit = async () => {
        if (!reason.trim()) {
            showAlert("Required", "Please provide a reason for the report.");
            return;
        }

        try {
            const reportData = {
                reporterId,
                reportedItemId,
                itemType, // ARTWORK, BLOG, USER
                reason
            };

            const response = await fetch('http://localhost:8080/reports', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(reportData)
            });

            if (response.ok) {
                showAlert("Report Submitted", "Thank you. Our moderators will review this content.");
                setReason('');
                onClose();
            } else {
                showAlert("Error", "Failed to submit report. Please try again.");
            }
        } catch (error) {
            console.error("Report error:", error);
            showAlert("Error", "Network error. Please try again.");
        }
    };

    const modalContent = (
        <div className="report-modal-overlay">
            <div className="report-modal-content" onClick={(e) => e.stopPropagation()}>
                <h2>Report Content</h2>
                <p>Help us understand why this content is inappropriate.</p>

                <textarea
                    className="report-reason-input"
                    placeholder="Describe the issue..."
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    rows={4}
                />

                <div className="report-modal-actions">
                    <button onClick={onClose} className="btn-cancel">Cancel</button>
                    <button onClick={handleSubmit} className="btn-submit-report">Submit Report</button>
                </div>
            </div>
        </div>
    );

    return ReactDOM.createPortal(modalContent, document.body);
}

export default ReportModal;
