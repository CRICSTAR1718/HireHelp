import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { GitPullRequest, User, Briefcase, Clock, CheckCircle, XCircle, Download, Eye, X } from 'lucide-react';
import { getApplications } from '../../api/recruiter/applications';
import { useNavigate, useLocation } from 'react-router-dom';

interface Application {
  id: string;
  requisition_id: string;
  requisition_title: string;
  department: string;
  location: string;
  candidate_id: string;
  candidate_first_name: string;
  candidate_last_name: string;
  candidate_email: string;
  status: string;
  ai_score: string;
  submitted_at: string;
  interviewFeedback?: string;
  interviewCancellationReason?: string;
  interviewStatus?: string;
  interviewRole?: string;
  interviewCompletedAt?: string;
  resumeUrl?: string;
}

export const Pipeline: React.FC = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const [selectedCandidate, setSelectedCandidate] = useState<Application | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    try {
      const data = await getApplications();
      setApplications(data);
    } catch (error) {
      console.error('Failed to load applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredApplications = applications.filter(app => {
    // Exclude submitted, rejected, and hired candidates from pipeline view
    if (app.status === 'submitted' || app.status === 'rejected' || app.status === 'hired') return false;
    if (filter === 'all') return true;
    return app.status === filter;
  });

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'shortlisted': return 'bg-green-100 text-green-800 border-green-200';
      case 'under_review': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
      case 'hired': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'shortlisted': return <CheckCircle className="w-4 h-4" />;
      case 'rejected': return <XCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const handleDownloadResume = async (application: Application) => {
    if (application.resumeUrl) {
      window.open(application.resumeUrl, '_blank', 'noopener,noreferrer')
    } else {
      alert('Resume not available for this candidate')
    }
  }

  const handleViewDetails = (application: Application) => {
    setSelectedCandidate(application)
    setShowDetailsModal(true)
  }

  const closeDetailsModal = () => {
    setShowDetailsModal(false)
    setSelectedCandidate(null)
  }

  const isAdminPortal = location.pathname.startsWith('/admin')

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-2">Pipeline Management</h1>
        <p className="text-gray-600">Track and manage candidates through your recruitment pipeline</p>
      </div>

        <div className="mb-6 flex flex-wrap gap-2">
          {['all', 'under_review', 'shortlisted'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-3 sm:px-4 py-2 rounded-lg capitalize transition-colors text-sm ${
                filter === status
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              {status.replace('_', ' ')}
            </button>
          ))}
        </div>

        {filteredApplications.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow hh-fade-in" style={{ boxShadow: 'var(--hh-shadow-md)' }}>
            <GitPullRequest className="mx-auto h-12 w-12" style={{ color: 'var(--hh-text-muted)' }} />
            <h3 className="mt-2 text-sm font-medium" style={{ color: 'var(--hh-text)' }}>No candidates in pipeline</h3>
            <p className="mt-1 text-sm" style={{ color: 'var(--hh-text-secondary)' }}>Candidates will appear here once they apply for positions.</p>
          </div>
        ) : (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {filteredApplications.map((application) => (
              <div
                key={application.id}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 border border-gray-200"
              >
                <div className="flex items-start justify-between mb-4 gap-3">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                      <User className="w-6 h-6 text-indigo-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-gray-900 text-base">
                        {application.candidate_first_name} {application.candidate_last_name}
                      </h3>
                      <p className="text-sm text-gray-500">{application.candidate_email}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 border flex-shrink-0 ${getStatusColor(application.status)}`}>
                    {getStatusIcon(application.status)}
                    <span>{application.status.replace('_', ' ')}</span>
                  </span>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-start gap-2 text-sm">
                    <Briefcase className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                    <span className="font-medium text-gray-900">{application.requisition_title}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span className="font-medium">{application.department}</span>
                    <span className="text-gray-300">•</span>
                    <span>{application.location}</span>
                  </div>
                  {application.interviewRole && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <span className="font-medium">Interview:</span>
                      <span>{application.interviewRole}</span>
                      {application.interviewStatus && (
                        <span className={`px-2 py-0.5 rounded text-xs ${
                          application.interviewStatus === 'completed' ? 'bg-green-100 text-green-800' :
                          application.interviewStatus === 'cancelled' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {application.interviewStatus}
                        </span>
                      )}
                    </div>
                  )}
                  {application.interviewFeedback && (
                    <div className="bg-green-50 rounded p-2 text-sm">
                      <span className="font-medium text-green-800 text-sm">Feedback:</span>
                      <p className="text-green-700 mt-1 line-clamp-2 text-sm">{application.interviewFeedback}</p>
                    </div>
                  )}
                  {application.interviewCancellationReason && (
                    <div className="bg-red-50 rounded p-2 text-sm">
                      <span className="font-medium text-red-800 text-sm">Cancellation Reason:</span>
                      <p className="text-red-700 mt-1 line-clamp-2 text-sm">{application.interviewCancellationReason}</p>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100 mb-4">
                  <div className="text-sm">
                    <span className="text-gray-500">AI Score:</span>
                    <span className="ml-2 font-semibold text-indigo-600">
                      {application.ai_score ? `${parseFloat(application.ai_score).toFixed(1)}%` : 'N/A'}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500">
                    {new Date(application.submitted_at).toLocaleDateString()}
                  </div>
                </div>

                <div className="flex gap-2 flex-wrap">
                  <button
                    onClick={() => handleViewDetails(application)}
                    className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium flex items-center justify-center gap-2"
                  >
                    <Eye className="w-4 h-4" />
                    View Details
                  </button>
                  {isAdminPortal && (
                    <button
                      onClick={() => handleDownloadResume(application)}
                      disabled={!application.resumeUrl}
                      className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center justify-center gap-2 disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                      <Download className="w-4 h-4" />
                      Resume
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {showDetailsModal && selectedCandidate && createPortal(
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
            onClick={closeDetailsModal}
          >
            <div
              className="bg-white rounded-lg shadow-lg max-w-2xl w-full p-6 relative max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Candidate Details</h3>
                <button
                  onClick={closeDetailsModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-3">Personal Information</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm text-gray-500">Name:</span>
                      <p className="font-medium text-gray-900">{selectedCandidate.candidate_first_name} {selectedCandidate.candidate_last_name}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Email:</span>
                      <p className="font-medium text-gray-900">{selectedCandidate.candidate_email}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-3">Application Details</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm text-gray-500">Position:</span>
                      <p className="font-medium text-gray-900">{selectedCandidate.requisition_title}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Department:</span>
                      <p className="font-medium text-gray-900">{selectedCandidate.department}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Location:</span>
                      <p className="font-medium text-gray-900">{selectedCandidate.location}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Status:</span>
                      <p className="font-medium text-gray-900">{selectedCandidate.status.replace('_', ' ')}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">AI Score:</span>
                      <p className="font-medium text-indigo-600">{selectedCandidate.ai_score ? `${parseFloat(selectedCandidate.ai_score).toFixed(1)}%` : 'N/A'}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Applied On:</span>
                      <p className="font-medium text-gray-900">{new Date(selectedCandidate.submitted_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
                {selectedCandidate.interviewRole && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-3">Interview Information</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-sm text-gray-500">Interview Role:</span>
                        <p className="font-medium text-gray-900">{selectedCandidate.interviewRole}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">Interview Status:</span>
                        <p className="font-medium text-gray-900">{selectedCandidate.interviewStatus || 'N/A'}</p>
                      </div>
                      {selectedCandidate.interviewCompletedAt && (
                        <div>
                          <span className="text-sm text-gray-500">Completed On:</span>
                          <p className="font-medium text-gray-900">{new Date(selectedCandidate.interviewCompletedAt).toLocaleDateString()}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                {selectedCandidate.interviewFeedback && (
                  <div className="bg-green-50 rounded-lg p-4">
                    <h4 className="font-semibold text-green-900 mb-3">Interview Feedback</h4>
                    <p className="text-green-700 whitespace-pre-wrap">{selectedCandidate.interviewFeedback}</p>
                  </div>
                )}
                {selectedCandidate.interviewCancellationReason && (
                  <div className="bg-red-50 rounded-lg p-4">
                    <h4 className="font-semibold text-red-900 mb-3">Cancellation Reason</h4>
                    <p className="text-red-700 whitespace-pre-wrap">{selectedCandidate.interviewCancellationReason}</p>
                  </div>
                )}
              </div>
              <div className="mt-6 flex justify-end">
                <button
                  onClick={closeDetailsModal}
                  className="bg-gray-600 text-white py-2 px-6 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
};