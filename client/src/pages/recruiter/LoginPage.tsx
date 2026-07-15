import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login, register } from "../../api/recruiter/auth"

const ROLES = [
  { value: 'hr',    label: 'HR' },
  { value: 'admin', label: 'Admin' }
]

interface LoginPageProps {
  onLogin: (user: any) => void
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const navigate = useNavigate()
  const [mode, setMode]         = useState<'login' | 'register'>('login')
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [role, setRole]         = useState('hr')
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)

  const switchMode = (m: 'login' | 'register') => {
    setMode(m)
    setError('')
  }

  const handleSubmit = async () => {
    setError('')
    if (!email || !password) {
      setError('Please enter both email and password.')
      return
    }
    setLoading(true)
    try {
      let user
      if (mode === 'login') {
        user = await login(email, password)
      } else {
        user = await register(email, password, fullName || '', role)
      }
      onLogin(user)
      navigate('/recruiter/requisitions')
    } catch (err: any) {
      setError(err.message || (mode === 'login' ? 'Invalid credentials' : 'Registration failed'))
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSubmit()
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'radial-gradient(ellipse at 20% 50%, rgba(59,130,246,0.08) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(99,102,241,0.05) 0%, transparent 50%), var(--bg-primary)',
        padding: '1rem'
      }}
    >
      <div style={{ width: '100%', maxWidth: 420 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div
            style={{
              width: 64, height: 64,
              borderRadius: 16,
              background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 1rem',
              boxShadow: '0 8px 32px rgba(99,102,241,0.35)'
            }}
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <rect x="2" y="3" width="20" height="14" rx="2" />
              <path d="M8 21h8M12 17v4" />
              <path d="M7 8h4M7 12h8" />
            </svg>
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.25rem', color: 'var(--text-primary)' }}>
            JR Portal
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Hiring Assistance Platform
          </p>
        </div>

        {/* Card */}
        <div className="glass-card fade-in" style={{ padding: '2rem' }}>
          {/* Tab switcher */}
          <div
            style={{
              display: 'flex',
              background: 'var(--bg-secondary)',
              borderRadius: 10,
              padding: 4,
              marginBottom: '1.5rem',
              gap: 4
            }}
          >
            {[{ key: 'login' as const, label: 'Sign In' }, { key: 'register' as const, label: 'Register' }].map(tab => (
              <button
                key={tab.key}
                id={`tab-${tab.key}`}
                onClick={() => switchMode(tab.key)}
                style={{
                  flex: 1,
                  padding: '0.5rem',
                  borderRadius: 8,
                  border: 'none',
                  background: mode === tab.key ? 'linear-gradient(135deg, #3b82f6, #6366f1)' : 'transparent',
                  color: mode === tab.key ? 'white' : 'var(--text-secondary)',
                  fontWeight: mode === tab.key ? 700 : 500,
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {error && (
            <div className="alert-error" style={{ marginBottom: '1rem' }}>
              {error}
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* Full name — register only */}
            {mode === 'register' && (
              <div>
                <label className="label" htmlFor="reg-fullname">Full Name</label>
                <input
                  id="reg-fullname"
                  type="text"
                  className="input-field"
                  placeholder="Jane Smith"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  onKeyDown={handleKeyDown}
                  autoFocus
                />
              </div>
            )}

            <div>
              <label className="label" htmlFor="login-email">Email Address</label>
              <input
                id="login-email"
                type="email"
                className="input-field"
                placeholder="you@company.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                onKeyDown={handleKeyDown}
                autoFocus={mode === 'login'}
              />
            </div>

            <div>
              <label className="label" htmlFor="login-password">Password</label>
              <input
                id="login-password"
                type="password"
                className="input-field"
                placeholder={mode === 'register' ? 'Choose a strong password' : 'Enter your password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                onKeyDown={handleKeyDown}
              />
            </div>

            {/* Role selector — register only */}
            {mode === 'register' && (
              <div>
                <label className="label" htmlFor="reg-role">Role</label>
                <select
                  id="reg-role"
                  className="input-field"
                  value={role}
                  onChange={e => setRole(e.target.value)}
                  style={{ appearance: 'none' }}
                >
                  {ROLES.map(r => (
                    <option key={r.value} value={r.value}>{r.label}</option>
                  ))}
                </select>
              </div>
            )}

            <button
              id="login-submit"
              className="btn-primary"
              onClick={handleSubmit}
              disabled={loading}
              style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem', padding: '0.75rem' }}
            >
              {loading ? (
                <>
                  <span className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} />
                  {mode === 'login' ? 'Signing in…' : 'Creating account…'}
                </>
              ) : (mode === 'login' ? 'Sign In' : 'Create Account')}
            </button>
          </div>
        </div>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
          Job Requisition Management System v1.0
        </p>
      </div>
    </div>
  )
}
