import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getApprovals, createApproval, decideApproval } from "../../api/recruiter/approvals"
import StatusBadge from "../../components/recruiter/StatusBadge"

const APPROVAL_STATUS_MAP: Record<string, string> = {
  pending:  'draft',
  approved: 'open',
  rejected: 'closed'
}

interface User {
  id: string
  email: string
  full_name?: string
  role: string
}

interface ApprovalsPageProps {
  user: User
}

export default function ApprovalsPage({ user }: ApprovalsPageProps) {
  const { id: reqId } = useParams()
  const navigate = useNavigate()

  const [approvals, setApprovals] = useState<any[]>([])
  const [loading, setLoading]     = useState(true)
  const [error, setError]         = useState('')
  const [deciding, setDeciding]   = useState<string | null>(null)

  const canApprove = user?.role === 'admin' || user?.role === 'recruiter'

  const fetchApprovals = async () => {
    setLoading(true)
    try {
      const data = await getApprovals(reqId || '')
      setApprovals(data)
    } catch (err) {
      setError('Failed to load approvals')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchApprovals() }, [reqId])

  const handleAddSelf = async () => {
    try {
      await createApproval(reqId || '', { approver_role: user.role })
      fetchApprovals()
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to add approval')
    }
  }

  const handleDecide = async (approvalId: string, status: string) => {
    setDeciding(approvalId)
    try {
      await decideApproval(reqId || '', approvalId, status)
      fetchApprovals()
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to update approval')
    } finally {
      setDeciding(null)
    }
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="spinner" />
      </div>
    )
  }

  return (
    <div className="page-container" style={{ maxWidth: 720 }}>
      <button className="btn-secondary btn-sm" onClick={() => navigate(`/recruiter/requisitions/${reqId}`)} style={{ marginBottom: '1.5rem' }}>
        ← Back to Requisition
      </button>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
            Approvals
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            {approvals.length} approval record{approvals.length !== 1 ? 's' : ''}
          </p>
        </div>
        {canApprove && (
          <button id="add-self-approver" className="btn-primary" onClick={handleAddSelf}>
            + Add Myself as Approver
          </button>
        )}
      </div>

      {error && <div className="alert-error" style={{ marginBottom: '1.5rem' }}>{error}</div>}

      {approvals.length === 0 ? (
        <div className="empty-state glass-card" style={{ padding: '3rem' }}>
          <div className="empty-state-icon">📋</div>
          <h3 style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>No approvals yet</h3>
          <p>
            {canApprove
              ? 'Click "Add Myself as Approver" to start the approval process.'
              : 'No approval records have been created for this requisition.'}
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {approvals.map((a: any) => (
            <div key={a.id} className="glass-card" style={{ padding: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
                    <div
                      style={{
                        width: 32, height: 32, borderRadius: '50%',
                        background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '0.8rem', fontWeight: 700, color: 'white', flexShrink: 0
                      }}
                    >
                      {(a.approver_role || '?')?.[0]?.toUpperCase()}
                    </div>
                    <div>
                      <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)', textTransform: 'capitalize' }}>
                        {a.approver_role?.replace('_', ' ') || 'Unknown Role'}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        ID: {a.approver_id?.slice(0, 8)}…
                      </div>
                    </div>
                  </div>
                  {a.decided_at && (
                    <div style={{ fontSize: '0.775rem', color: 'var(--text-muted)', marginLeft: '2.75rem' }}>
                      Decided: {new Date(a.decided_at).toLocaleString()}
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <StatusBadge status={APPROVAL_STATUS_MAP[a.status] || 'draft'} />

                  {a.status === 'pending' && canApprove && (
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        id={`approve-${a.id}`}
                        className="btn-success btn-sm"
                        onClick={() => handleDecide(a.id, 'approved')}
                        disabled={deciding === a.id}
                      >
                        {deciding === a.id ? '…' : '✓ Approve'}
                      </button>
                      <button
                        id={`reject-${a.id}`}
                        className="btn-danger btn-sm"
                        onClick={() => handleDecide(a.id, 'rejected')}
                        disabled={deciding === a.id}
                      >
                        {deciding === a.id ? '…' : '✗ Reject'}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
