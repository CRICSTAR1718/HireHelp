import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getRequisition, updateRequisition, submitRequisition, approveRequisition, rejectRequisition, requestChanges, publishRequisition } from "../../api/recruiter/requisitions"
import { getForm } from "../../api/recruiter/forms"
import api from "../../api/recruiter/requisitions"

interface User {
  id: string
  email: string
  full_name?: string
  role: string
}

interface AdminRequisitionDetailPageProps {
  user: User
}

export default function AdminRequisitionDetailPage({ user }: AdminRequisitionDetailPageProps) {
  const { id } = useParams()
  const navigate = useNavigate()

  const [req, setReq] = useState<any>(null)
  const [logs, setLogs] = useState<any[]>([])
  const [form, setForm] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [actionLoading, setActionLoading] = useState(false)
  
  const [rejectionReason, setRejectionReason] = useState('')
  const [adminRemarks, setAdminRemarks] = useState('')
  const [showRejectModal, setShowRejectModal] = useState(false)
  const [showRequestChangesModal, setShowRequestChangesModal] = useState(false)

  const fetchAll = async () => {
    setLoading(true)
    try {
      const [reqData, logsData, formData] = await Promise.all([
        getRequisition(id || ''),
        api.get(`/requisitions/${id}/logs`).then((r: any) => r.data),
        getForm(id || '').catch(() => null)
      ])
      setReq(reqData)
      setLogs(logsData)
      setForm(formData)
    } catch (err) {
      setError('Failed to load requisition')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchAll() }, [id])

  const handleApprove = async () => {
    if (!window.confirm('Approve this requisition?')) return
    setActionLoading(true)
    try {
      const updated = await approveRequisition(id || '')
      setReq(updated)
      await fetchAll()
    } catch (err: any) {
      alert(err.response?.data?.error || 'Approval failed')
    } finally {
      setActionLoading(false)
    }
  }

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      alert('Rejection reason is required')
      return
    }
    setActionLoading(true)
    try {
      const updated = await rejectRequisition(id || '', { rejection_reason: rejectionReason })
      setReq(updated)
      setShowRejectModal(false)
      setRejectionReason('')
      await fetchAll()
    } catch (err: any) {
      alert(err.response?.data?.error || 'Rejection failed')
    } finally {
      setActionLoading(false)
    }
  }

  const handleRequestChanges = async () => {
    if (!adminRemarks.trim()) {
      alert('Admin remarks are required')
      return
    }
    setActionLoading(true)
    try {
      const updated = await requestChanges(id || '', { admin_remarks: adminRemarks })
      setReq(updated)
      setShowRequestChangesModal(false)
      setAdminRemarks('')
      await fetchAll()
    } catch (err: any) {
      alert(err.response?.data?.error || 'Request failed')
    } finally {
      setActionLoading(false)
    }
  }

  const handlePublish = async () => {
    if (!window.confirm('Publish this job?')) return
    setActionLoading(true)
    try {
      const updated = await publishRequisition(id || '')
      setReq(updated)
      await fetchAll()
    } catch (err: any) {
      alert(err.response?.data?.error || 'Publish failed')
    } finally {
      setActionLoading(false)
    }
  }

  const canApprove = req && (req.status === 'submitted' || req.status === 'under_review') && user?.role === 'admin'
  const canReject = req && (req.status === 'submitted' || req.status === 'under_review') && user?.role === 'admin'
  const canRequestChanges = req && (req.status === 'submitted' || req.status === 'under_review') && user?.role === 'admin'
  const canPublish = req && req.status === 'approved' && user?.role === 'admin' && form?.is_published
  const canViewApplications = req && (req.status === 'approved' || req.status === 'published' || req.status === 'closed') && user?.role === 'admin'

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'draft': return 'admin-status-draft'
      case 'submitted': return 'admin-status-submitted'
      case 'approved': return 'admin-status-approved'
      case 'rejected': return 'admin-status-rejected'
      case 'published': return 'admin-status-published'
      default: return 'admin-status-draft'
    }
  }

  if (loading) {
    return (
      <div className="admin-page-container">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
          <div style={{ textAlign: 'center' }}>
            <div className="spinner" style={{ margin: '0 auto 1rem' }} />
            <p style={{ color: '#64748b' }}>Loading…</p>
          </div>
        </div>
      </div>
    )
  }
  if (error) return <div className="admin-page-container"><div style={{ background: '#fee2e2', border: '1px solid #fecaca', color: '#dc2626', borderRadius: 8, padding: '0.75rem 1rem' }}>{error}</div></div>
  if (!req) return null

  return (
    <div className="admin-page-container">
      <button 
        className="admin-btn-secondary" 
        onClick={() => navigate('/admin/requisitions')} 
        style={{ marginBottom: '1.5rem' }}
      >
        ← Back to Requisitions
      </button>

      <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 12, padding: '1.75rem', marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem' }}>
              {req.title}
            </h1>
            <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
              {req.department && (
                <span style={{ fontSize: '0.85rem', color: '#64748b' }}>🏢 {req.department}</span>
              )}
              {req.team && (
                <span style={{ fontSize: '0.85rem', color: '#64748b' }}>👥 {req.team}</span>
              )}
              {req.location && (
                <span style={{ fontSize: '0.85rem', color: '#64748b' }}>📍 {req.location}</span>
              )}
              <span style={{ fontSize: '0.85rem', color: '#64748b' }}>
                👤 {req.hiring_manager || req.hiring_manager_email}
              </span>
              <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
                Created {new Date(req.created_at).toLocaleDateString()}
              </span>
            </div>
          </div>
          <span className={`admin-status-badge ${getStatusClass(req.status)}`}>
            {req.status}
          </span>
        </div>
      </div>

      {/* Admin Remarks / Rejection Reason */}
      {(req.admin_remarks || req.rejection_reason) && (
        <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 12, padding: '1.25rem', marginBottom: '1.25rem' }}>
          {req.rejection_reason && (
            <div style={{
              padding: '0.75rem 1rem',
              background: '#fee2e2',
              border: '1px solid #fecaca',
              borderRadius: 8,
              marginBottom: req.admin_remarks ? '1rem' : 0,
              fontSize: '0.85rem',
              color: '#dc2626'
            }}>
              <strong>Rejection Reason:</strong> {req.rejection_reason}
            </div>
          )}
          {req.admin_remarks && (
            <div style={{
              padding: '0.75rem 1rem',
              background: '#fef3c7',
              border: '1px solid #fde68a',
              borderRadius: 8,
              fontSize: '0.85rem',
              color: '#d97706'
            }}>
              <strong>Admin Remarks:</strong> {req.admin_remarks}
            </div>
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 12, padding: '1.25rem', marginBottom: '1.25rem' }}>
        <h2 style={{ fontSize: '0.875rem', fontWeight: 700, color: '#64748b', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Actions
        </h2>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {canApprove && (
            <button
              className="admin-btn-primary"
              onClick={handleApprove}
              disabled={actionLoading}
              style={{ background: '#16a34a' }}
            >
              {actionLoading ? 'Approving…' : 'Approve'}
            </button>
          )}
          {canReject && (
            <button
              className="admin-btn-secondary"
              onClick={() => setShowRejectModal(true)}
              disabled={actionLoading}
              style={{ borderColor: '#fecaca', color: '#dc2626' }}
            >
              Reject
            </button>
          )}
          {canRequestChanges && (
            <button
              className="admin-btn-secondary"
              onClick={() => setShowRequestChangesModal(true)}
              disabled={actionLoading}
              style={{ borderColor: '#fde68a', color: '#d97706' }}
            >
              Request Changes
            </button>
          )}
          {canPublish && (
            <button
              className="admin-btn-primary"
              onClick={handlePublish}
              disabled={actionLoading}
              style={{ background: '#2563eb' }}
            >
              {actionLoading ? 'Publishing…' : 'Publish Job'}
            </button>
          )}
          {canViewApplications && (
            <button
              className="admin-btn-secondary"
              onClick={() => navigate(`/admin/requisitions/${id}/applications`)}
            >
              View Applications
            </button>
          )}
        </div>
      </div>

      {/* Requisition Details */}
      <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 12, padding: '1.5rem', marginBottom: '1.25rem' }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', marginBottom: '1.5rem' }}>
          Requisition Details
        </h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem', marginBottom: '1.5rem' }}>
          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Employment Type</label>
            <p style={{ fontSize: '0.9rem', color: '#475569', marginTop: '0.25rem' }}>{req.employment_type || 'Not specified'}</p>
          </div>
          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Work Mode</label>
            <p style={{ fontSize: '0.9rem', color: '#475569', marginTop: '0.25rem' }}>{req.work_mode || 'Not specified'}</p>
          </div>
          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Number of Openings</label>
            <p style={{ fontSize: '0.9rem', color: '#475569', marginTop: '0.25rem' }}>{req.number_of_openings || 1}</p>
          </div>
          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Hiring Priority</label>
            <p style={{ fontSize: '0.9rem', color: '#475569', marginTop: '0.25rem' }}>{req.hiring_priority || 'Not specified'}</p>
          </div>
          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Target Joining Date</label>
            <p style={{ fontSize: '0.9rem', color: '#475569', marginTop: '0.25rem' }}>{req.target_joining_date ? new Date(req.target_joining_date).toLocaleDateString() : 'Not specified'}</p>
          </div>
          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Application Deadline</label>
            <p style={{ fontSize: '0.9rem', color: '#475569', marginTop: '0.25rem' }}>{req.application_deadline ? new Date(req.application_deadline).toLocaleDateString() : 'Not specified'}</p>
          </div>
        </div>

        {req.about_role && (
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>About the Role</label>
            <p style={{ fontSize: '0.9rem', color: '#475569', marginTop: '0.25rem', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>{req.about_role}</p>
          </div>
        )}

        {req.responsibilities && (
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Responsibilities</label>
            <p style={{ fontSize: '0.9rem', color: '#475569', marginTop: '0.25rem', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>{req.responsibilities}</p>
          </div>
        )}

        {req.required_skills && (
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Required Skills</label>
            <p style={{ fontSize: '0.9rem', color: '#475569', marginTop: '0.25rem', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>{req.required_skills}</p>
          </div>
        )}

        {req.preferred_skills && (
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Preferred Skills</label>
            <p style={{ fontSize: '0.9rem', color: '#475569', marginTop: '0.25rem', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>{req.preferred_skills}</p>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem', marginBottom: '1.5rem' }}>
          {req.experience_required && (
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Experience Required</label>
              <p style={{ fontSize: '0.9rem', color: '#475569', marginTop: '0.25rem' }}>{req.experience_required}</p>
            </div>
          )}
          {req.education_requirements && (
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Education Requirements</label>
              <p style={{ fontSize: '0.9rem', color: '#475569', marginTop: '0.25rem' }}>{req.education_requirements}</p>
            </div>
          )}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem' }}>
          {req.salary && (
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Salary</label>
              <p style={{ fontSize: '0.9rem', color: '#475569', marginTop: '0.25rem' }}>{req.salary}</p>
            </div>
          )}
          {req.benefits && (
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Benefits</label>
              <p style={{ fontSize: '0.9rem', color: '#475569', marginTop: '0.25rem' }}>{req.benefits}</p>
            </div>
          )}
        </div>
      </div>

      {/* Reject Modal */}
      {showRejectModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 12, padding: '2rem', maxWidth: 500, width: '90%' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0f172a', marginBottom: '1rem' }}>
              Reject Requisition
            </h2>
            <label style={{ fontSize: '0.825rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '0.375rem' }}>Rejection Reason *</label>
            <textarea
              className="input-field"
              placeholder="Please explain why this requisition is being rejected…"
              value={rejectionReason}
              onChange={e => setRejectionReason(e.target.value)}
              rows={4}
              style={{ resize: 'vertical', marginBottom: '1rem', width: '100%', border: '1px solid #e2e8f0', borderRadius: 8, padding: '0.625rem 0.875rem' }}
            />
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
              <button
                className="admin-btn-secondary"
                onClick={() => { setShowRejectModal(false); setRejectionReason('') }}
                disabled={actionLoading}
              >
                Cancel
              </button>
              <button
                className="admin-btn-secondary"
                onClick={handleReject}
                disabled={actionLoading}
                style={{ borderColor: '#fecaca', color: '#dc2626' }}
              >
                {actionLoading ? 'Rejecting…' : 'Reject'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Request Changes Modal */}
      {showRequestChangesModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 12, padding: '2rem', maxWidth: 500, width: '90%' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0f172a', marginBottom: '1rem' }}>
              Request Changes
            </h2>
            <label style={{ fontSize: '0.825rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '0.375rem' }}>Remarks/Comments *</label>
            <textarea
              placeholder="Please describe the changes needed…"
              value={adminRemarks}
              onChange={e => setAdminRemarks(e.target.value)}
              rows={4}
              style={{ resize: 'vertical', marginBottom: '1rem', width: '100%', border: '1px solid #e2e8f0', borderRadius: 8, padding: '0.625rem 0.875rem' }}
            />
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
              <button
                className="admin-btn-secondary"
                onClick={() => { setShowRequestChangesModal(false); setAdminRemarks('') }}
                disabled={actionLoading}
              >
                Cancel
              </button>
              <button
                className="admin-btn-primary"
                onClick={handleRequestChanges}
                disabled={actionLoading}
                style={{ borderColor: '#fde68a', color: '#d97706' }}
              >
                {actionLoading ? 'Requesting…' : 'Request Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
