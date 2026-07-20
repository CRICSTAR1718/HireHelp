import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { assignmentApi, type Assignment } from "../../api/interviewer"
import { Calendar, Clock, User, Video, Mail, Briefcase, MapPin, CheckCircle } from 'lucide-react'

export default function AllInterviews() {
  const navigate = useNavigate()
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAssignments()
  }, [])

  const fetchAssignments = async () => {
    try {
      const data = await assignmentApi.getAllAssignmentsUnfiltered()
      // Deduplicate assignments by interviewId to prevent duplicate cards
      const uniqueAssignments = data.filter((assignment, index, self) =>
        index === self.findIndex((a) => a.interviewId === assignment.interviewId)
      )
      setAssignments(uniqueAssignments)
    } catch (err) {
      console.error('Failed to fetch interviews:', err)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'in_progress': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'completed': return 'bg-green-100 text-green-800 border-green-200'
      case 'scheduled': return 'bg-blue-100 text-blue-800 border-blue-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
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
    <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">All Scheduled Interviews</h1>
          <p className="text-gray-600">View all scheduled interviews across the organization</p>
        </div>

        <div className="mb-6 flex gap-4">
          <button
            onClick={() => navigate('/recruiter/interviews')}
            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
          >
            My Interviews
          </button>
          <button
            onClick={() => navigate('/recruiter/interviews/schedule')}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Schedule New Interview
          </button>
        </div>

        {assignments.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <Calendar className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No interviews scheduled</h3>
            <p className="mt-1 text-sm text-gray-500">Schedule the first interview to get started.</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {assignments.map((assignment) => (
              <div
                key={assignment.id}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 border border-gray-200"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center">
                      <User className="w-6 h-6 text-indigo-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {assignment.candidateName || `Candidate #${assignment.candidateId}`}
                      </h3>
                      <p className="text-sm text-gray-500">{assignment.candidateEmail}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(assignment.status)}`}>
                    {assignment.status}
                  </span>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Briefcase className="w-4 h-4 text-gray-400" />
                    <span className="font-medium text-gray-900">{assignment.role}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <User className="w-4 h-4 text-gray-400" />
                    <span>Interviewer: {assignment.interviewerName || `Interviewer #${assignment.interviewerId}`}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span>{assignment.interviewerEmail}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100 mb-4">
                  <div className="text-sm text-gray-500">
                    <div className="flex items-center">
                      <Calendar className="w-3 h-3 mr-1" />
                      Assigned: {new Date(assignment.assignedAt).toLocaleDateString()}
                    </div>
                  </div>
                  {assignment.completedAt && (
                    <div className="text-sm text-gray-500">
                      <div className="flex items-center">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Completed: {new Date(assignment.completedAt).toLocaleDateString()}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  {assignment.schedule?.meetingLink ? (
                    <a
                      href={assignment.schedule.meetingLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium flex items-center justify-center gap-2"
                    >
                      <Video className="w-4 h-4" />
                      Join Meeting
                    </a>
                  ) : (
                    <button className="flex-1 bg-gray-100 text-gray-400 py-2 px-4 rounded-lg text-sm font-medium flex items-center justify-center gap-2 cursor-not-allowed">
                      <Video className="w-4 h-4" />
                      No Link
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
