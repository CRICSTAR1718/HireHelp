import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { assignmentApi, type Assignment } from "../../api/interviewer"
import { Video, Eye, X, Check, Clock, AlertCircle, CheckCircle, XCircle } from 'lucide-react'

export default function InterviewPanel() {
  const navigate = useNavigate()
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [showStatusModal, setShowStatusModal] = useState(false)
  const [statusAction, setStatusAction] = useState<'complete' | 'cancel' | null>(null)
  const [feedback, setFeedback] = useState('')
  const [cancellationReason, setCancellationReason] = useState('')
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    fetchAssignments()
  }, [])

  const fetchAssignments = async () => {
    try {
      const data = await assignmentApi.getAllAssignments()
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

  const handleStatusChange = async () => {
    if (!selectedAssignment || !statusAction) return;

    try {
      setUpdating(true);
      const updateData: any = {};
      
      if (statusAction === 'complete') {
        updateData.status = 'completed';
        updateData.completedAt = new Date();
        updateData.feedback = feedback;
      } else if (statusAction === 'cancel') {
        updateData.status = 'cancelled';
        updateData.cancellationReason = cancellationReason;
      }

      await assignmentApi.updateAssignment(selectedAssignment.id, updateData);
      await fetchAssignments();
      setShowStatusModal(false);
      setSelectedAssignment(null);
      setStatusAction(null);
      setFeedback('');
      setCancellationReason('');
    } catch (error) {
      console.error('Failed to update assignment:', error);
      alert('Failed to update interview status');
    } finally {
      setUpdating(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDateTime = (date: Date) => {
    return new Date(date).toLocaleString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-gray-600">Loading assignments...</div>
      </div>
    );
  }

  return (
    <>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">My Interviews</h1>
          <p className="text-gray-600">Manage your assigned interview sessions</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {assignments.map((assignment) => (
            <div key={assignment.id} className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow border border-gray-200 overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {assignment.role}
                    </h3>
                    <p className="text-sm text-gray-500">{assignment.candidateName}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(assignment.status)}`}>
                    {assignment.status}
                  </span>
                </div>

                <div className="space-y-2 mb-4">
                  {assignment.schedule && (
                    <>
                      <div className="flex items-center text-sm text-gray-600">
                        <Clock className="w-4 h-4 mr-2" />
                        <span>{formatDateTime(assignment.schedule.startTime)}</span>
                      </div>
                      {(assignment.schedule.location || assignment.schedule.meetingLink) && (
                        <div className="flex items-center text-sm text-gray-600">
                          <Video className="w-4 h-4 mr-2" />
                          <span>{assignment.schedule.location || assignment.schedule.meetingLink}</span>
                        </div>
                      )}
                    </>
                  )}
                  {assignment.cancellationReason && (
                    <div className="flex items-start text-sm text-red-600">
                      <AlertCircle className="w-4 h-4 mr-2 mt-0.5" />
                      <span className="line-clamp-2">{assignment.cancellationReason}</span>
                    </div>
                  )}
                  {assignment.feedback && (
                    <div className="flex items-start text-sm text-green-600">
                      <Check className="w-4 h-4 mr-2 mt-0.5" />
                      <span className="line-clamp-2">{assignment.feedback}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="px-6 pb-6 flex flex-col gap-2 border-t border-gray-100 pt-4">
                <button 
                  className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium flex items-center justify-center gap-2"
                  onClick={() => {
                    setSelectedAssignment(assignment);
                    setShowDetailsModal(true);
                  }}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  View Details
                </button>
                {assignment.status === 'pending' && (
                  <>
                    <button 
                      className="w-full bg-green-50 border border-green-200 text-green-700 py-2 px-4 rounded-lg hover:bg-green-100 transition-colors text-sm font-medium flex items-center justify-center gap-2"
                      onClick={() => {
                        setSelectedAssignment(assignment);
                        setStatusAction('complete');
                        setShowStatusModal(true);
                      }}
                    >
                      <Check className="w-4 h-4 mr-2" />
                      Mark as Completed
                    </button>
                    <button 
                      className="w-full bg-red-50 border border-red-200 text-red-700 py-2 px-4 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium flex items-center justify-center gap-2"
                      onClick={() => {
                        setSelectedAssignment(assignment);
                        setStatusAction('cancel');
                        setShowStatusModal(true);
                      }}
                    >
                      <X className="w-4 h-4 mr-2" />
                      Cancel Interview
                    </button>
                  </>
                )}
                {assignment.status === 'completed' && (
                  <div className="w-full bg-green-100 border border-green-200 rounded-lg p-3 text-center">
                    <CheckCircle className="w-5 h-5 mx-auto text-green-600 mb-1" />
                    <p className="text-sm font-medium text-green-800">Interview Completed</p>
                  </div>
                )}
                {assignment.status === 'cancelled' && (
                  <div className="w-full bg-red-100 border border-red-200 rounded-lg p-3 text-center">
                    <XCircle className="w-5 h-5 mx-auto text-red-600 mb-1" />
                    <p className="text-sm font-medium text-red-800">Interview Cancelled</p>
                  </div>
                )}
                {assignment.schedule?.meetingLink && (
                  <button className="w-full bg-blue-50 border border-blue-200 text-blue-700 py-2 px-4 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium flex items-center justify-center gap-2">
                    <Video className="w-4 h-4 mr-2" />
                    <a href={assignment.schedule.meetingLink} target="_blank" rel="noopener noreferrer" className="flex items-center">
                      Join Meeting
                    </a>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {assignments.length === 0 && (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <p className="text-gray-500 mb-4">No interviews assigned yet</p>
            <button 
              onClick={fetchAssignments}
              className="bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Refresh
            </button>
          </div>
        )}
      </div>

      {/* Details Modal */}
      {showDetailsModal && selectedAssignment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-900">Interview Details</h3>
              <button
                onClick={() => {
                  setShowDetailsModal(false);
                  setSelectedAssignment(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Candidate Information</h4>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Name:</span>
                    <span className="font-medium">{selectedAssignment.candidateName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Email:</span>
                    <span className="font-medium">{selectedAssignment.candidateEmail}</span>
                  </div>
                  {selectedAssignment.candidatePhone && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Phone:</span>
                      <span className="font-medium">{selectedAssignment.candidatePhone}</span>
                    </div>
                  )}
                </div>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Interview Information</h4>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Role:</span>
                    <span className="font-medium">{selectedAssignment.role}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedAssignment.status)}`}>
                      {selectedAssignment.status}
                    </span>
                  </div>
                  {selectedAssignment.schedule && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Start Time:</span>
                        <span className="font-medium">{formatDateTime(selectedAssignment.schedule.startTime)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">End Time:</span>
                        <span className="font-medium">{formatDateTime(selectedAssignment.schedule.endTime)}</span>
                      </div>
                      {selectedAssignment.schedule.location && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Location:</span>
                          <span className="font-medium">{selectedAssignment.schedule.location}</span>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
              {selectedAssignment.feedback && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Interviewer Feedback</h4>
                  <div className="bg-green-50 rounded-lg p-4">
                    <p className="text-sm">{selectedAssignment.feedback}</p>
                  </div>
                </div>
              )}
              {selectedAssignment.cancellationReason && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Cancellation Reason</h4>
                  <div className="bg-red-50 rounded-lg p-4">
                    <p className="text-sm">{selectedAssignment.cancellationReason}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Status Change Modal */}
      {showStatusModal && selectedAssignment && statusAction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-900">
                {statusAction === 'complete' ? 'Complete Interview' : 'Cancel Interview'}
              </h3>
              <button
                onClick={() => {
                  setShowStatusModal(false);
                  setSelectedAssignment(null);
                  setStatusAction(null);
                  setFeedback('');
                  setCancellationReason('');
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <p className="text-gray-600">
                {statusAction === 'complete' 
                  ? `Please provide feedback for ${selectedAssignment.candidateName}'s ${selectedAssignment.role} interview.`
                  : `Please provide a reason for cancelling ${selectedAssignment.candidateName}'s ${selectedAssignment.role} interview.`
                }
              </p>
              {statusAction === 'complete' ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Feedback *
                  </label>
                  <textarea
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your interview feedback..."
                    required
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cancellation Reason *
                  </label>
                  <textarea
                    value={cancellationReason}
                    onChange={(e) => setCancellationReason(e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter the reason for cancellation..."
                    required
                  />
                </div>
              )}
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => {
                    setShowStatusModal(false);
                    setSelectedAssignment(null);
                    setStatusAction(null);
                    setFeedback('');
                    setCancellationReason('');
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleStatusChange}
                  disabled={updating || (statusAction === 'complete' ? !feedback : !cancellationReason)}
                  className={`px-4 py-2 rounded-lg text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                    statusAction === 'complete' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'
                  }`}
                >
                  {updating ? 'Updating...' : statusAction === 'complete' ? 'Complete' : 'Cancel'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
