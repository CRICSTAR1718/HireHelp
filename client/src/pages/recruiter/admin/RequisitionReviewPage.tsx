import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { getRequisitions, approveRequisition, rejectRequisition, requestChanges } from "../../../api/recruiter/requisitions"
import StatusBadge from "../../../components/recruiter/StatusBadge"

interface User {
  id: string
  email: string
  full_name?: string
  role: string
}

interface RequisitionReviewPageProps {
  user: User
}

export default function RequisitionReviewPage({ user }: RequisitionReviewPageProps) {
  const navigate = useNavigate()
  const [requisitions, setRequisitions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState('all')
  const [actionLoading, setActionLoading] = useState<Record<string, boolean>>({})
  const [showRejectModal, setShowRejectModal] = useState<string | null>(null)
  const [showRequestChangesModal, setShowRequestChangesModal] = useState<string | null>(null)
  const [rejectionReason, setRejectionReason] = useState('')
  const [adminRemarks, setAdminRemarks] = useState('')

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

  const filteredRequisitions = requisitions.filter(req => {
    if (filter === 'all') return true
    if (filter === 'pending') return req.status === 'submitted' || req.status === 'under_review'
    if (filter === 'approved') return req.status === 'approved' || req.status === 'published'
    if (filter === 'rejected') return req.status === 'rejected'
    if (filter === 'changes') return req.status === 'needs_changes'
    return true
  })

  const getStatusCount = (status: string) => {
    if (status === 'pending') return requisitions.filter(r => r.status === 'submitted' || r.status === 'under_review').length
    if (status === 'approved') return requisitions.filter(r => r.status === 'approved' || r.status === 'published').length
    if (status === 'rejected') return requisitions.filter(r => r.status === 'rejected').length
    if (status === 'changes') return requisitions.filter(r => r.status === 'needs_changes').length
    return requisitions.length
  }

  const handleApprove = async (reqId: string) => {
    setActionLoading(prev => ({ ...prev, [reqId]: true }))
    try {
      await approveRequisition(reqId)
      await fetchAll()
    } catch (err: any) {
      alert(err.response?.data?.error || 'Approval failed')
    } finally {
      setActionLoading(prev => ({ ...prev, [reqId]: false }))
    }
  }

  const handleReject = async (reqId: string) => {
    if (!rejectionReason.trim()) {
      alert('Please provide a rejection reason')
      return
    }
    setActionLoading(prev => ({ ...prev, [reqId]: true }))
    try {
      await rejectRequisition(reqId, { rejection_reason: rejectionReason })
      setShowRejectModal(null)
      setRejectionReason('')
      await fetchAll()
    } catch (err: any) {
      alert(err.response?.data?.error || 'Rejection failed')
    } finally {
      setActionLoading(prev => ({ ...prev, [reqId]: false }))
    }
  }

  const handleRequestChanges = async (reqId: string) => {
    if (!adminRemarks.trim()) {
      alert('Please provide remarks for the requested changes')
      return
    }
    setActionLoading(prev => ({ ...prev, [reqId]: true }))
    try {
      await requestChanges(reqId, { admin_remarks: adminRemarks })
      setShowRequestChangesModal(null)
      setAdminRemarks('')
      await fetchAll()
    } catch (err: any) {
      alert(err.response?.data?.error || 'Request failed')
    } finally {
      setActionLoading(prev => ({ ...prev, [reqId]: false }))
    }
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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
            Requisition Review
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            Review and manage job requisitions
          </p>
        </div>
        <button
          className="btn-secondary btn-sm"
          onClick={() => navigate('/recruiter/admin/form-approvals')}
        >
          Form Approvals
        </button>
      </div>

      {error && <div className="alert-error" style={{ marginBottom: '1.5rem' }}>{error}</div>}

      {/* Filter Tabs */}
      <div className="glass-card" style={{ padding: '1rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {['all', 'pending', 'approved', 'rejected', 'changes'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: 20,
                border: filter === f ? '1.5px solid var(--accent)' : '1px solid var(--border)',
                background: filter === f ? 'var(--accent-light)' : 'transparent',
                color: filter === f ? 'var(--accent)' : 'var(--text-secondary)',
                fontSize: '0.85rem',
                fontWeight: filter === f ? 600 : 500,
                cursor: 'pointer',
                transition: 'all 0.15s',
                textTransform: 'capitalize'
              }}
            >
              {f === 'changes' ? 'Needs Changes' : f} ({getStatusCount(f)})
            </button>
          ))}
        </div>
      </div>

      {filteredRequisitions.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📋</div>
          <h3 style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>No requisitions found</h3>
          <p>No requisitions match the current filter.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '1rem' }}>
          {filteredRequisitions.map((req, idx) => (
            <div
              key={req.id}
              className="glass-card fade-in"
              onClick={() => navigate(`/recruiter/requisitions/${req.id}`)}
              style={{
                padding: '1.25rem',
                cursor: 'pointer',
                position: 'relative',
                animationDelay: `${idx * 0.04}s`
              }}
              role="button"
              aria-label={`View requisition ${req.title}`}
            >
              {/* Header */}
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

              {/* Details */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', marginBottom: '0.75rem' }}>
                {req.department && (
                  <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)' }}>🏢 {req.department}</p>
                )}
                {req.team && (
                  <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)' }}>👥 {req.team}</p>
                )}
                {req.location && (
                  <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)' }}>📍 {req.location}</p>
                )}
              </div>

              {/* Admin Remarks / Rejection Reason */}
              {req.rejection_reason && (
                <div style={{
                  padding: '0.5rem 0.75rem',
                  background: 'rgba(239,68,68,0.08)',
                  border: '1px solid rgba(239,68,68,0.2)',
                  borderRadius: 6,
                  marginBottom: req.admin_remarks ? '0.5rem' : '0.75rem',
                  fontSize: '0.75rem',
                  color: '#ef4444',
                  fontStyle: 'italic'
                }}>
                  Rejected: {req.rejection_reason}
                </div>
              )}
              {req.admin_remarks && (
                <div style={{
                  padding: '0.5rem 0.75rem',
                  background: 'rgba(245,158,11,0.08)',
                  border: '1px solid rgba(245,158,11,0.2)',
                  borderRadius: 6,
                  marginBottom: '0.75rem',
                  fontSize: '0.75rem',
                  color: '#f59e0b',
                  fontStyle: 'italic'
                }}>
                  Remarks: {req.admin_remarks}
                </div>
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

              {/* Action Buttons for Pending Requisitions */}
              {(req.status === 'submitted' || req.status === 'under_review') && (
                <div style={{
                  display: 'flex',
                  gap: '0.5rem',
                  marginTop: '1rem',
                  paddingTop: '0.75rem',
                  borderTop: '1px solid var(--border)'
                }}>
                  <button
                    className="btn-primary btn-sm"
                    onClick={(e) => { e.stopPropagation(); handleApprove(req.id) }}
                    disabled={actionLoading[req.id]}
                    style={{ flex: 1 }}
                  >
                    {actionLoading[req.id] ? 'Approving…' : 'Approve'}
                  </button>
                  <button
                    className="btn-secondary btn-sm"
                    onClick={(e) => { e.stopPropagation(); setShowRequestChangesModal(req.id) }}
                    disabled={actionLoading[req.id]}
                    style={{ flex: 1 }}
                  >
                    Request Changes
                  </button>
                  <button
                    className="btn-danger btn-sm"
                    onClick={(e) => { e.stopPropagation(); setShowRejectModal(req.id) }}
                    disabled={actionLoading[req.id]}
                    style={{ flex: 1 }}
                  >
                    Reject
                  </button>
                </div>
              )}

              {/* Action Indicator */}
              {(req.status === 'submitted' || req.status === 'under_review') && (
                <div style={{
                  position: 'absolute',
                  top: '1rem',
                  right: '1rem',
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: '#f59e0b',
                  animation: 'pulse 2s infinite'
                }} />
              )}
            </div>
          ))}
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div className="glass-card" style={{ padding: '1.5rem', maxWidth: 400, width: '90%' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem' }}>Reject Requisition</h3>
            <textarea
              placeholder="Please provide a reason for rejection..."
              value={rejectionReason}
              onChange={e => setRejectionReason(e.target.value)}
              rows={4}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid var(--border)',
                borderRadius: 8,
                fontSize: '0.9rem',
                fontFamily: 'inherit',
                resize: 'vertical',
                marginBottom: '1rem'
              }}
            />
            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
              <button
                className="btn-secondary"
                onClick={() => { setShowRejectModal(null); setRejectionReason('') }}
              >
                Cancel
              </button>
              <button
                className="btn-danger"
                onClick={() => handleReject(showRejectModal)}
                disabled={actionLoading[showRejectModal]}
              >
                {actionLoading[showRejectModal] ? 'Rejecting…' : 'Reject'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Request Changes Modal */}
      {showRequestChangesModal && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div className="glass-card" style={{ padding: '1.5rem', maxWidth: 400, width: '90%' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem' }}>Request Changes</h3>
            <textarea
              placeholder="Please specify the changes needed..."
              value={adminRemarks}
              onChange={e => setAdminRemarks(e.target.value)}
              rows={4}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid var(--border)',
                borderRadius: 8,
                fontSize: '0.9rem',
                fontFamily: 'inherit',
                resize: 'vertical',
                marginBottom: '1rem'
              }}
            />
            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
              <button
                className="btn-secondary"
                onClick={() => { setShowRequestChangesModal(null); setAdminRemarks('') }}
              >
                Cancel
              </button>
              <button
                className="btn-primary"
                onClick={() => handleRequestChanges(showRequestChangesModal)}
                disabled={actionLoading[showRequestChangesModal]}
              >
                {actionLoading[showRequestChangesModal] ? 'Sending…' : 'Send Request'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
