import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Star, User, Briefcase, Mail, Calendar, Award, Download, Trash2, FileText, X, Eye, Phone, Building2 } from 'lucide-react';
import { getTalentPoolCandidates, getTalentPoolStats, removeCandidateFromTalentPool, downloadCandidateResume, type TalentPoolCandidate } from '../../api/recruiter/talent-pool.api';
import { Card } from '../../components/admin/ui/card';
import { Button } from '../../components/admin/ui/button';

export const TalentPool: React.FC = () => {
  const [candidates, setCandidates] = useState<TalentPoolCandidate[]>([]);
  const [stats, setStats] = useState({ total: 0, candidates: 0 });
  const [loading, setLoading] = useState(true);
  const [selectedCandidate, setSelectedCandidate] = useState<TalentPoolCandidate | null>(null);
  const [showRemoveConfirm, setShowRemoveConfirm] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const basePath = location.pathname.startsWith('/admin') ? '/admin' : '/recruiter';

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [candidatesData, statsData] = await Promise.all([
        getTalentPoolCandidates(),
        getTalentPoolStats()
      ]);
      setCandidates(candidatesData);
      setStats(statsData);
    } catch (error) {
      console.error('Failed to load Talent Pool data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveCandidate = async (id: string) => {
    try {
      await removeCandidateFromTalentPool(id);
      await loadData();
      setShowRemoveConfirm(false);
      setSelectedCandidate(null);
    } catch (error) {
      console.error('Failed to remove candidate:', error);
    }
  };

  const handleDownloadResume = async (id: string) => {
    try {
      const { resumeUrl } = await downloadCandidateResume(id);
      if (resumeUrl) {
        window.open(resumeUrl, '_blank');
      }
    } catch (error) {
      console.error('Failed to download resume:', error);
    }
  };

  const buildCandidateProfilePath = (candidate: TalentPoolCandidate) =>
    `${basePath}/requisitions/${candidate.previous_job_id}/pipeline/candidate/${candidate.candidate_id}?applicationId=${candidate.application_id}`;

  const buildApplicationPath = (candidate: TalentPoolCandidate) =>
    `${basePath}/requisitions/${candidate.previous_job_id}/applications/${candidate.application_id}`;

  const buildApplicationsListPath = (candidate: TalentPoolCandidate) =>
    `${basePath}/requisitions/${candidate.previous_job_id}/applications`;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">Talent Pool</h1>
          <p className="text-slate-600 text-base sm:text-sm">Rejected candidates retained for future opportunities</p>
        </div>

        <div className="mb-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="p-4 sm:p-6">
            <div className="text-2xl sm:text-3xl font-bold text-slate-900">{stats.total}</div>
            <div className="text-sm text-slate-600">Total Candidates</div>
          </Card>
          <Card className="p-4 sm:p-6">
            <div className="text-2xl sm:text-3xl font-bold text-blue-600">{stats.candidates}</div>
            <div className="text-sm text-slate-600">Active in Pool</div>
          </Card>
          <Card className="p-4 sm:p-6">
            <div className="text-2xl sm:text-3xl font-bold text-green-600">{candidates.filter(c => c.ai_score).length}</div>
            <div className="text-sm text-slate-600">With AI Scores</div>
          </Card>
        </div>

        {candidates.length === 0 ? (
          <Card className="text-center py-12">
            <User className="mx-auto h-12 w-12 text-slate-400" />
            <h3 className="mt-2 text-sm font-medium text-slate-900">No candidates in Talent Pool</h3>
            <p className="mt-1 text-sm text-slate-500">
              Rejected candidates will be automatically added here.
            </p>
          </Card>
        ) : (
          <div className="space-y-4">
            {candidates.map((candidate) => (
              <Card key={candidate.id} className="p-4 sm:p-6">
                <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                      <User className="w-6 h-6 text-blue-600" />
                    </div>

                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-3">
                        <h3 className="font-semibold text-slate-900 text-base sm:text-sm">{candidate.candidateName}</h3>
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
                          Current Status: {candidate.status}
                        </span>
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                          Added {new Date(candidate.added_at).toLocaleDateString()}
                        </span>
                      </div>

                      <div className="grid gap-3 grid-cols-1 md:grid-cols-2 xl:grid-cols-3 mb-4">
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <Mail className="w-4 h-4" />
                          <span className="truncate">{candidate.email || 'Not specified'}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <Phone className="w-4 h-4" />
                          <span className="truncate">{candidate.phone || 'Not specified'}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <Briefcase className="w-4 h-4" />
                          <span className="truncate">{candidate.previousJobTitle || 'Previous job not available'}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <Building2 className="w-4 h-4" />
                          <span className="truncate">{candidate.previousJobDepartment || 'Department not specified'}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <Calendar className="w-4 h-4" />
                          <span className="truncate">{candidate.previousJobLocation || 'Location not specified'}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <FileText className="w-4 h-4" />
                          <span className="truncate">{candidate.resumeFileName || 'Resume available'}</span>
                        </div>
                      </div>

                      <div className="grid gap-3 grid-cols-1 md:grid-cols-2 xl:grid-cols-3 mb-4">
                        {candidate.ai_score != null && (
                          <div className="flex items-center gap-2 text-sm">
                            <Award className="w-4 h-4 text-slate-400" />
                            <span className="text-slate-600">AI Score:</span>
                            <span className="font-semibold text-blue-600">{Number(candidate.ai_score).toFixed(1)}%</span>
                          </div>
                        )}
                        {candidate.interview_score != null && (
                          <div className="flex items-center gap-2 text-sm">
                            <Star className="w-4 h-4 text-slate-400" />
                            <span className="text-slate-600">Interview Score:</span>
                            <span className="font-semibold text-green-600">{Number(candidate.interview_score).toFixed(1)}</span>
                          </div>
                        )}
                        {candidate.resumeUrl && (
                          <div className="flex items-center gap-2 text-sm text-slate-600">
                            <Download className="w-4 h-4" />
                            <span>Resume is available</span>
                          </div>
                        )}
                      </div>

                      {candidate.rejection_reason && (
                        <div className="text-sm text-slate-600 mb-3">
                          <span className="font-medium">Rejection Reason:</span> {candidate.rejection_reason}
                        </div>
                      )}

                      {candidate.interview_feedback && (
                        <div className="text-sm text-slate-600 mb-3">
                          <span className="font-medium">Interview Feedback:</span>
                          <div className="mt-1 rounded bg-slate-50 p-3 text-xs max-h-24 overflow-y-auto">
                            {typeof candidate.interview_feedback === 'string'
                              ? candidate.interview_feedback.substring(0, 240) + (candidate.interview_feedback.length > 240 ? '...' : '')
                              : JSON.stringify(candidate.interview_feedback).substring(0, 240) + '...'
                            }
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 lg:flex-col lg:items-stretch lg:min-w-55">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(buildCandidateProfilePath(candidate))}
                      className="flex items-center justify-center gap-2 text-base sm:text-sm"
                    >
                      <Eye className="w-4 h-4" />
                      View Candidate Profile
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => candidate.resumeUrl && window.open(candidate.resumeUrl, '_blank', 'noopener,noreferrer')}
                      disabled={!candidate.resumeUrl}
                      className="flex items-center justify-center gap-2 text-base sm:text-sm"
                    >
                      <FileText className="w-4 h-4" />
                      View Resume
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownloadResume(candidate.id)}
                      disabled={!candidate.resumeUrl}
                      className="flex items-center justify-center gap-2 text-base sm:text-sm"
                    >
                      <Download className="w-4 h-4" />
                      Download Resume
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(buildApplicationPath(candidate))}
                      className="flex items-center justify-center gap-2 text-base sm:text-sm"
                    >
                      <FileText className="w-4 h-4" />
                      View Interview Feedback
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(buildApplicationsListPath(candidate))}
                      className="flex items-center justify-center gap-2 text-base sm:text-sm"
                    >
                      <FileText className="w-4 h-4" />
                      View Previous Applications
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedCandidate(candidate);
                        setShowRemoveConfirm(true);
                      }}
                      className="flex items-center justify-center gap-2 text-red-600 border-red-200 hover:bg-red-50 text-base sm:text-sm"
                    >
                      <Trash2 className="w-4 h-4" />
                      Remove Candidate from Talent Pool
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

      {/* Remove Confirmation Modal */}
      {showRemoveConfirm && selectedCandidate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-900">Remove from Talent Pool</h3>
              <button
                onClick={() => {
                  setShowRemoveConfirm(false);
                  setSelectedCandidate(null);
                }}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-slate-600 mb-6">
              Are you sure you want to remove <strong>{selectedCandidate.candidateName}</strong> from the Talent Pool? This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <Button
                variant="outline"
                onClick={() => {
                  setShowRemoveConfirm(false);
                  setSelectedCandidate(null);
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={() => handleRemoveCandidate(selectedCandidate.id)}
                className="bg-red-600 hover:bg-red-700"
              >
                Remove
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};
