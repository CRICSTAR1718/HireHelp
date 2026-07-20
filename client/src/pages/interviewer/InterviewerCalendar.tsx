import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppSelector } from '@/store/hooks'
import { assignmentApi, type Assignment } from '../../api/interviewer/assignment.api'
import { scheduleApi } from '../../api/interviewer/schedule.api'
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Clock, User, MapPin, Video, Phone, Plus, AlertCircle } from 'lucide-react'

interface Interview {
  id: string
  candidateName: string
  role: string
  date: Date
  time: string
  duration: string
  type: 'video' | 'phone' | 'in-person'
  location?: string
  status: 'scheduled' | 'completed' | 'cancelled'
}

export default function InterviewerCalendar() {
  const navigate = useNavigate()
  const user = useAppSelector((s) => s.auth.user)
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [view, setView] = useState<'month' | 'week' | 'day'>('month')
  const [interviews, setInterviews] = useState<Interview[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchInterviews()
  }, [currentDate])

  const fetchInterviews = async () => {
    try {
      if (!user?.id) {
        throw new Error('User not authenticated')
      }

      const assignments = await assignmentApi.getInterviewerAssignments(parseInt(user.id))
      const interviewData: Interview[] = []

      for (const assignment of assignments) {
        try {
          const schedules = await scheduleApi.getAssignmentSchedules(assignment.id)
          for (const schedule of schedules) {
            const startDate = new Date(schedule.startTime)
            const endDate = new Date(schedule.endTime)
            const duration = Math.round((endDate.getTime() - startDate.getTime()) / (1000 * 60))
            
            let type: 'video' | 'phone' | 'in-person' = 'video'
            if (schedule.meetingLink) {
              type = 'video'
            } else if (schedule.location?.includes('Phone') || schedule.location?.includes('Call')) {
              type = 'phone'
            } else {
              type = 'in-person'
            }

            interviewData.push({
              id: schedule.id.toString(),
              candidateName: assignment.candidateName || 'Unknown Candidate',
              role: assignment.role,
              date: startDate,
              time: startDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
              duration: `${duration} min`,
              type,
              location: schedule.location || schedule.meetingLink,
              status: schedule.status as 'scheduled' | 'completed' | 'cancelled'
            })
          }
        } catch (scheduleErr) {
          console.error('Failed to fetch schedule for assignment:', assignment.id, scheduleErr)
          // Continue with other assignments even if one fails
        }
      }

      setInterviews(interviewData)
    } catch (err: any) {
      console.error('Failed to fetch interviews:', err)
      setError(err.response?.data?.error || 'Failed to load interviews')
    } finally {
      setLoading(false)
    }
  }

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDay = firstDay.getDay()
    
    const days = []
    for (let i = 0; i < startingDay; i++) {
      days.push({ date: null, isCurrentMonth: false })
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({ date: new Date(year, month, i), isCurrentMonth: true })
    }
    return days
  }

  const getInterviewsForDate = (date: Date) => {
    return interviews.filter(interview => 
      interview.date.toDateString() === date.toDateString()
    )
  }

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate)
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1)
    } else {
      newDate.setMonth(newDate.getMonth() + 1)
    }
    setCurrentDate(newDate)
  }

  const days = getDaysInMonth(currentDate)
  const selectedDateInterviews = getInterviewsForDate(selectedDate)

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  if (loading) {
    return (
      <div className="flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading calendar...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 font-medium mb-2">Error loading calendar</p>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Calendar</h1>
          <p className="text-gray-600">Manage your interview schedule</p>
        </div>
        <button 
          onClick={() => navigate('/interviewer/schedule')}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Schedule Interview
        </button>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            {/* Calendar Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => navigateMonth('prev')}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ChevronLeft className="w-5 h-5 text-gray-600" />
                </button>
                <h2 className="text-xl font-bold text-gray-900">
                  {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                </h2>
                <button
                  onClick={() => navigateMonth('next')}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ChevronRight className="w-5 h-5 text-gray-600" />
                </button>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setView('month')}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    view === 'month' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Month
                </button>
                <button
                  onClick={() => setView('week')}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    view === 'week' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Week
                </button>
                <button
                  onClick={() => setView('day')}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    view === 'day' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Day
                </button>
              </div>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1">
              {/* Day Headers */}
              {dayNames.map(day => (
                <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
                  {day}
                </div>
              ))}
              
              {/* Calendar Days */}
              {days.map((day, index) => {
                if (!day.date) {
                  return <div key={index} className="h-24 bg-gray-50 rounded-lg" />
                }
                
                const dayInterviews = getInterviewsForDate(day.date)
                const isSelected = selectedDate.toDateString() === day.date.toDateString()
                const isToday = day.date.toDateString() === new Date().toDateString()
                
                return (
                  <div
                    key={index}
                    onClick={() => setSelectedDate(day.date)}
                    className={`h-24 p-2 rounded-lg cursor-pointer transition-colors ${
                      isSelected ? 'bg-blue-50 border-2 border-blue-500' : 'hover:bg-gray-50 border-2 border-transparent'
                    } ${isToday ? 'bg-blue-100' : ''}`}
                  >
                    <div className={`text-sm font-medium ${isToday ? 'text-blue-600' : 'text-gray-900'}`}>
                      {day.date.getDate()}
                    </div>
                    <div className="mt-1 space-y-1">
                      {dayInterviews.slice(0, 2).map(interview => (
                        <div
                          key={interview.id}
                          className="text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded truncate"
                        >
                          {interview.time} {interview.candidateName.split(' ')[0]}
                        </div>
                      ))}
                      {dayInterviews.length > 2 && (
                        <div className="text-xs text-gray-500">
                          +{dayInterviews.length - 2} more
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Selected Date Details */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </h2>
            
            {selectedDateInterviews.length === 0 ? (
              <div className="text-center py-8">
                <CalendarIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600 mb-2">No interviews scheduled</p>
                <p className="text-sm text-gray-500">Select a different date or schedule a new interview</p>
              </div>
            ) : (
              <div className="space-y-4">
                {selectedDateInterviews.map(interview => (
                  <div
                    key={interview.id}
                    className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {interview.type === 'video' && <Video className="w-4 h-4 text-blue-600" />}
                        {interview.type === 'phone' && <Phone className="w-4 h-4 text-green-600" />}
                        {interview.type === 'in-person' && <MapPin className="w-4 h-4 text-purple-600" />}
                        <span className="text-sm font-medium text-gray-900">{interview.time}</span>
                      </div>
                      <span className="text-xs text-gray-500">{interview.duration}</span>
                    </div>
                    
                    <h3 className="font-semibold text-gray-900 mb-1">{interview.candidateName}</h3>
                    <p className="text-sm text-gray-600 mb-2">{interview.role}</p>
                    
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <MapPin className="w-4 h-4" />
                      <span>{interview.location}</span>
                    </div>
                    
                    <div className="mt-3 flex gap-2">
                      <button className="flex-1 px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                        Join
                      </button>
                      <button className="px-3 py-1.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors text-sm font-medium">
                        Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Upcoming Interviews */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mt-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Upcoming Interviews</h2>
            <div className="space-y-3">
              {interviews.slice(0, 3).map(interview => (
                <div key={interview.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 text-sm">{interview.candidateName}</h3>
                    <p className="text-xs text-gray-500">{interview.role}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{interview.time}</p>
                    <p className="text-xs text-gray-500">{interview.date.toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
