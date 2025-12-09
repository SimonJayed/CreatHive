import React, { useState, useEffect } from 'react';
import '../../styles/ModeratorDashboard.css';
import { Shield, Check, X, Filter } from 'lucide-react';
import { usePopup } from '../../context/PopupContext';

function ModeratorDashboard({ currentUser }) {
    const [reports, setReports] = useState([]);
    const [filter, setFilter] = useState('PENDING'); // PENDING, RESOLVED, DISMISSED, ALL
    const { showAlert } = usePopup();

    useEffect(() => {
        fetchReports();
    }, []);

    const fetchReports = async () => {
        try {
            const response = await fetch('http://localhost:8080/reports');
            if (response.ok) {
                const data = await response.json();
                // Sort by new first
                setReports(data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)));
            }
        } catch (error) {
            console.error("Failed to fetch reports:", error);
        }
    };

    const handleAction = async (reportId, newStatus) => {
        try {
            const response = await fetch(`http://localhost:8080/reports/${reportId}/status`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newStatus)
            });

            if (response.ok) {
                // Update local state
                setReports(prev => prev.map(r => r.reportId === reportId ? { ...r, status: newStatus } : r));
                showAlert("Success", "Report status updated.");
            }
        } catch (error) {
            showAlert("Error", "Failed to update report.");
        }
    };

    const filteredReports = filter === 'ALL'
        ? reports
        : reports.filter(r => r.status === filter);

    if (currentUser?.role !== 'MODERATOR' && currentUser?.role !== 'ADMIN') {
        return <div className="mod-dashboard-denied">Access Denied. Moderator privileges required.</div>;
    }

    return (
        <div className="mod-dashboard">
            <div className="mod-header">
                <h1><Shield size={32} /> Moderator Dashboard</h1>
                <div className="mod-stats">
                    <span>Pending: {reports.filter(r => r.status === 'PENDING').length}</span>
                </div>
            </div>

            <div className="mod-filters">
                <button className={filter === 'PENDING' ? 'active' : ''} onClick={() => setFilter('PENDING')}>Pending</button>
                <button className={filter === 'RESOLVED' ? 'active' : ''} onClick={() => setFilter('RESOLVED')}>Resolved</button>
                <button className={filter === 'DISMISSED' ? 'active' : ''} onClick={() => setFilter('DISMISSED')}>Dismissed</button>
                <button className={filter === 'ALL' ? 'active' : ''} onClick={() => setFilter('ALL')}>All History</button>
            </div>

            <div className="mod-table-container">
                <table className="mod-table">
                    <thead>
                        <tr>
                            <th>Type</th>
                            <th>Item ID</th>
                            <th>Reporter ID</th>
                            <th>Reason</th>
                            <th>Date</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredReports.map(report => (
                            <tr key={report.reportId} className={`status-${report.status.toLowerCase()}`}>
                                <td><span className={`badge-type type-${report.itemType.toLowerCase()}`}>{report.itemType}</span></td>
                                <td>{report.reportedItemId}</td>
                                <td>{report.reporterId}</td>
                                <td className="reason-cell">{report.reason}</td>
                                <td>{new Date(report.timestamp).toLocaleDateString()}</td>
                                <td><span className={`status-pill ${report.status.toLowerCase()}`}>{report.status}</span></td>
                                <td>
                                    {report.status === 'PENDING' && (
                                        <div className="action-buttons">
                                            <button
                                                className="btn-resolve"
                                                onClick={() => handleAction(report.reportId, 'RESOLVED')}
                                                title="Mark as Resolved (Action Taken)"
                                            >
                                                <Check size={16} /> Resolve
                                            </button>
                                            <button
                                                className="btn-dismiss"
                                                onClick={() => handleAction(report.reportId, 'DISMISSED')}
                                                title="Dismiss Report"
                                            >
                                                <X size={16} /> Dismiss
                                            </button>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                        {filteredReports.length === 0 && (
                            <tr>
                                <td colSpan="7" className="empty-state">No reports found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default ModeratorDashboard;
