import React from 'react';
import { GitPullRequest } from 'lucide-react';

export const Pipeline: React.FC = () => {
  return (
    <div className="page-container">
      <div className="glass-card fade-in" style={{ padding: '2rem' }}>
        <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
          Pipeline Management
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '2rem' }}>
          Track and manage candidates through your recruitment pipeline
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
          <GitPullRequest style={{ width: '64px', height: '64px', color: 'var(--text-muted)', marginBottom: '1.5rem' }} />
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
            Pipeline Feature Coming Soon
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1rem' }}>
            This feature is currently under development. Stay tuned for updates!
          </p>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            You will be able to manage recruitment stages, track candidate progress, and optimize your hiring workflow.
          </p>
        </div>
      </div>
    </div>
  );
};
