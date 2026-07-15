import React from 'react';
import { Bell } from 'lucide-react';

export const Notifications: React.FC = () => {
  return (
    <div className="page-container">
      <div className="glass-card fade-in" style={{ padding: '2rem' }}>
        <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
          Notifications
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '2rem' }}>
          Stay updated with all your recruitment activities and alerts
        </p>

        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center', 
          padding: '4rem 2rem',
          textAlign: 'center',
          minHeight: '400px'
        }}>
          <Bell style={{ width: '64px', height: '64px', color: 'var(--text-muted)', marginBottom: '1.5rem' }} />
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
            Notifications Feature Coming Soon
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1rem' }}>
            This feature is currently under development. Stay tuned for updates!
          </p>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            You will be able to manage notifications, set alerts, and stay informed about important recruitment activities.
          </p>
        </div>
      </div>
    </div>
  );
};
