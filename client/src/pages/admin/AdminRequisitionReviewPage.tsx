import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { getRequisitions, approveRequisition, rejectRequisition, requestChanges } from "../../api/recruiter/requisitions"

interface User {
  id: string
  email: string
  full_name?: string
  role: string
}

interface AdminRequisitionReviewPageProps {
  user: User
}

export default function AdminRequisitionReviewPage({ user }: AdminRequisitionReviewPageProps) {
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

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'draft': return 'admin-status-draft'
      case 'submitted': return 'admin-status-submitted'
      case 'approved': return 'admin-status-approved'
      case 'rejected': return 'admin-status-rejected'
      case 'published': return 'admin-status-published'
      case 'under_review': return 'admin-status-submitted'
      case 'needs_changes': return 'admin-status-rejected'
      default: return 'admin-status-draft'
    }
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
      <div className="admin-page-container">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
          <div style={{ textAlign: 'center' }}>
            <div className="spinner" style={{ margin: '0 auto 1rem' }} />
            <p style={{ color: '#64748b' }}>Loading requisitions…</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="admin-page-container">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Requisition Review</h1>
          <p className="admin-page-subtitle">
            Review and manage job requisitions awaiting approval
          </p>
        </div>
        <button 
          className="admin-btn-secondary" 
          onClick={() => navigate('/admin/requisitions')}
        >
          View All Requisitions
        </button>
      </div>

      {error && (
        <div className="admin-alert admin-alert-error" style={{ marginBottom: '1.5rem' }}>
          {error}
        </div>
      )}

      {/* Filter Tabs */}
      <div className="admin-tabs">
        <button 
          className={`admin-tab ${filter === 'all' ? 'admin-tab-active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All <span className="admin-badge-count">{getStatusCount('all')}</span>
        </button>
        <button 
          className={`admin-tab ${filter === 'pending' ? 'admin-tab-active' : ''}`}
          onClick={() => setFilter('pending')}
        >
          Pending <span className="admin-badge-count">{getStatusCount('pending')}</span>
        </button>
        <button 
          className={`admin-tab ${filter === 'approved' ? 'admin-tab-active' : ''}`}
          onClick={() => setFilter('approved')}
        >
          Approved <span className="admin-badge-count">{getStatusCount('approved')}</span>
        </button>
        <button 
          className={`admin-tab ${filter === 'rejected' ? 'admin-tab-active' : ''}`}
          onClick={() => setFilter('rejected')}
        >
          Rejected <span className="admin-badge-count">{getStatusCount('rejected')}</span>
        </button>
        <button 
          className={`admin-tab ${filter === 'changes' ? 'admin-tab-active' : ''}`}
          onClick={() => setFilter('changes')}
        >
          Needs Changes <span className="admin-badge-count">{getStatusCount('changes')}</span>
        </button>
      </div>

      {filteredRequisitions.length === 0 ? (
        <div className="admin-empty-state">
          <div className="admin-empty-icon">📋</div>
          <h3 className="admin-empty-title">No requisitions found</h3>
          <p className="admin-empty-text">No requisitions match the current filter.</p>
        </div>
      ) : (
        <div className="admin-requisition-grid">
          {filteredRequisitions.map((req) => (
            <div
              key={req.id}
              className="admin-requisition-card"
              onClick={() => navigate(`/admin/requisitions/${req.id}`)}
              role="button"
              aria-label={`View requisition ${req.title}`}
            >
              {/* Pending Indicator */}
              {(req.status === 'submitted' || req.status === 'under_review') && (
                <div className="admin-card-priority admin-priority-medium" />
              )}

              <div className="admin-card-content">
                <div className="admin-card-header">
                  <span className="admin-memo-badge">
                    {req.memo_no || 'Pending…'}
                  </span>
                  <span className={`admin-status-badge ${getStatusClass(req.status)}`}>
                    {req.status}
                  </span>
                </div>

                <h3 className="admin-card-title">{req.title}</h3>

                <div className="admin-card-meta">
                  {req.department && (
                    <div className="admin-card-meta-item">
                      🏢 {req.department}
                    </div>
                  )}
                  {req.team && (
                    <div className="admin-card-meta-item">
                      👥 {req.team}
                    </div>
                  )}
                  {req.location && (
                    <div className="admin-card-meta-item">
                      📍 {req.location}
                    </div>
                  )}
                </div>

                {/* Admin Remarks / Rejection Reason */}
                {req.rejection_reason && (
                  <div style={{
                    padding: '0.5rem 0.75rem',
                    background: '#fee2e2',
                    border: '1px solid #fecaca',
                    borderRadius: 6,
                    marginTop: '0.75rem',
                    fontSize: '0.75rem',
                    color: '#dc2626',
                    fontStyle: 'italic'
                  }}>
                    Rejected: {req.rejection_reason}
                  </div>
                )}
                {req.admin_remarks && (
                  <div style={{
                    padding: '0.5rem 0.75rem',
                    background: '#fef3c7',
                    border: '1px solid #fde68a',
                    borderRadius: 6,
                    marginTop: req.rejection_reason ? '0.5rem' : '0.75rem',
                    fontSize: '0.75rem',
                    color: '#d97706',
                    fontStyle: 'italic'
                  }}>
                    Remarks: {req.admin_remarks}
                  </div>
                )}

                {/* Stats */}
                <div className="admin-card-stats">
                  <div className="admin-stat-item">
                    <span>👤</span>
                    <span className="admin-stat-value">{req.hiring_manager || req.hiring_manager_email || 'Unknown'}</span>
                  </div>
                  <div className="admin-stat-item">
                    <span>📅</span>
                    <span className="admin-stat-value">{new Date(req.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons for Pending Requisitions */}
              {(req.status === 'submitted' || req.status === 'under_review') && (
                <div className="admin-card-actions">
                  <button
                    className="admin-action-btn"
                    onClick={(e) => { e.stopPropagation(); handleApprove(req.id) }}
                    disabled={actionLoading[req.id]}
                    style={{ 
                      background: '#dcfce7',
                      borderColor: '#bbf7d0',
                      color: '#166534'
                    }}
                  >
                    {actionLoading[req.id] ? 'Approving…' : 'Approve'}
                  </button>
                  <button
                    className="admin-action-btn"
                    onClick={(e) => { e.stopPropagation(); setShowRequestChangesModal(req.id) }}
                    disabled={actionLoading[req.id]}
                    style={{ 
                      background: '#fef3c7',
                      borderColor: '#fde68a',
                      color: '#92400e'
                    }}
                  >
                    Request Changes
                  </button>
                  <button
                    className="admin-action-btn admin-action-btn-danger"
                    onClick={(e) => { e.stopPropagation(); setShowRejectModal(req.id) }}
                    disabled={actionLoading[req.id]}
                  >
                    {actionLoading[req.id] ? 'Rejecting…' : 'Reject'}
                  </button>
                </div>
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
          <div className="admin-form-container" style={{ maxWidth: 400, padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', color: '#0f172a' }}>
              Reject Requisition
            </h3>
            <textarea
              className="admin-form-input admin-form-textarea"
              placeholder="Please provide a reason for rejection..."
              value={rejectionReason}
              onChange={e => setRejectionReason(e.target.value)}
              rows={4}
              style={{ marginBottom: '1rem' }}
            />
            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
              <button
                className="admin-btn-secondary"
                onClick={() => { setShowRejectModal(null); setRejectionReason('') }}
                disabled={actionLoading[showRejectModal]}
              >
                Cancel
              </button>
              <button
                className="admin-btn-secondary"
                onClick={() => handleReject(showRejectModal)}
                disabled={actionLoading[showRejectModal]}
                style={{ borderColor: '#fecaca', color: '#dc2626' }}
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
          <div className="admin-form-container" style={{ maxWidth: 400, padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', color: '#0f172a' }}>
              Request Changes
            </h3>
            <textarea
              className="admin-form-input admin-form-textarea"
              placeholder="Please specify the changes needed..."
              value={adminRemarks}
              onChange={e => setAdminRemarks(e.target.value)}
              rows={4}
              style={{ marginBottom: '1rem' }}
            />
            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
              <button
                className="admin-btn-secondary"
                onClick={() => { setShowRequestChangesModal(null); setAdminRemarks('') }}
                disabled={actionLoading[showRequestChangesModal]}
              >
                Cancel
              </button>
              <button
                className="admin-btn-primary"
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
