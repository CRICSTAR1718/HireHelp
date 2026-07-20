import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getRequisition, updateRequisition, submitRequisition, approveRequisition, rejectRequisition, requestChanges, publishRequisition } from "../../api/recruiter/requisitions"
import { getForm } from "../../api/recruiter/forms"
import api from "../../api/recruiter/requisitions"
import StatusBadge from "../../components/recruiter/StatusBadge"

interface User {
  id: string
  email: string
  full_name?: string
  role: string
}

interface RequisitionDetailPageProps {
  user: User
}

export default function RequisitionDetailPage({ user }: RequisitionDetailPageProps) {
  const { id } = useParams()
  const navigate = useNavigate()
  const isHR = user?.role === 'hr' || user?.role === 'hiring_manager'

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
  const [showBulkUploadModal, setShowBulkUploadModal] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [uploading, setUploading] = useState(false)
  const [uploadResults, setUploadResults] = useState<any>(null)

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

  const handleSubmit = async () => {
    setActionLoading(true)
    try {
      const updated = await submitRequisition(id || '')
      setReq(updated)
      await fetchAll()
    } catch (err: any) {
      alert(err.response?.data?.error || 'Submit failed')
    } finally {
      setActionLoading(false)
    }
  }

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

  const handleBulkUpload = async () => {
    if (selectedFiles.length === 0) {
      alert('Please select at least one file')
      return
    }

    // Validate file types
    const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword']
    const invalidFiles = selectedFiles.filter(f => !validTypes.includes(f.type))
    if (invalidFiles.length > 0) {
      alert(`Invalid file types: ${invalidFiles.map(f => f.name).join(', ')}. Only PDF, DOC, and DOCX files are allowed.`)
      return
    }

    setUploading(true)
    try {
      const formData = new FormData()
      selectedFiles.forEach(file => {
        formData.append('resumes', file)
      })

      const response = await fetch(`/api/requisitions/${id}/bulk-resumes`, {
        method: 'POST',
        credentials: 'include',
        body: formData,
      })

      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Upload failed')
      }

      setUploadResults(data)
      setSelectedFiles([])
      setShowBulkUploadModal(false)
      
      // Refresh requisition data to show new applications
      await fetchAll()
      
      alert(`Upload complete: ${data.succeeded} succeeded, ${data.failed} failed`)
    } catch (err: any) {
      alert(err.message || 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  const canEdit = req && (req.status === 'draft' || req.status === 'needs_changes') && (user?.role === 'hr' || user?.role === 'hiring_manager')
  const canSubmit = req && (req.status === 'draft' || req.status === 'needs_changes') && (user?.role === 'hr' || user?.role === 'hiring_manager')
  const canApprove = req && (req.status === 'submitted' || req.status === 'under_review') && user?.role === 'admin'
  const canReject = req && (req.status === 'submitted' || req.status === 'under_review') && user?.role === 'admin'
  const canRequestChanges = req && (req.status === 'submitted' || req.status === 'under_review') && user?.role === 'admin'
  const canPublish = req && req.status === 'approved' && user?.role === 'admin'
  const canViewApplications = req && (req.status === 'published' || req.status === 'closed') && (user?.role === 'hr' || user?.role === 'hiring_manager' || user?.role === 'admin')
  const canBulkUpload = req && (req.status === 'published' || req.status === 'approved') && (user?.role === 'hr' || user?.role === 'admin')

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <div style={{ textAlign: 'center' }}>
          <div className="spinner" style={{ margin: '0 auto 1rem' }} />
          <p style={{ color: 'var(--text-muted)' }}>Loading…</p>
        </div>
      </div>
    )
  }
  if (error) return <div className="page-container"><div className="alert-error">{error}</div></div>
  if (!req) return null

  return (
    <div className="page-container" style={{ maxWidth: 960 }}>
      <button className="btn-secondary btn-sm" onClick={() => navigate('/recruiter/requisitions')} style={{ marginBottom: '1.5rem' }}>
        ← Back to Requisitions
      </button>

      <div className="glass-card fade-in" style={{ padding: '1.75rem', marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
              {req.title}
            </h1>
            <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
              {req.department && (
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>🏢 {req.department}</span>
              )}
              {req.team && (
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>👥 {req.team}</span>
              )}
              {req.location && (
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>📍 {req.location}</span>
              )}
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                👤 {req.hiring_manager || req.hiring_manager_email}
              </span>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Created {new Date(req.created_at).toLocaleDateString()}
              </span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {canEdit && (
              <button className="btn-secondary btn-sm" onClick={() => navigate(`/recruiter/requisitions/${id}/edit`)}>
                Edit
              </button>
            )}
            {canViewApplications && (
              <button className="btn-primary btn-sm" onClick={() => navigate(`/recruiter/requisitions/${id}/applications`)}>
                View Applications
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Admin Remarks / Rejection Reason */}
      {(req.admin_remarks || req.rejection_reason) && (
        <div className="glass-card" style={{ padding: '1.25rem', marginBottom: '1.25rem' }}>
          {req.rejection_reason && (
            <div style={{
              padding: '0.75rem 1rem',
              background: 'rgba(239,68,68,0.08)',
              border: '1px solid rgba(239,68,68,0.2)',
              borderRadius: 8,
              marginBottom: req.admin_remarks ? '1rem' : 0,
              fontSize: '0.85rem',
              color: '#ef4444'
            }}>
              <strong>Rejection Reason:</strong> {req.rejection_reason}
            </div>
          )}
          {req.admin_remarks && (
            <div style={{
              padding: '0.75rem 1rem',
              background: 'rgba(245,158,11,0.08)',
              border: '1px solid rgba(245,158,11,0.2)',
              borderRadius: 8,
              fontSize: '0.85rem',
              color: '#f59e0b'
            }}>
              <strong>Admin Remarks:</strong> {req.admin_remarks}
            </div>
          )}
        </div>
      )}

      {/* Form Status */}
      {isHR && (
        <div className="glass-card" style={{ padding: '1.25rem', marginBottom: '1.25rem' }}>
          <h2 style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Application Form
          </h2>
          {form ? (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  Form created with {form.fields?.length || 0} field{form.fields?.length !== 1 ? 's' : ''}
                </span>
              </div>
              <button
                className="btn-secondary btn-sm"
                onClick={() => navigate(`/recruiter/requisitions/${id}/form/builder`)}
              >
                Edit Form
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontSize: '0.85rem', color: '#f59e0b' }}>
                  No application form created yet
                </span>
              </div>
              <button
                className="btn-primary btn-sm"
                onClick={() => navigate(`/recruiter/requisitions/${id}/form/builder`)}
              >
                Create Form
              </button>
            </div>
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div className="glass-card" style={{ padding: '1.25rem', marginBottom: '1.25rem' }}>
        <h2 style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Actions
        </h2>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {canSubmit && (
            <button
              className="btn-primary"
              onClick={handleSubmit}
              disabled={actionLoading}
            >
              {actionLoading ? 'Submitting…' : 'Submit for Approval'}
            </button>
          )}
          {canApprove && (
            <button
              className="btn-primary"
              onClick={handleApprove}
              disabled={actionLoading}
              style={{ background: 'rgba(16,185,129,0.1)', borderColor: 'rgba(16,185,129,0.3)', color: '#10b981' }}
            >
              {actionLoading ? 'Approving…' : 'Approve'}
            </button>
          )}
          {canReject && (
            <button
              className="btn-danger"
              onClick={() => setShowRejectModal(true)}
              disabled={actionLoading}
            >
              Reject
            </button>
          )}
          {canRequestChanges && (
            <button
              className="btn-secondary"
              onClick={() => setShowRequestChangesModal(true)}
              disabled={actionLoading}
              style={{ borderColor: 'rgba(245,158,11,0.3)', color: '#f59e0b' }}
            >
              Request Changes
            </button>
          )}
          {canPublish && (
            <button
              className="btn-primary"
              onClick={handlePublish}
              disabled={actionLoading}
              style={{ background: 'rgba(34,197,94,0.1)', borderColor: 'rgba(34,197,94,0.3)', color: '#22c55e' }}
            >
              {actionLoading ? 'Publishing…' : 'Publish Job'}
            </button>
          )}
          {canBulkUpload && (
            <button
              className="btn-primary"
              onClick={() => setShowBulkUploadModal(true)}
              style={{ background: 'rgba(59,130,246,0.1)', borderColor: 'rgba(59,130,246,0.3)', color: '#3b82f6' }}
            >
              Bulk Upload Resumes
            </button>
          )}
        </div>
      </div>

      {/* Requisition Details */}
      <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '1.25rem' }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1.5rem' }}>
          Requisition Details
        </h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem', marginBottom: '1.5rem' }}>
          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Employment Type</label>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>{req.employment_type || 'Not specified'}</p>
          </div>
          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Work Mode</label>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>{req.work_mode || 'Not specified'}</p>
          </div>
          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Number of Openings</label>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>{req.number_of_openings || 1}</p>
          </div>
          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Hiring Priority</label>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>{req.hiring_priority || 'Not specified'}</p>
          </div>
          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Target Joining Date</label>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>{req.target_joining_date ? new Date(req.target_joining_date).toLocaleDateString() : 'Not specified'}</p>
          </div>
          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Application Deadline</label>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>{req.application_deadline ? new Date(req.application_deadline).toLocaleDateString() : 'Not specified'}</p>
          </div>
        </div>

        {req.about_role && (
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>About the Role</label>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '0.25rem', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>{req.about_role}</p>
          </div>
        )}

        {req.responsibilities && (
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Responsibilities</label>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '0.25rem', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>{req.responsibilities}</p>
          </div>
        )}

        {req.required_skills && (
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Required Skills</label>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '0.25rem', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>{req.required_skills}</p>
          </div>
        )}

        {req.preferred_skills && (
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Preferred Skills</label>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '0.25rem', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>{req.preferred_skills}</p>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem', marginBottom: '1.5rem' }}>
          {req.experience_required && (
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Experience Required</label>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>{req.experience_required}</p>
            </div>
          )}
          {req.education_requirements && (
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Education Requirements</label>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>{req.education_requirements}</p>
            </div>
          )}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem' }}>
          {req.salary && (
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Salary</label>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>{req.salary}</p>
            </div>
          )}
          {req.benefits && (
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Benefits</label>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>{req.benefits}</p>
            </div>
          )}
        </div>
      </div>

      {/* Status History */}
      <div className="glass-card" style={{ padding: '1.25rem', marginBottom: '1.25rem' }}>
        <h2 style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Status History
        </h2>
        {logs.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>No status changes yet.</p>
        ) : (
          <div style={{ maxHeight: 280, overflowY: 'auto' }}>
            {logs.map((log: any) => (
              <div key={log.id} className="timeline-item">
                <div className="timeline-dot">
                  <span style={{ fontSize: '0.6rem', color: 'var(--accent)' }}>●</span>
                </div>
                <div style={{ flex: 1, paddingTop: '0.25rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                    {log.from_status && (
                      <>
                        <StatusBadge status={log.from_status} />
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>→</span>
                      </>
                    )}
                    <StatusBadge status={log.to_status} />
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {new Date(log.changed_at).toLocaleString()}
                  </div>
                  {log.remarks && (
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.25rem', fontStyle: 'italic' }}>
                      "{log.remarks}"
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Reject Modal */}
      {showRejectModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000
        }}>
          <div className="glass-card" style={{ padding: '2rem', maxWidth: 500, width: '90%' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem' }}>
              Reject Requisition
            </h2>
            <label className="label" htmlFor="reject-reason">Rejection Reason *</label>
            <textarea
              id="reject-reason"
              className="input-field"
              placeholder="Please explain why this requisition is being rejected…"
              value={rejectionReason}
              onChange={e => setRejectionReason(e.target.value)}
              rows={4}
              style={{ resize: 'vertical', marginBottom: '1rem' }}
            />
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
              <button
                className="btn-secondary"
                onClick={() => { setShowRejectModal(false); setRejectionReason('') }}
                disabled={actionLoading}
              >
                Cancel
              </button>
              <button
                className="btn-danger"
                onClick={handleReject}
                disabled={actionLoading}
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
          <div className="glass-card" style={{ padding: '2rem', maxWidth: 500, width: '90%' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem' }}>
              Request Changes
            </h2>
            <label className="label" htmlFor="admin-remarks"> remarks/Comments *</label>
            <textarea
              id="admin-remarks"
              className="input-field"
              placeholder="Please describe the changes needed…"
              value={adminRemarks}
              onChange={e => setAdminRemarks(e.target.value)}
              rows={4}
              style={{ resize: 'vertical', marginBottom: '1rem' }}
            />
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
              <button
                className="btn-secondary"
                onClick={() => { setShowRequestChangesModal(false); setAdminRemarks('') }}
                disabled={actionLoading}
              >
                Cancel
              </button>
              <button
                className="btn-primary"
                onClick={handleRequestChanges}
                disabled={actionLoading}
                style={{ borderColor: 'rgba(245,158,11,0.3)', color: '#f59e0b' }}
              >
                {actionLoading ? 'Requesting…' : 'Request Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Upload Modal */}
      {showBulkUploadModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000
        }}>
          <div className="glass-card" style={{ padding: '2rem', maxWidth: 600, width: '90%' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem' }}>
              Bulk Upload Resumes
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
              Upload multiple resume files (PDF, DOC, DOCX) to create candidate records and applications for this requisition.
              Maximum 50 files, 10MB each.
            </p>
            
            <div
              style={{
                border: '2px dashed rgba(59,130,246,0.3)',
                borderRadius: 8,
                padding: '2rem',
                textAlign: 'center',
                marginBottom: '1rem',
                cursor: 'pointer',
                background: 'rgba(59,130,246,0.05)'
              }}
              onClick={() => document.getElementById('file-input')?.click()}
            >
              <input
                id="file-input"
                type="file"
                multiple
                accept=".pdf,.doc,.docx"
                style={{ display: 'none' }}
                onChange={(e) => {
                  const files = Array.from(e.target.files || []);
                  if (files.length > 50) {
                    alert('Maximum 50 files allowed');
                    return;
                  }
                  setSelectedFiles(files);
                }}
              />
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📄</div>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                {selectedFiles.length > 0 
                  ? `${selectedFiles.length} file${selectedFiles.length !== 1 ? 's' : ''} selected`
                  : 'Click to select files or drag and drop'
                }
              </p>
            </div>

            {selectedFiles.length > 0 && (
              <div style={{ marginBottom: '1rem', maxHeight: '150px', overflowY: 'auto' }}>
                {selectedFiles.map((file, index) => (
                  <div key={index} style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    padding: '0.5rem',
                    background: 'rgba(255,255,255,0.5)',
                    borderRadius: 4,
                    marginBottom: '0.25rem'
                  }}>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                    </span>
                    <button
                      onClick={() => setSelectedFiles(selectedFiles.filter((_, i) => i !== index))}
                      style={{ 
                        background: 'none', 
                        border: 'none', 
                        color: '#ef4444', 
                        cursor: 'pointer',
                        fontSize: '1.2rem'
                      }}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
              <button
                className="btn-secondary"
                onClick={() => { setShowBulkUploadModal(false); setSelectedFiles([]); setUploadResults(null) }}
                disabled={uploading}
              >
                Cancel
              </button>
              <button
                className="btn-primary"
                onClick={handleBulkUpload}
                disabled={uploading || selectedFiles.length === 0}
                style={{ background: 'rgba(59,130,246,0.1)', borderColor: 'rgba(59,130,246,0.3)', color: '#3b82f6' }}
              >
                {uploading ? 'Uploading…' : 'Upload Resumes'}
              </button>
            </div>

            {uploadResults && (
              <div style={{ marginTop: '1rem', padding: '1rem', background: 'rgba(34,197,94,0.1)', borderRadius: 8 }}>
                <p style={{ fontSize: '0.9rem', color: '#16a34a', marginBottom: '0.5rem' }}>
                  Upload Results: {uploadResults.succeeded} succeeded, {uploadResults.failed} failed
                </p>
                {uploadResults.results.some((r: any) => r.status === 'failed') && (
                  <div style={{ maxHeight: '100px', overflowY: 'auto' }}>
                    {uploadResults.results.filter((r: any) => r.status === 'failed').map((result: any, index: number) => (
                      <div key={index} style={{ fontSize: '0.8rem', color: '#ef4444', marginBottom: '0.25rem' }}>
                        {result.fileName}: {result.error}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
