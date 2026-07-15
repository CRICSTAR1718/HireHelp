import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { getRequisitions, deleteRequisition } from "../../api/recruiter/requisitions"
import StatusBadge from "../../components/recruiter/StatusBadge"

interface User {
  id: string
  email: string
  full_name?: string
  role: string
}

interface RequisitionsPageProps {
  user: User
}

export default function RequisitionsPage({ user }: RequisitionsPageProps) {
  const navigate = useNavigate()
  const [requisitions, setRequisitions] = useState<any[]>([])
  const [loading, setLoading]           = useState(true)
  const [error, setError]               = useState('')
  const [deleting, setDeleting]         = useState<string | null>(null)
  const [hoveredCard, setHoveredCard]   = useState<string | null>(null)

  const fetchAll = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const data = await getRequisitions()
      setRequisitions(data)
    } catch (err) {
      setError('Failed to load requisitions')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchAll() }, [fetchAll])

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    if (!window.confirm('Delete this requisition? This cannot be undone.')) return
    setDeleting(id)
    try {
      await deleteRequisition(id)
      setRequisitions(prev => prev.filter(r => r.id !== id))
    } catch (err: any) {
      alert(err.response?.data?.error || 'Delete failed')
    } finally {
      setDeleting(null)
    }
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <div style={{ textAlign: 'center' }}>
          <div className="spinner" style={{ margin: '0 auto 1rem' }} />
          <p style={{ color: 'var(--text-muted)' }}>Loading requisitions…</p>
        </div>
      </div>
    )
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
            Job Requisitions
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            {requisitions.length} total requisition{requisitions.length !== 1 ? 's' : ''}
          </p>
        </div>
        {(user?.role === 'hr' || user?.role === 'hiring_manager' || user?.role === 'admin') && (
          <button id="new-requisition-btn" className="btn-primary" onClick={() => navigate('/recruiter/requisitions/new')}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M12 5v14M5 12h14" />
            </svg>
            New Requisition
          </button>
        )}
      </div>

      {error && <div className="alert-error" style={{ marginBottom: '1.5rem' }}>{error}</div>}

      {requisitions.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📋</div>
          <h3 style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>No requisitions yet</h3>
          <p>Create your first job requisition to get started.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1rem' }}>
          {requisitions.map((req, idx) => (
            <div
              key={req.id}
              className="glass-card fade-in"
              onClick={() => navigate(`/recruiter/requisitions/${req.id}`)}
              onMouseEnter={() => setHoveredCard(req.id)}
              onMouseLeave={() => setHoveredCard(null)}
              style={{
                padding: '1.25rem',
                cursor: 'pointer',
                position: 'relative',
                animationDelay: `${idx * 0.04}s`
              }}
              role="button"
              aria-label={`View requisition ${req.title}`}
            >
              {/* Memo No */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                <span
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: 'var(--accent)',
                    background: 'var(--accent-light)',
                    padding: '0.2rem 0.6rem',
                    borderRadius: 6,
                    letterSpacing: '0.05em'
                  }}
                >
                  {req.memo_no || 'Pending…'}
                </span>
                <StatusBadge status={req.status} />
              </div>

              {/* Title */}
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.375rem', lineHeight: 1.3 }}>
                {req.title}
              </h3>

              {/* Department */}
              {req.department && (
                <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
                  🏢 {req.department}
                </p>
              )}

              {/* Footer */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingTop: '0.75rem',
                  borderTop: '1px solid var(--border)'
                }}
              >
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  👤 {req.hiring_manager || req.hiring_manager_email || 'Unknown'}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  {new Date(req.created_at).toLocaleDateString()}
                </div>
              </div>

              {/* Hover Actions */}
              {hoveredCard === req.id && (
                <div
                  style={{
                    position: 'absolute',
                    bottom: '1rem',
                    right: '1rem',
                    display: 'flex',
                    gap: '0.5rem',
                    animation: 'fadeIn 0.15s ease'
                  }}
                  onClick={e => e.stopPropagation()}
                >
                  <button
                    id={`edit-req-${req.id}`}
                    className="btn-secondary btn-sm"
                    onClick={(e) => { e.stopPropagation(); navigate(`/recruiter/requisitions/${req.id}/edit`) }}
                  >
                    Edit
                  </button>
                  {user?.role === 'admin' && (
                    <button
                      id={`delete-req-${req.id}`}
                      className="btn-danger btn-sm"
                      onClick={(e) => handleDelete(e, req.id)}
                      disabled={deleting === req.id}
                    >
                      {deleting === req.id ? '…' : 'Delete'}
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
