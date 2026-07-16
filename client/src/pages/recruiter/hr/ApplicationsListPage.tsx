import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { getApplications } from "../../../api/recruiter/applications"
import ApplicationStatusBadge from "../../../components/recruiter/ApplicationStatusBadge"
import FitmentScore from "../../../components/recruiter/FitmentScore"

const ApplicationsListPage: React.FC = () => {
  const { id } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const [applications, setApplications] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('all')
  const [error, setError] = useState('')
  const basePath = location.pathname.startsWith('/admin') ? '/admin' : '/recruiter'
  const isScopedView = Boolean(id)

  useEffect(() => {
    fetchApplications()
  }, [id])

  const fetchApplications = async () => {
    setError('')
    try {
      const data = await getApplications(id || undefined)
      setApplications(data)
    } catch (err) {
      console.error('Failed to fetch applications:', err)
      setError('Failed to load submitted applications')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const formatCandidateName = (app: any) => {
    const name = [app.candidate_first_name, app.candidate_last_name].filter(Boolean).join(' ').trim()
    return name || app.candidate_email || app.candidate_id || 'N/A'
  }

  const filteredApplications = statusFilter === 'all' 
    ? applications 
    : applications.filter(app => app.status === statusFilter)

  const title = isScopedView ? 'Applications' : 'All Submitted Applications'
  const subtitle = isScopedView
    ? 'Review and manage candidate applications for this requisition'
    : 'Review every submitted application across requisitions'

  const backTarget = isScopedView ? `${basePath}/requisitions/${id}` : `${basePath}/requisitions`

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <button
            onClick={() => navigate(backTarget)}
            className="text-indigo-600 hover:text-indigo-800 mb-4 inline-flex items-center"
          >
            ← {isScopedView ? 'Back to Requisition' : 'Back to Requisitions'}
          </button>
          <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
          <p className="mt-2 text-gray-600">{subtitle}</p>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Filter by Status
          </label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All Statuses</option>
            <option value="submitted">Submitted</option>
            <option value="under_review">Under Review</option>
            <option value="shortlisted">Shortlisted</option>
            <option value="rejected">Rejected</option>
            <option value="hired">Hired</option>
          </select>
        </div>

        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {applications.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
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
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              {isScopedView ? 'No applications yet' : 'No applications submitted yet'}
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {isScopedView
                ? 'No candidates have applied to this position yet.'
                : 'No submitted applications were found across requisitions.'}
            </p>
          </div>
        ) : (
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {!isScopedView && (
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Requisition
                      </th>
                    )}
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Candidate
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Submitted
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fitment
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredApplications.map((app: any) => (
                    <tr key={app.id} className="hover:bg-gray-50">
                      {!isScopedView && (
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{app.requisition_title || 'N/A'}</div>
                          <div className="text-xs text-gray-500">{app.department || app.location || 'Requisition'}</div>
                        </td>
                      )}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{formatCandidateName(app)}</div>
                        <div className="text-xs text-gray-500">{app.candidate_email || app.candidate_id || 'N/A'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{formatDate(app.submitted_at)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <ApplicationStatusBadge status={app.status} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <FitmentScore score={app.ai_score} status={app.ai_status} compact />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => navigate(isScopedView ? `${basePath}/requisitions/${id}/applications/${app.id}` : `${basePath}/applications/${app.id}`)}
                          className="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {filteredApplications.length === 0 && applications.length > 0 && (
              <div className="text-center py-8 text-gray-500">
                No applications match the selected filter.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default ApplicationsListPage
