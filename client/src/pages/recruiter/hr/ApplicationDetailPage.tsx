import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getApplication, updateApplicationStatus } from "../../../api/recruiter/applications"
import ApplicationStatusBadge from "../../../components/recruiter/ApplicationStatusBadge"
import ResponseRenderer from "../../../components/recruiter/ResponseRenderer"

const ApplicationDetailPage: React.FC = () => {
  const { id, aid } = useParams()
  const navigate = useNavigate()
  const [application, setApplication] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [status, setStatus] = useState('')
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    fetchApplication()
  }, [id, aid])

  const fetchApplication = async () => {
    try {
      const data = await getApplication(id || '', aid || '')
      setApplication(data)
      setStatus(data.status)
    } catch (err) {
      console.error('Failed to fetch application:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async () => {
    setUpdating(true)
    try {
      const updated = await updateApplicationStatus(id || '', aid || '', status)
      setApplication({ ...application, status: updated.status })
    } catch (err) {
      console.error('Failed to update status:', err)
    } finally {
      setUpdating(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  if (!application) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Application Not Found</h2>
          <button
            onClick={() => navigate(`/recruiter/requisitions/${id}/applications`)}
            className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
          >
            Back to Applications
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <button
            onClick={() => navigate(`/recruiter/requisitions/${id}/applications`)}
            className="text-indigo-600 hover:text-indigo-800 mb-4 inline-flex items-center"
          >
            ← Back to Applications
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Application Details</h1>
        </div>

        {/* Candidate Info Card */}
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Candidate Information</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-500">Candidate ID</label>
              <p className="mt-1 text-gray-900">{application.candidate_id || 'N/A'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">Submitted</label>
              <p className="mt-1 text-gray-900">
                {new Date(application.submitted_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">Current Status</label>
              <div className="mt-1">
                <ApplicationStatusBadge status={application.status} />
              </div>
            </div>
          </div>
        </div>

        {/* Status Update */}
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Update Status</h2>
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-500 mb-1">
                New Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="submitted">Submitted</option>
                <option value="under_review">Under Review</option>
                <option value="shortlisted">Shortlisted</option>
                <option value="rejected">Rejected</option>
                <option value="hired">Hired</option>
              </select>
            </div>
            <button
              onClick={handleStatusUpdate}
              disabled={updating || status === application.status}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {updating ? 'Updating...' : 'Update Status'}
            </button>
          </div>
        </div>

        {/* Responses */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Application Responses</h2>
          
          {application.responses?.length === 0 ? (
            <p className="text-gray-500">No responses recorded.</p>
          ) : (
            <div className="space-y-6">
              {application.responses.map((response: any, idx: number) => (
                <div key={idx} className="border-b border-gray-200 pb-6 last:border-0 last:pb-0">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="font-medium text-gray-900">{response.label}</h3>
                    <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded">
                      {response.field_type}
                    </span>
                  </div>
                  <ResponseRenderer
                    field_type={response.field_type}
                    response_text={response.response_text}
                    response_json={response.response_json}
                    file_url={response.file_url}
                    max_rating={5}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ApplicationDetailPage
