import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from "../../api/recruiter"

interface Interview {
  id: string
  applicationId: string
  candidateId: string
  round: string
  scheduledDate: string | null
  status: 'scheduled' | 'completed' | 'cancelled'
  interviewerIds: string[]
  notes?: string
}

export default function InterviewPanel() {
  const { id, aid } = useParams()
  const navigate = useNavigate()
  const [interviews, setInterviews] = useState<Interview[]>([])
  const [loading, setLoading] = useState(true)
  const [showScheduleModal, setShowScheduleModal] = useState(false)
  const [newInterview, setNewInterview] = useState({
    round: 'Technical',
    scheduledDate: '',
    interviewerIds: [] as string[]
  })

  useEffect(() => {
    fetchInterviews()
  }, [id, aid])

  const fetchInterviews = async () => {
    try {
      // In a real app, this would call interview-service API
      // For now, we'll mock it or call through this service
      const response = await api.get(`/requisitions/${id}/applications/${aid}/interviews`)
      setInterviews(response.data || [])
    } catch (err) {
      console.error('Failed to fetch interviews:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleScheduleInterview = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await api.post(`/requisitions/${id}/applications/${aid}/interviews`, newInterview)
      setShowScheduleModal(false)
      setNewInterview({ round: 'Technical', scheduledDate: '', interviewerIds: [] })
      fetchInterviews()
    } catch (err) {
      console.error('Failed to schedule interview:', err)
    }
  }

  const handleUpdateStatus = async (interviewId: string, status: string) => {
    try {
      await api.patch(`/requisitions/${id}/applications/${aid}/interviews/${interviewId}`, { status })
      fetchInterviews()
    } catch (err) {
      console.error('Failed to update interview status:', err)
    }
  }

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
            onClick={() => navigate(`/recruiter/requisitions/${id}/applications/${aid}`)}
            className="text-indigo-600 hover:text-indigo-800 mb-4 inline-flex items-center"
          >
            ← Back to Application
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Interview Schedule</h1>
          <p className="mt-2 text-gray-600">Manage interview rounds for this candidate</p>
        </div>

        <div className="mb-6">
          <button
            onClick={() => setShowScheduleModal(true)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
          >
            Schedule New Interview
          </button>
        </div>

        {interviews.length === 0 ? (
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
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No interviews scheduled</h3>
            <p className="mt-1 text-sm text-gray-500">Schedule the first interview round for this candidate.</p>
          </div>
        ) : (
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Round
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Scheduled Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {interviews.map((interview) => (
                  <tr key={interview.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{interview.round}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {interview.scheduledDate
                          ? new Date(interview.scheduledDate).toLocaleDateString()
                          : 'Not scheduled'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          interview.status === 'scheduled'
                            ? 'bg-blue-100 text-blue-800'
                            : interview.status === 'completed'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {interview.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {interview.status === 'scheduled' && (
                        <>
                          <button
                            onClick={() => handleUpdateStatus(interview.id, 'completed')}
                            className="text-green-600 hover:text-green-900 mr-4"
                          >
                            Mark Complete
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(interview.id, 'cancelled')}
                            className="text-red-600 hover:text-red-900"
                          >
                            Cancel
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {showScheduleModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <h2 className="text-xl font-bold mb-4">Schedule Interview</h2>
              <form onSubmit={handleScheduleInterview}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Interview Round
                  </label>
                  <select
                    value={newInterview.round}
                    onChange={(e) => setNewInterview({ ...newInterview, round: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="HR Screening">HR Screening</option>
                    <option value="Technical">Technical</option>
                    <option value="Managerial">Managerial</option>
                    <option value="Final">Final</option>
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Scheduled Date
                  </label>
                  <input
                    type="datetime-local"
                    value={newInterview.scheduledDate}
                    onChange={(e) => setNewInterview({ ...newInterview, scheduledDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowScheduleModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                  >
                    Schedule
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
