import React from 'react';
import './LoadingSpinner.css';

const LoadingSpinner = ({ size = 50, color }) => {
    return (
        <div className="spinner-container">
            <div
                className="spinner-hexagon"
                style={{
                    width: size,
                    height: size,
                    backgroundColor: color
                }}
            />
        </div>
    );
};

export default LoadingSpinner;
