import React from 'react';
import '../styles/NotificationBell.css';

interface NotificationBellProps {
  hasAlert: boolean;
  count: number;
  onClick: () => void;
}

const NotificationBell: React.FC<NotificationBellProps> = ({ hasAlert, count, onClick }) => {
  return (
    <button className={`notification-bell ${hasAlert ? 'active' : ''}`} onClick={onClick}>
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
      </svg>
      {hasAlert && count > 0 && <span className="notification-badge">{count}</span>}
    </button>
  );
};

export default NotificationBell;
