import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppSelector } from '@/store/hooks'
import { scheduleApi } from '../../api/interviewer/schedule.api'
import { Calendar, Clock, MapPin, Video, Phone, User, Briefcase, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react'

interface FormData {
  candidateId: string
  candidateName: string
  role: string
  date: string
  startTime: string
  endTime: string
  interviewType: 'video' | 'phone' | 'in-person'
  location?: string
  meetingLink?: string
  notes?: string
}

export default function ScheduleInterview() {
  const navigate = useNavigate()
  const user = useAppSelector((s) => s.auth.user)
  const [formData, setFormData] = useState<FormData>({
    candidateId: '',
    candidateName: '',
    role: '',
    date: '',
    startTime: '',
    endTime: '',
    interviewType: 'video',
    location: '',
    meetingLink: '',
    notes: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      if (!user?.id) {
        throw new Error('User not authenticated')
      }

      const interviewData = {
        interviewerId: parseInt(user.id),
        candidateId: formData.candidateId,
        role: formData.role,
        startTime: new Date(`${formData.date}T${formData.startTime}`).toISOString(),
        endTime: new Date(`${formData.date}T${formData.endTime}`).toISOString(),
        location: formData.interviewType === 'in-person' ? formData.location : undefined,
        meetingLink: formData.interviewType === 'video' ? formData.meetingLink : undefined,
        status: 'scheduled'
      }

      await scheduleApi.createInterviewSchedule(interviewData)
      setSuccess(true)
      setTimeout(() => {
        navigate('/interviewer/calendar')
      }, 2000)
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to schedule interview')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const generateMeetingLink = () => {
    const mockLink = `https://meet.google.com/${Math.random().toString(36).substring(2, 10)}`
    setFormData(prev => ({ ...prev, meetingLink: mockLink }))
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate('/interviewer/calendar')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Calendar
        </button>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Schedule Interview</h1>
        <p className="text-gray-600">Fill in the details to schedule a new interview</p>
      </div>

      {success && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6 flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-green-600" />
          <div>
            <p className="font-medium text-green-900">Interview scheduled successfully!</p>
            <p className="text-sm text-green-700">Redirecting to calendar...</p>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-600" />
          <p className="text-red-900">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <form onSubmit={handleSubmit}>
              {/* Candidate Information */}
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Candidate Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Candidate Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.candidateName}
                      onChange={(e) => handleChange('candidateName', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter candidate name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Candidate ID <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.candidateId}
                      onChange={(e) => handleChange('candidateId', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter candidate ID"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Interview Details */}
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Briefcase className="w-5 h-5" />
                  Interview Details
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Role/Position <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.role}
                      onChange={(e) => handleChange('role', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., Senior Software Engineer"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) => handleChange('date', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Interview Type <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.interviewType}
                      onChange={(e) => handleChange('interviewType', e.target.value as any)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option value="video">Video Call</option>
                      <option value="phone">Phone Call</option>
                      <option value="in-person">In-Person</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Start Time <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="time"
                      value={formData.startTime}
                      onChange={(e) => handleChange('startTime', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      End Time <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="time"
                      value={formData.endTime}
                      onChange={(e) => handleChange('endTime', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Location/Meeting Link */}
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  {formData.interviewType === 'in-person' ? (
                    <MapPin className="w-5 h-5" />
                  ) : formData.interviewType === 'video' ? (
                    <Video className="w-5 h-5" />
                  ) : (
                    <Phone className="w-5 h-5" />
                  )}
                  {formData.interviewType === 'in-person' ? 'Location' : formData.interviewType === 'video' ? 'Meeting Details' : 'Call Details'}
                </h2>
                
                {formData.interviewType === 'in-person' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Location <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => handleChange('location', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., Office - Room 3B, 123 Main St"
                      required
                    />
                  </div>
                )}

                {formData.interviewType === 'video' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Meeting Link
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="url"
                        value={formData.meetingLink}
                        onChange={(e) => handleChange('meetingLink', e.target.value)}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="https://meet.google.com/..."
                      />
                      <button
                        type="button"
                        onClick={generateMeetingLink}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                      >
                        Generate
                      </button>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">Leave empty to generate automatically</p>
                  </div>
                )}

                {formData.interviewType === 'phone' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                </label>
                    <input
                      type="tel"
                      value={formData.location}
                      onChange={(e) => handleChange('location', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                )}
              </div>

              {/* Notes */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Notes
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => handleChange('notes', e.target.value)}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Any additional information about the interview..."
                />
              </div>

              {/* Submit Button */}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => navigate('/interviewer/calendar')}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50"
                >
                  {loading ? 'Scheduling...' : 'Schedule Interview'}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <h3 className="font-semibold text-gray-900 mb-4">Interview Summary</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <User className="w-4 h-4 text-gray-500" />
                <span className="text-gray-600">Candidate:</span>
                <span className="font-medium text-gray-900">{formData.candidateName || 'Not specified'}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Briefcase className="w-4 h-4 text-gray-500" />
                <span className="text-gray-600">Role:</span>
                <span className="font-medium text-gray-900">{formData.role || 'Not specified'}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Calendar className="w-4 h-4 text-gray-500" />
                <span className="text-gray-600">Date:</span>
                <span className="font-medium text-gray-900">{formData.date || 'Not specified'}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Clock className="w-4 h-4 text-gray-500" />
                <span className="text-gray-600">Time:</span>
                <span className="font-medium text-gray-900">
                  {formData.startTime && formData.endTime ? `${formData.startTime} - ${formData.endTime}` : 'Not specified'}
                </span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                {formData.interviewType === 'video' && <Video className="w-4 h-4 text-gray-500" />}
                {formData.interviewType === 'phone' && <Phone className="w-4 h-4 text-gray-500" />}
                {formData.interviewType === 'in-person' && <MapPin className="w-4 h-4 text-gray-500" />}
                <span className="text-gray-600">Type:</span>
                <span className="font-medium text-gray-900 capitalize">{formData.interviewType}</span>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <h3 className="font-semibold text-blue-900 mb-3">Tips for Scheduling</h3>
            <ul className="space-y-2 text-sm text-blue-800">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>Schedule interviews at least 24 hours in advance</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>Allow buffer time between interviews</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>Test video conferencing tools beforehand</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>Send calendar invites to candidates</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
