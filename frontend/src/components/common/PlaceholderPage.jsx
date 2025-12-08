import React from 'react';
import { Construction } from 'lucide-react';
import '../../styles/Homepage.css'; // Reusing homepage styles for centering

const PlaceholderPage = ({ title, message }) => {
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            color: 'var(--text-color)',
            textAlign: 'center',
            padding: '40px'
        }}>
            <div className="icon-hexagon" style={{ marginBottom: '20px' }}>
                <Construction size={64} color="var(--primary-color)" />
            </div>
            <h2 style={{ fontSize: '24px', marginBottom: '16px' }}>{title}</h2>
            <p style={{ color: 'var(--secondary-text-color)', maxWidth: '500px' }}>
                {message}
            </p>
        </div>
    );
};

export default PlaceholderPage;
