import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { getRequisitions, deleteRequisition } from "../../api/recruiter/requisitions"
import { toUserMessage } from "../../utils/toUserMessage"

interface User {
  id: string
  email: string
  full_name?: string
  role: string
}

interface AdminRequisitionsPageProps {
  user: User
}

export default function AdminRequisitionsPage({ user }: AdminRequisitionsPageProps) {
  const navigate = useNavigate()
  const [requisitions, setRequisitions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [deleting, setDeleting] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

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
    } catch (err: unknown) {
      alert(toUserMessage(err, 'Delete failed'))
    } finally {
      setDeleting(null)
    }
  }

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

  const getPriorityClass = (priority: string) => {
    switch (priority) {
      case 'high': return 'admin-priority-high'
      case 'medium': return 'admin-priority-medium'
      case 'low': return 'admin-priority-low'
      default: return 'admin-priority-low'
    }
  }

  const filteredRequisitions = requisitions.filter(req => {
    const matchesSearch = req.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         req.department?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || req.status === statusFilter
    const matchesTab = activeTab === 'all' || 
                      (activeTab === 'pending' && (req.status === 'submitted' || req.status === 'under_review')) ||
                      (activeTab === 'approved' && req.status === 'approved') ||
                      (activeTab === 'rejected' && req.status === 'rejected')
    return matchesSearch && matchesStatus && matchesTab
  })

  const getTabCount = (tab: string) => {
    if (tab === 'all') return requisitions.length
    if (tab === 'pending') return requisitions.filter(r => r.status === 'submitted' || r.status === 'under_review').length
    if (tab === 'approved') return requisitions.filter(r => r.status === 'approved').length
    if (tab === 'rejected') return requisitions.filter(r => r.status === 'rejected').length
    return 0
  }

  if (loading) {
    return (
      <div className="admin-page-container">
        <div className="admin-requisition-grid">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="admin-requisition-card">
              <div className="admin-card-content">
                <div className="admin-card-header mb-4">
                  <div className="hh-skeleton h-6 w-20 rounded mb-2" />
                  <div className="hh-skeleton h-6 w-16 rounded" />
                </div>
                <div className="hh-skeleton h-6 w-3/4 rounded mb-4" />
                <div className="admin-card-meta space-y-2">
                  <div className="hh-skeleton h-4 w-1/2 rounded" />
                  <div className="hh-skeleton h-4 w-1/3 rounded" />
                </div>
                <div className="admin-card-stats mt-4 space-y-2">
                  <div className="hh-skeleton h-4 w-24 rounded" />
                  <div className="hh-skeleton h-4 w-20 rounded" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="admin-page-container">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Job Requisitions</h1>
          <p className="admin-page-subtitle">
            {requisitions.length} total requisition{requisitions.length !== 1 ? 's' : ''}
          </p>
        </div>
        <button className="admin-btn-primary" onClick={() => navigate('/admin/requisitions/new')}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M12 5v14M5 12h14" />
          </svg>
          New Requisition
        </button>
      </div>

      {/* Filter Bar */}
      <div className="admin-filter-bar">
        <input
          type="text"
          className="admin-search-input"
          placeholder="Search requisitions..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="admin-filter-select"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All Status</option>
          <option value="draft">Draft</option>
          <option value="submitted">Submitted</option>
          <option value="under_review">Under Review</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
          <option value="published">Published</option>
        </select>
      </div>

      {/* Tabs */}
      <div className="admin-tabs">
        <button 
          className={`admin-tab ${activeTab === 'all' ? 'admin-tab-active' : ''}`}
          onClick={() => setActiveTab('all')}
        >
          All <span className="admin-badge-count">{getTabCount('all')}</span>
        </button>
        <button 
          className={`admin-tab ${activeTab === 'pending' ? 'admin-tab-active' : ''}`}
          onClick={() => setActiveTab('pending')}
        >
          Pending <span className="admin-badge-count">{getTabCount('pending')}</span>
        </button>
        <button 
          className={`admin-tab ${activeTab === 'approved' ? 'admin-tab-active' : ''}`}
          onClick={() => setActiveTab('approved')}
        >
          Approved <span className="admin-badge-count">{getTabCount('approved')}</span>
        </button>
        <button 
          className={`admin-tab ${activeTab === 'rejected' ? 'admin-tab-active' : ''}`}
          onClick={() => setActiveTab('rejected')}
        >
          Rejected <span className="admin-badge-count">{getTabCount('rejected')}</span>
        </button>
      </div>

      {error && (
        <div style={{ 
          background: '#fee2e2', 
          border: '1px solid #fecaca', 
          color: '#dc2626', 
          borderRadius: 8, 
          padding: '0.75rem 1rem', 
          marginBottom: '1.5rem',
          fontSize: '0.875rem'
        }}>
          {error}
        </div>
      )}

      {filteredRequisitions.length === 0 ? (
        <div className="admin-empty-state hh-fade-in" style={{ backgroundColor: 'var(--hh-surface-soft)', borderRadius: 'var(--hh-radius-lg)', padding: '3rem', textAlign: 'center' }}>
          <div className="admin-empty-icon text-4xl mb-4">📋</div>
          <h3 className="admin-empty-title" style={{ color: 'var(--hh-text)', marginBottom: '0.5rem' }}>No requisitions found</h3>
          <p className="admin-empty-text" style={{ color: 'var(--hh-text-secondary)' }}>Try adjusting your filters or create a new requisition.</p>
        </div>
      ) : (
        <div className="admin-requisition-grid hh-stagger">
          {filteredRequisitions.map((req) => (
            <div
              key={req.id}
              className="admin-requisition-card hh-lift hh-stagger-item"
              onClick={() => navigate(`/admin/requisitions/${req.id}`)}
              role="button"
              aria-label={`View requisition ${req.title}`}
            >
              {/* Priority Indicator */}
              {req.hiring_priority && (
                <div className={`admin-card-priority ${getPriorityClass(req.hiring_priority)}`} />
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

                {/* User Info */}
                {req.hiring_manager && (
                  <div className="admin-card-user">
                    <div className="admin-card-avatar">
                      {req.hiring_manager.charAt(0).toUpperCase()}
                    </div>
                    <div className="admin-card-user-info">
                      <div className="admin-card-user-name">{req.hiring_manager}</div>
                      <div className="admin-card-user-role">Hiring Manager</div>
                    </div>
                  </div>
                )}

                {/* Stats */}
                <div className="admin-card-stats">
                  <div className="admin-stat-item">
                    <span>📅</span>
                    <span className="admin-stat-value">{new Date(req.created_at).toLocaleDateString()}</span>
                  </div>
                  {req.number_of_openings && (
                    <div className="admin-stat-item">
                      <span>👥</span>
                      <span className="admin-stat-value">{req.number_of_openings} opening{req.number_of_openings !== 1 ? 's' : ''}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="admin-card-actions">
                {user?.role === 'admin' && (
                  <button
                    className="admin-action-btn admin-action-btn-danger"
                    onClick={(e) => handleDelete(e, req.id)}
                    disabled={deleting === req.id}
                  >
                    {deleting === req.id ? 'Deleting…' : 'Delete'}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
