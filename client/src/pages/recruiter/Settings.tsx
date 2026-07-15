import React from 'react';
import { Settings } from 'lucide-react';

export const RecruiterSettings: React.FC = () => {
  return (
    <div className="page-container">
      <div className="glass-card fade-in" style={{ padding: '2rem' }}>
        <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
          Settings
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '2rem' }}>
          Manage your account preferences and application settings
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
          <Settings style={{ width: '64px', height: '64px', color: 'var(--text-muted)', marginBottom: '1.5rem' }} />
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
            Settings Feature Coming Soon
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1rem' }}>
            This feature is currently under development. Stay tuned for updates!
          </p>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            You will be able to manage your profile, notification preferences, security settings, and other account configurations.
          </p>
        </div>
      </div>
    </div>
  );
};
