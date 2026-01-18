import React from 'react';
import '../styles/FlagNotification.css';

interface FlagNotificationProps {
  onClick: () => void;
  alertCount: number;
  highestScore: number;
}

const FlagNotification: React.FC<FlagNotificationProps> = ({ onClick, alertCount, highestScore }) => {
  return (
    <div className="flag-notification" onClick={onClick}>
      <div className="flag-icon">
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"
            fill="currentColor"
          />
          <line x1="4" y1="22" x2="4" y2="2" stroke="currentColor" strokeWidth="2" />
        </svg>
        {alertCount > 0 && (
          <span className="flag-badge">{alertCount}</span>
        )}
      </div>
      <div className="flag-tooltip">
        <div className="tooltip-header">⚠️ ICM Recommended</div>
        <div className="tooltip-content">
          <p><strong>Confidence Score:</strong> {(highestScore * 100).toFixed(0)}%</p>
          <p><strong>Similar Cases:</strong> {alertCount}</p>
          <p className="tooltip-action">Click to view details</p>
        </div>
      </div>
    </div>
  );
};

export default FlagNotification;
