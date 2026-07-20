import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getPendingApprovals, approveForm, rejectForm, requestFormChanges } from "../../../api/recruiter/formApprovals"

const FormApprovalsPage: React.FC = () => {
  const navigate = useNavigate()
  const [approvals, setApprovals] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [showRequestChangesModal, setShowRequestChangesModal] = useState<string | null>(null)
  const [remarks, setRemarks] = useState('')

  useEffect(() => {
    fetchApprovals()
  }, [])

  const fetchApprovals = async () => {
    try {
      const data = await getPendingApprovals()
      setApprovals(data)
    } catch (err: any) {
      console.error('Failed to fetch approvals:', err)
      if (err.message.includes('403')) {
        setMessage('Only admins can view form approvals')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (approvalId: string) => {
    try {
      const result = await approveForm(approvalId)
      setMessage(result.message)
      await fetchApprovals()
      setTimeout(() => setMessage(''), 3000)
    } catch (err: any) {
      console.error('Failed to approve form:', err)
      setMessage(err.message || 'Failed to approve form')
    }
  }

  const handleReject = async (approvalId: string) => {
    if (!confirm('Are you sure you want to reject this form?')) return
    try {
      const result = await rejectForm(approvalId)
      setMessage(result.message)
      await fetchApprovals()
      setTimeout(() => setMessage(''), 3000)
    } catch (err: any) {
      console.error('Failed to reject form:', err)
      setMessage(err.message || 'Failed to reject form')
    }
  }

  const handleRequestChanges = async (approvalId: string) => {
    if (!remarks.trim()) {
      alert('Please provide remarks for the requested changes')
      return
    }
    try {
      const result = await requestFormChanges(approvalId, remarks)
      setMessage(result.message)
      setShowRequestChangesModal(null)
      setRemarks('')
      await fetchApprovals()
      setTimeout(() => setMessage(''), 3000)
    } catch (err: any) {
      console.error('Failed to request changes:', err)
      setMessage(err.message || 'Failed to request changes')
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <button
            onClick={() => navigate('/recruiter/requisitions')}
            className="text-indigo-600 hover:text-indigo-800 mb-4 inline-flex items-center"
          >
            ← Back to Requisitions
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Form Approvals</h1>
          <p className="mt-2 text-gray-600">Review and approve application forms submitted by hiring managers</p>
        </div>

        {message && (
          <div className={`mb-6 p-4 rounded-md text-sm ${
            message.includes('approved') || message.includes('published') 
              ? 'bg-green-50 border border-green-200 text-green-600' 
              : message.includes('rejected')
              ? 'bg-red-50 border border-red-200 text-red-600'
              : 'bg-indigo-50 border border-indigo-200 text-indigo-600'
          }`}>
            {message}
          </div>
        )}

        {approvals.length === 0 ? (
          <div className="text-center py-12">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No pending approvals</h3>
            <p className="mt-1 text-sm text-gray-500">All forms are up to date.</p>
          </div>
        ) : (
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Requisition
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Department
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Requested By
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {approvals.map((item: any) => (
                    <tr key={item.approval.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{item.requisition.title}</div>
                        <div className="text-sm text-gray-500">{item.requisition.memo_no || 'N/A'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{item.requisition.department || 'N/A'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {[item.requester.firstName, item.requester.lastName].filter(Boolean).join(' ') || 'N/A'}
                        </div>
                        <div className="text-sm text-gray-500">{item.requester.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{formatDate(item.form.created_at)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex gap-2">
                          <button
                            onClick={() => navigate(`/recruiter/requisitions/${item.requisition.id}/form/builder`)}
                            className="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
                          >
                            View Form
                          </button>
                          <button
                            onClick={() => handleApprove(item.approval.id)}
                            className="text-green-600 hover:text-green-900 text-sm font-medium"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => setShowRequestChangesModal(item.approval.id)}
                            className="text-yellow-600 hover:text-yellow-900 text-sm font-medium"
                          >
                            Request Changes
                          </button>
                          <button
                            onClick={() => handleReject(item.approval.id)}
                            className="text-red-600 hover:text-red-900 text-sm font-medium"
                          >
                            Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Request Changes Modal */}
        {showRequestChangesModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Request Changes</h3>
              <textarea
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                placeholder="Please specify the changes needed..."
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-4"
              />
              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => {
                    setShowRequestChangesModal(null)
                    setRemarks('')
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleRequestChanges(showRequestChangesModal)}
                  className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
                >
                  Request Changes
                </button>
              </div>
            </div>
          </div>
        )}
    </div>
  )
}

export default FormApprovalsPage
