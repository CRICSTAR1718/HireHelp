import { useState, useEffect } from 'react'
import { useAppSelector } from '@/store/hooks'
import { assignmentApi, type Assignment } from '../../api/interviewer/assignment.api'
import { Bell, Check, Trash2, Filter, Clock, Calendar, User, MessageSquare, AlertCircle } from 'lucide-react'

interface Notification {
  id: string
  type: 'interview' | 'feedback' | 'system' | 'reminder'
  title: string
  message: string
  timestamp: Date
  read: boolean
}

export default function InterviewerNotifications() {
  const user = useAppSelector((s) => s.auth.user)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all')
  const [typeFilter, setTypeFilter] = useState<'all' | 'interview' | 'feedback' | 'system' | 'reminder'>('all')

  useEffect(() => {
    fetchNotifications()
  }, [])

  const fetchNotifications = async () => {
    try {
      if (!user?.id) {
        throw new Error('User not authenticated')
      }

      const assignments = await assignmentApi.getInterviewerAssignments(parseInt(user.id))
      const notificationData: Notification[] = []

      // Generate notifications from assignments
      for (const assignment of assignments) {
        const assignedDate = new Date(assignment.assignedAt)
        const isRecent = (Date.now() - assignedDate.getTime()) < 24 * 60 * 60 * 1000 // Last 24 hours

        notificationData.push({
          id: `assignment-${assignment.id}`,
          type: 'interview',
          title: 'New Interview Assigned',
          message: `You have been assigned to interview ${assignment.candidateName || 'a candidate'} for the ${assignment.role} position.`,
          timestamp: assignedDate,
          read: !isRecent
        })

        // Add reminder for upcoming interviews
        if (assignment.status === 'assigned' || assignment.status === 'pending') {
          const tomorrow = new Date()
          tomorrow.setDate(tomorrow.getDate() + 1)
          
          notificationData.push({
            id: `reminder-${assignment.id}`,
            type: 'reminder',
            title: 'Interview Reminder',
            message: `Your interview for ${assignment.role} is scheduled. Please prepare accordingly.`,
            timestamp: assignedDate,
            read: true
          })
        }

        // Add feedback request for completed interviews
        if (assignment.status === 'completed' && assignment.completedAt) {
          notificationData.push({
            id: `feedback-${assignment.id}`,
            type: 'feedback',
            title: 'Feedback Requested',
            message: `Please submit your feedback for the ${assignment.role} interview.`,
            timestamp: new Date(assignment.completedAt),
            read: true
          })
        }
      }

      // Sort by timestamp (newest first)
      notificationData.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      setNotifications(notificationData)
    } catch (err: any) {
      console.error('Failed to fetch notifications:', err)
      setError(err.response?.data?.error || 'Failed to load notifications')
    } finally {
      setLoading(false)
    }
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'interview': return <Calendar className="w-5 h-5" />
      case 'feedback': return <MessageSquare className="w-5 h-5" />
      case 'system': return <AlertCircle className="w-5 h-5" />
      case 'reminder': return <Clock className="w-5 h-5" />
      default: return <Bell className="w-5 h-5" />
    }
  }

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'interview': return 'bg-blue-100 text-blue-600'
      case 'feedback': return 'bg-green-100 text-green-600'
      case 'system': return 'bg-purple-100 text-purple-600'
      case 'reminder': return 'bg-yellow-100 text-yellow-600'
      default: return 'bg-gray-100 text-gray-600'
    }
  }

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => 
      n.id === id ? { ...n, read: true } : n
    ))
  }

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  const clearAll = () => {
    setNotifications([])
  }

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'unread' && n.read) return false
    if (filter === 'read' && !n.read) return false
    if (typeFilter !== 'all' && n.type !== typeFilter) return false
    return true
  })

  const unreadCount = notifications.filter(n => !n.read).length

  if (loading) {
    return (
      <div className="flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading notifications...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 font-medium mb-2">Error loading notifications</p>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    )
  }

  const formatTime = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return 'Just now'
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    if (days < 7) return `${days}d ago`
    return date.toLocaleDateString()
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Notifications</h1>
          <p className="text-gray-600">
            {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` : 'All caught up!'}
          </p>
        </div>
        <div className="flex gap-3">
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              Mark All Read
            </button>
          )}
          {notifications.length > 0 && (
            <button
              onClick={clearAll}
              className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors font-medium flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Clear All
            </button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Filter:</span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                filter === 'all' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                filter === 'unread' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Unread
            </button>
            <button
              onClick={() => setFilter('read')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                filter === 'read' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Read
            </button>
          </div>
          <div className="w-px h-6 bg-gray-300"></div>
          <div className="flex gap-2">
            <button
              onClick={() => setTypeFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                typeFilter === 'all' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              All Types
            </button>
            <button
              onClick={() => setTypeFilter('interview')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                typeFilter === 'interview' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Interviews
            </button>
            <button
              onClick={() => setTypeFilter('feedback')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                typeFilter === 'feedback' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Feedback
            </button>
            <button
              onClick={() => setTypeFilter('reminder')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                typeFilter === 'reminder' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Reminders
            </button>
            <button
              onClick={() => setTypeFilter('system')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                typeFilter === 'system' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              System
            </button>
          </div>
        </div>
      </div>

      {/* Notifications List */}
      {filteredNotifications.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No notifications</h3>
          <p className="text-gray-600">
            {notifications.length === 0 
              ? "You don't have any notifications yet." 
              : "No notifications match your current filters."}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`bg-white rounded-xl shadow-sm border p-6 transition-all hover:shadow-md ${
                !notification.read ? 'border-l-4 border-l-blue-500 border-gray-200' : 'border-gray-200'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-full ${getNotificationColor(notification.type)}`}>
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className={`font-semibold text-gray-900 ${!notification.read ? 'text-lg' : ''}`}>
                        {notification.title}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatTime(notification.timestamp)}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      {!notification.read && (
                        <button
                          onClick={() => markAsRead(notification.id)}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Mark as read"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => deleteNotification(notification.id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <p className="text-gray-600">{notification.message}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Notification Settings */}
      <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Notification Settings</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-gray-600" />
              <div>
                <h3 className="font-medium text-gray-900">Push Notifications</h3>
                <p className="text-sm text-gray-600">Receive push notifications in browser</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" defaultChecked className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <User className="w-5 h-5 text-gray-600" />
              <div>
                <h3 className="font-medium text-gray-900">Interview Notifications</h3>
                <p className="text-sm text-gray-600">Get notified about new interview assignments</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" defaultChecked className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <MessageSquare className="w-5 h-5 text-gray-600" />
              <div>
                <h3 className="font-medium text-gray-900">Feedback Reminders</h3>
                <p className="text-sm text-gray-600">Reminders to submit interview feedback</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" defaultChecked className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>
    </div>
  )
}
