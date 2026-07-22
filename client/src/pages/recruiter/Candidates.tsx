import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Users, Briefcase, Mail, MapPin, Search, Filter, Eye, FileText, Download, X } from 'lucide-react';
import { getApplications } from '../../api/recruiter/applications';
import { useNavigate, useLocation } from 'react-router-dom';
import { AiEvaluationModal } from '../../components/recruiter/AiEvaluationModal';

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
  ai_status?: string;
  submitted_at: string;
  interview_feedback?: string;
  interview_score?: number;
  resumeUrl?: string;
}

export const Candidates: React.FC = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedCandidate, setSelectedCandidate] = useState<Application | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [showAiModal, setShowAiModal] = useState(false);
  const [modalPosition, setModalPosition] = useState<{ top: number; left: number } | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const isAdminPortal = location.pathname.startsWith('/admin');

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
    const matchesSearch = 
      `${app.candidate_first_name} ${app.candidate_last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.candidate_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.requisition_title.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'shortlisted': return 'bg-green-100 text-green-800';
      case 'under_review': return 'bg-blue-100 text-blue-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'hired': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleViewDetails = (application: Application) => {
    setSelectedCandidate(application);
    setShowDetailsModal(true);
  };

  const handleViewFeedback = (application: Application) => {
    setSelectedCandidate(application);
    setShowFeedbackModal(true);
  };

  const handleViewAiEvaluation = (e: React.MouseEvent, application: Application) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setModalPosition({ top: rect.bottom, left: rect.left });
    setSelectedCandidate(application);
    setShowAiModal(true);
  };

  const handleDownloadResume = (application: Application) => {
    if (application.resumeUrl) {
      window.open(application.resumeUrl, '_blank', 'noopener,noreferrer')
    } else {
      alert('Resume not available for this candidate')
    }
  }

  const buildApplicationPath = (application: Application) => {
    const basePath = isAdminPortal ? '/admin' : '/recruiter'
    return `${basePath}/requisitions/${application.requisition_id}/applications/${application.id}`
  }

  if (loading) {
    return (
      <div className="space-y-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="hh-skeleton h-10 w-48 rounded mb-2" />
          <div className="hh-skeleton h-5 w-64 rounded" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow p-4 sm:p-6">
              <div className="flex items-start gap-4 mb-4">
                <div className="hh-skeleton h-12 w-12 rounded-full" />
                <div className="flex-1">
                  <div className="hh-skeleton h-6 w-3/4 rounded mb-2" />
                  <div className="hh-skeleton h-4 w-1/2 rounded" />
                </div>
              </div>
              <div className="space-y-3">
                <div className="hh-skeleton h-4 w-full rounded" />
                <div className="hh-skeleton h-4 w-2/3 rounded" />
                <div className="flex justify-between pt-3 border-t border-gray-100">
                  <div className="hh-skeleton h-8 w-16 rounded" />
                  <div className="hh-skeleton h-6 w-16 rounded" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">All Candidates</h1>
          <p className="text-gray-600">View and manage all candidate applications across positions</p>
        </div>

        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search candidates, email, or positions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="text-gray-400 w-5 h-5" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="submitted">Submitted</option>
              <option value="under_review">Under Review</option>
              <option value="shortlisted">Shortlisted</option>
              <option value="rejected">Rejected</option>
              <option value="hired">Hired</option>
            </select>
          </div>
        </div>

        {filteredApplications.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow hh-fade-in" style={{ boxShadow: 'var(--hh-shadow-md)' }}>
            <Users className="mx-auto h-12 w-12" style={{ color: 'var(--hh-text-muted)' }} />
            <h3 className="mt-2 text-sm font-medium" style={{ color: 'var(--hh-text)' }}>No candidates found</h3>
            <p className="mt-1 text-sm" style={{ color: 'var(--hh-text-secondary)' }}>
              {searchTerm || statusFilter !== 'all'
                ? 'Try adjusting your search or filter criteria.'
                : 'Candidates will appear here once they apply for positions.'}
            </p>
          </div>
        ) : (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 hh-stagger">
            {filteredApplications.map((application) => (
              <div key={application.id} className="bg-white rounded-lg shadow hover:shadow-md transition-shadow p-6 hh-lift hh-stagger-item">
                <div className="flex items-start gap-4 mb-4">
                  <div className="flex-shrink-0 h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center">
                    <span className="text-indigo-600 font-semibold text-lg">
                      {application.candidate_first_name.charAt(0)}{application.candidate_last_name.charAt(0)}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-semibold text-gray-900">
                      {application.candidate_first_name} {application.candidate_last_name}
                    </h3>
                    <div className="flex items-center text-sm text-gray-500 mt-1">
                      <Mail className="w-3 h-3 mr-1 flex-shrink-0" />
                      <span>{application.candidate_email}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-start gap-2">
                    <Briefcase className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">{application.requisition_title}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <span className="font-medium text-gray-700">{application.department}</span>
                    <span className="text-gray-300">•</span>
                    <div className="flex items-center">
                      <MapPin className="w-3 h-3 mr-1" />
                      <span>{application.location}</span>
                    </div>
                  </div>

                  {application.interview_feedback && (
                    <div className="bg-green-50 rounded p-2 text-sm">
                      <span className="font-medium text-green-800 text-sm">Interview Feedback:</span>
                      <p className="text-green-700 mt-1 line-clamp-2 text-sm">{application.interview_feedback}</p>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100 mb-4">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Fitment Score</p>
                    {application.ai_score ? (
                      <span className="hh-ai-badge text-sm">
                        <span className="hh-ai-dot"></span>
                        {parseFloat(application.ai_score).toFixed(1)}%
                      </span>
                    ) : (
                      <p className="text-lg font-semibold text-indigo-600">N/A</p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500 mb-1">Status</p>
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(application.status)}`}>
                      {application.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 text-xs text-gray-400 mb-4">
                  <span>Applied: {new Date(application.submitted_at).toLocaleDateString()}</span>
                </div>

                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => handleViewDetails(application)}
                    className="bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium flex items-center justify-center gap-2"
                  >
                    <Eye className="w-4 h-4" />
                    View Candidate Profile
                  </button>
                  {application.ai_status === 'completed' && (
                    <button
                      onClick={(e) => handleViewAiEvaluation(e, application)}
                      className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium flex items-center justify-center gap-2"
                    >
                      <Eye className="w-4 h-4" />
                      View AI Evaluation
                    </button>
                  )}
                  {application.resumeUrl && (
                    <button
                      onClick={() => handleDownloadResume(application)}
                      className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center justify-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      Download Resume
                    </button>
                  )}
                  {application.interview_feedback && (
                    <button
                      onClick={() => handleViewFeedback(application)}
                      className="bg-emerald-600 text-white py-2 px-4 rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium flex items-center justify-center gap-2"
                    >
                      <FileText className="w-4 h-4" />
                      View Interview Feedback
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {showDetailsModal && selectedCandidate && createPortal(
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowDetailsModal(false)}
          >
            <div
              className="w-full max-w-3xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-white rounded-lg shadow-lg w-full p-6 relative max-h-[85vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-gray-900">Candidate Profile</h3>
                  <button
                    onClick={() => setShowDetailsModal(false)}
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
                  {selectedCandidate.interview_feedback && (
                    <div className="bg-green-50 rounded-lg p-4">
                      <h4 className="font-semibold text-green-900 mb-3">Interview Feedback</h4>
                      <p className="text-green-700 whitespace-pre-wrap">{selectedCandidate.interview_feedback}</p>
                    </div>
                  )}
                  {selectedCandidate.interview_score && (
                    <div className="bg-blue-50 rounded-lg p-4">
                      <h4 className="font-semibold text-blue-900 mb-3">Interview Score</h4>
                      <p className="text-blue-700 font-semibold text-lg">{selectedCandidate.interview_score.toFixed(1)}</p>
                    </div>
                  )}
                </div>
                <div className="mt-6 flex gap-3 justify-end">
                  {selectedCandidate.resumeUrl && (
                    <button
                      onClick={() => handleDownloadResume(selectedCandidate)}
                      className="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Download Resume
                    </button>
                  )}
                  <button
                    onClick={() => setShowDetailsModal(false)}
                    className="bg-gray-600 text-white py-2 px-6 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}

        {showFeedbackModal && selectedCandidate && selectedCandidate.interview_feedback && createPortal(
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowFeedbackModal(false)}
          >
            <div
              className="w-full max-w-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-white rounded-lg shadow-lg w-full p-6 relative">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Interview Feedback</h3>
                  <button
                    onClick={() => setShowFeedbackModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 mb-4 max-h-96 overflow-y-auto">
                  <p className="text-gray-700 whitespace-pre-wrap">{selectedCandidate.interview_feedback}</p>
                </div>
                <button
                  onClick={() => setShowFeedbackModal(false)}
                  className="w-full bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}

        {/* AI Evaluation Modal */}
        {selectedCandidate && (
          <AiEvaluationModal
            isOpen={showAiModal}
            onClose={() => {
              setShowAiModal(false)
              setSelectedCandidate(null)
              setModalPosition(null)
            }}
            applicationId={selectedCandidate.id}
            requisitionId={selectedCandidate.requisition_id}
            candidateName={`${selectedCandidate.candidate_first_name} ${selectedCandidate.candidate_last_name}`}
            position={modalPosition ?? undefined}
          />
        )}
    </div>
  );
};