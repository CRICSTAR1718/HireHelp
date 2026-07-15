import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/shared/useAuth'

interface User {
  id: string
  email: string
  full_name?: string
  role: string
}

interface NavbarProps {
  user: User
}

export default function Navbar({ user }: NavbarProps) {
  const navigate = useNavigate()
  const { logout } = useAuth()

  const handleLogout = () => {
    // Was calling a cookie-based /auth/logout endpoint directly and never
    // clearing Redux/localStorage session state, so the redirect to "/"
    // bounced straight back into /recruiter via RootRedirect (Redux still
    // thought the user was authenticated). Using the shared logout clears
    // the actual session this app checks.
    logout()
    navigate('/login')
  }

  return (
    <nav className="navbar">
      <div
        className="navbar-logo"
        onClick={() => navigate('/recruiter/requisitions')}
        role="button"
        aria-label="Go to requisitions"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <rect x="2" y="3" width="20" height="14" rx="2" style={{ stroke: '#6366f1' }} />
          <path d="M8 21h8M12 17v4" style={{ stroke: '#8b5cf6' }} />
          <path d="M7 8h4M7 12h8" style={{ stroke: '#a78bfa' }} />
        </svg>
        JR Portal
      </div>

      {user && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {user.role === 'admin' && (
            <>
              <button
                onClick={() => navigate('/recruiter/admin/requisitions')}
                className="btn-secondary btn-sm"
              >
                Requisition Review
              </button>
              <button
                onClick={() => navigate('/recruiter/admin/form-approvals')}
                className="btn-secondary btn-sm"
              >
                Form Approvals
              </button>
            </>
          )}
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-primary)', fontWeight: 600 }}>
              {user.full_name || user.email}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'capitalize' }}>
              {user.role?.replace('_', ' ')}
            </div>
          </div>
          <div
            style={{
              width: 36, height: 36,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '0.9rem', fontWeight: 700, color: 'white',
              flexShrink: 0
            }}
          >
            {(user.full_name || user.email)?.[0]?.toUpperCase()}
          </div>
          <button id="navbar-signout" className="btn-secondary btn-sm" onClick={handleLogout}>
            Sign Out
          </button>
        </div>
      )}
    </nav>
  )
}
