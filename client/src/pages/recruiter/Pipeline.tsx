import React, { useState, useEffect } from 'react';
import { GitPullRequest, User, Briefcase, Clock, CheckCircle, XCircle } from 'lucide-react';
import { getApplications } from '../../api/recruiter/applications';

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
}

export const Pipeline: React.FC = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');

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
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <GitPullRequest className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No candidates in pipeline</h3>
            <p className="mt-1 text-sm text-gray-500">Candidates will appear here once they apply for positions.</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredApplications.map((application) => (
              <div
                key={application.id}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-4 sm:p-6 border border-gray-200"
              >
                <div className="flex items-start justify-between mb-4 gap-3">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                      <User className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-gray-900 text-sm sm:text-base truncate">
                        {application.candidate_first_name} {application.candidate_last_name}
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-500 truncate">{application.candidate_email}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs font-medium flex items-center gap-1 border flex-shrink-0 ${getStatusColor(application.status)}`}>
                    {getStatusIcon(application.status)}
                    <span className="hidden sm:inline">{application.status.replace('_', ' ')}</span>
                  </span>
                </div>

                <div className="space-y-2 sm:space-y-3 mb-4">
                  <div className="flex items-start gap-2 text-sm">
                    <Briefcase className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                    <span className="font-medium text-gray-900 truncate">{application.requisition_title}</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-1 sm:gap-2 text-xs sm:text-sm text-gray-600">
                    <span className="font-medium">{application.department}</span>
                    <span className="text-gray-300">•</span>
                    <span className="truncate">{application.location}</span>
                  </div>
                  {application.interviewRole && (
                    <div className="flex flex-wrap items-center gap-1 sm:gap-2 text-xs sm:text-sm text-gray-600">
                      <span className="font-medium">Interview:</span>
                      <span className="truncate">{application.interviewRole}</span>
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
                      <span className="font-medium text-green-800 text-xs sm:text-sm">Feedback:</span>
                      <p className="text-green-700 mt-1 line-clamp-2 text-xs sm:text-sm">{application.interviewFeedback}</p>
                    </div>
                  )}
                  {application.interviewCancellationReason && (
                    <div className="bg-red-50 rounded p-2 text-sm">
                      <span className="font-medium text-red-800 text-xs sm:text-sm">Cancellation Reason:</span>
                      <p className="text-red-700 mt-1 line-clamp-2 text-xs sm:text-sm">{application.interviewCancellationReason}</p>
                    </div>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pt-3 sm:pt-4 border-t border-gray-100 gap-2">
                  <div className="text-xs sm:text-sm">
                    <span className="text-gray-500">AI Score:</span>
                    <span className="ml-2 font-semibold text-indigo-600">
                      {application.ai_score ? `${parseFloat(application.ai_score).toFixed(1)}%` : 'N/A'}
                    </span>
                  </div>
                  <div className="text-xs sm:text-sm text-gray-500">
                    {new Date(application.submitted_at).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
    </div>
  );
};
