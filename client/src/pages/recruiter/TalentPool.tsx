import React, { useState, useEffect } from 'react';
import { Star, User, Briefcase, Mail, MapPin, Calendar, Award } from 'lucide-react';
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

export const TalentPool: React.FC = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    try {
      const data = await getApplications();
      // Filter for shortlisted candidates and those in interview stages
      const talentPoolCandidates = data.filter((app: Application) =>
        app.status === 'shortlisted' ||
        app.status === 'under_review' ||
        app.status === 'hired'
      );
      setApplications(talentPoolCandidates);
    } catch (error) {
      console.error('Failed to load applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'shortlisted': return 'bg-green-100 text-green-800 border-green-200';
      case 'under_review': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'hired': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'shortlisted': return <Star className="w-4 h-4 fill-current" />;
      case 'hired': return <Award className="w-4 h-4" />;
      default: return <Calendar className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Talent Pool</h1>
          <p className="text-gray-600">Shortlisted candidates and interview-ready talent for your organization</p>
        </div>

        {applications.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <Star className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No candidates in talent pool</h3>
            <p className="mt-1 text-sm text-gray-500">
              Shortlisted candidates will appear here once they advance through the pipeline.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {applications.map((application) => (
              <div
                key={application.id}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 border border-gray-200"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center">
                      <User className="w-6 h-6 text-indigo-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {application.candidate_first_name} {application.candidate_last_name}
                      </h3>
                      <p className="text-sm text-gray-500">{application.candidate_email}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 border ${getStatusColor(application.status)}`}>
                    {getStatusIcon(application.status)}
                    {application.status.replace('_', ' ')}
                  </span>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Briefcase className="w-4 h-4 text-gray-400" />
                    <span className="font-medium text-gray-900">{application.requisition_title}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span className="font-medium">{application.department}</span>
                    <span>•</span>
                    <div className="flex items-center">
                      <MapPin className="w-3 h-3 mr-1" />
                      {application.location}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="text-sm">
                    <span className="text-gray-500">AI Fitment Score:</span>
                    <span className="ml-2 font-semibold text-indigo-600">
                      {application.ai_score ? `${parseFloat(application.ai_score).toFixed(1)}%` : 'N/A'}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500">
                    <div className="flex items-center">
                      <Calendar className="w-3 h-3 mr-1" />
                      {new Date(application.submitted_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                {application.status === 'shortlisted' && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <button className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium">
                      Schedule Interview
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
