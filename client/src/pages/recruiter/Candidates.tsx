import React, { useState, useEffect } from 'react';
import { Users, Briefcase, Mail, MapPin, Search, Filter } from 'lucide-react';
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
}

export const Candidates: React.FC = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 hh-stagger">
            {filteredApplications.map((application) => (
              <div key={application.id} className="bg-white rounded-lg shadow hover:shadow-md transition-shadow p-4 sm:p-6 hh-lift hh-stagger-item">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center">
                    <span className="text-indigo-600 font-semibold text-lg">
                      {application.candidate_first_name.charAt(0)}{application.candidate_last_name.charAt(0)}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate">
                      {application.candidate_first_name} {application.candidate_last_name}
                    </h3>
                    <div className="flex items-center text-sm text-gray-500 mt-1">
                      <Mail className="w-3 h-3 mr-1 flex-shrink-0" />
                      <span className="truncate">{application.candidate_email}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  <div className="flex items-start gap-2">
                    <Briefcase className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900 truncate">{application.requisition_title}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <span className="font-medium text-gray-700">{application.department}</span>
                    <span className="text-gray-300">•</span>
                    <div className="flex items-center">
                      <MapPin className="w-3 h-3 mr-1" />
                      <span className="truncate">{application.location}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
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

                  <div className="flex items-center justify-between pt-2 text-xs text-gray-400">
                    <span>Applied: {new Date(application.submitted_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
    </div>
  );
};
