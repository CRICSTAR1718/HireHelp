import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppSelector } from '@/store/hooks'
import { assignmentApi, type Assignment } from '../../api/interviewer/assignment.api'
import { Calendar, Clock, Users, CheckCircle, AlertCircle, TrendingUp, ArrowRight } from 'lucide-react'

export default function InterviewerDashboard() {
  const navigate = useNavigate()
  const user = useAppSelector((s) => s.auth.user)
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    pending: 0,
    today: 0
  })

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      if (!user?.id) {
        throw new Error('User not authenticated')
      }

      const rawData = await assignmentApi.getInterviewerAssignments()
      const data = Array.isArray(rawData) ? rawData : []
      setAssignments(data)

      // Calculate stats
      const today = new Date().toDateString()
      const todayCount = data.filter(a => new Date(a.assignedAt).toDateString() === today).length
      const completedCount = data.filter(a => a.status === 'completed').length
      const pendingCount = data.filter(a => a.status === 'pending' || a.status === 'assigned').length

      setStats({
        total: data.length,
        completed: completedCount,
        pending: pendingCount,
        today: todayCount
      })
    } catch (err: any) {
      console.error('Failed to fetch dashboard data:', err)
      setError(err.response?.data?.error || 'Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-700 border-green-200'
      case 'pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200'
      case 'assigned': return 'bg-blue-100 text-blue-700 border-blue-200'
      default: return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 font-medium mb-2">Error loading dashboard</p>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Interviewer Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's your interview overview.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-sm text-gray-500">Total</span>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">{stats.total}</div>
          <div className="text-sm text-gray-600">Total Interviews</div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <span className="text-sm text-gray-500">Completed</span>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">{stats.completed}</div>
          <div className="text-sm text-gray-600">Completed Interviews</div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <span className="text-sm text-gray-500">Pending</span>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">{stats.pending}</div>
          <div className="text-sm text-gray-600">Pending Interviews</div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Calendar className="w-6 h-6 text-purple-600" />
            </div>
            <span className="text-sm text-gray-500">Today</span>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">{stats.today}</div>
          <div className="text-sm text-gray-600">Interviews Today</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div 
          className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => navigate('/interviewer/interviews')}
        >
          <div className="flex items-center justify-between mb-4">
            <Calendar className="w-8 h-8" />
            <ArrowRight className="w-5 h-5 opacity-80" />
          </div>
          <h3 className="text-xl font-bold mb-2">My Interviews</h3>
          <p className="text-blue-100 text-sm">View and manage your assigned interviews</p>
        </div>

        <div 
          className="bg-linear-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => navigate('/interviewer/calendar')}
        >
          <div className="flex items-center justify-between mb-4">
            <Calendar className="w-8 h-8" />
            <ArrowRight className="w-5 h-5 opacity-80" />
          </div>
          <h3 className="text-xl font-bold mb-2">Calendar</h3>
          <p className="text-purple-100 text-sm">View your interview schedule</p>
        </div>

        <div 
          className="bg-linear-to-br from-green-500 to-green-600 rounded-xl p-6 text-white cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => navigate('/interviewer/feedback')}
        >
          <div className="flex items-center justify-between mb-4">
            <CheckCircle className="w-8 h-8" />
            <ArrowRight className="w-5 h-5 opacity-80" />
          </div>
          <h3 className="text-xl font-bold mb-2">Feedback</h3>
          <p className="text-green-100 text-sm">Submit interview feedback</p>
        </div>
      </div>

      {/* Recent Interviews */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Recent Interviews</h2>
          <button 
            className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
            onClick={() => navigate('/interviewer/interviews')}
          >
            View All <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {assignments.length === 0 ? (
          <div className="text-center py-12">
            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-2">No interviews assigned yet</p>
            <p className="text-gray-500 text-sm">You'll see your assigned interviews here</p>
          </div>
        ) : (
          <div className="space-y-4">
            {assignments.slice(0, 5).map((assignment) => (
              <div 
                key={assignment.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                onClick={() => navigate(`/interviewer/feedback/${assignment.interviewId}`)}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{assignment.candidateName || 'Unknown Candidate'}</h3>
                    <p className="text-sm text-gray-600">{assignment.role}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(assignment.status)}`}>
                    {assignment.status}
                  </span>
                  <span className="text-sm text-gray-500">
                    {new Date(assignment.assignedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Performance Overview */}
      <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Performance Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <TrendingUp className="w-6 h-6 text-blue-600" />
              <h3 className="font-semibold text-gray-900">Completion Rate</h3>
            </div>
            <div className="text-4xl font-bold text-blue-600 mb-2">
              {stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0}%
            </div>
            <p className="text-sm text-gray-600">Interviews completed</p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <Clock className="w-6 h-6 text-green-600" />
              <h3 className="font-semibold text-gray-900">Average Response Time</h3>
            </div>
            <div className="text-4xl font-bold text-green-600 mb-2">
              {stats.total > 0 ? '24h' : 'N/A'}
            </div>
            <p className="text-sm text-gray-600">Time to complete feedback</p>
          </div>
        </div>
      </div>
    </div>
  )
}
