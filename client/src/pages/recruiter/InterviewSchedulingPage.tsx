import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Calendar, Clock, MapPin, Video, User, Users, CheckCircle, AlertCircle } from 'lucide-react';
import { interviewSchedulingApi } from '../../api/admin/interviewScheduling.api';
import type { Interviewer, Candidate } from '../../api/admin/interviewScheduling.api';

const INTERVIEW_TYPES = [
  'Technical Interview',
  'Behavioral Interview',
  'System Design',
  'Code Review',
  'Culture Fit',
  'Final Round',
];

const InterviewSchedulingPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preselectedCandidateId = searchParams.get('candidateId');
  
  const [interviewers, setInterviewers] = useState<Interviewer[]>([]);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    candidateId: preselectedCandidateId || '',
    interviewerId: '',
    role: '',
    interviewType: INTERVIEW_TYPES[0],
    date: '',
    startTime: '',
    endTime: '',
    location: '',
    meetingLink: '',
    interviewMode: 'in-person' as 'in-person' | 'virtual',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [interviewersData, candidatesData] = await Promise.all([
        interviewSchedulingApi.getInterviewersByRoles(),
        interviewSchedulingApi.getShortlistedCandidates(),
      ]);
      setInterviewers(interviewersData);
      setCandidates(candidatesData);
    } catch (err) {
      setError('Failed to load data. Please try again.');
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      if (!formData.candidateId || !formData.interviewerId || !formData.date || !formData.startTime || !formData.endTime) {
        setError('Please fill in all required fields.');
        setSubmitting(false);
        return;
      }

      const startTime = new Date(`${formData.date}T${formData.startTime}`);
      const endTime = new Date(`${formData.date}T${formData.endTime}`);

      if (endTime <= startTime) {
        setError('End time must be after start time.');
        setSubmitting(false);
        return;
      }

      const scheduleData = {
        interviewerId: parseInt(formData.interviewerId),
        candidateId: formData.candidateId,
        role: formData.interviewType,
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        location: formData.interviewMode === 'in-person' ? formData.location : undefined,
        status: 'scheduled',
      };

      const result = await interviewSchedulingApi.createInterviewSchedule(scheduleData);
      
      // Auto-send invitation for virtual interviews
      if (formData.interviewMode === 'virtual' && result.schedule) {
        const selectedCandidate = candidates.find(c => c.id.toString() === formData.candidateId);
        const selectedInterviewer = interviewers.find(i => i.id.toString() === formData.interviewerId);
        
        if (selectedCandidate && selectedInterviewer) {
          try {
            await interviewSchedulingApi.sendInvitation(result.schedule.id, {
              interviewerId: parseInt(formData.interviewerId),
              candidateEmail: selectedCandidate.email,
              candidateName: `${selectedCandidate.firstName} ${selectedCandidate.lastName}`,
              interviewerEmail: selectedInterviewer.email,
              interviewerName: selectedInterviewer.name,
            });
          } catch (inviteError) {
            console.warn('Failed to send calendar invitation:', inviteError);
            // Don't fail the whole process if invitation fails
          }
        }
      }

      setSuccess(true);
      
      setTimeout(() => {
        navigate('/recruiter/interviews');
      }, 2000);
    } catch (err) {
      setError('Failed to schedule interview. Please try again.');
      console.error('Error scheduling interview:', err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading interview data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Schedule Interview</h1>
        <p className="mt-2 text-slate-600">Assign an interviewer and schedule an interview with a shortlisted candidate</p>
      </div>

      {success && (
        <div className="mb-6 bg-emerald-50 border border-emerald-200 rounded-lg p-4 flex items-center gap-3">
          <CheckCircle className="h-5 w-5 text-emerald-600" />
          <div>
            <p className="font-medium text-emerald-800">Interview scheduled successfully!</p>
            <p className="text-sm text-emerald-600">Redirecting to interviews...</p>
          </div>
        </div>
      )}

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
          <AlertCircle className="h-5 w-5 text-red-600" />
          <p className="text-red-800">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Candidate Selection */}
        <div className="bg-white border border-slate-200 rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <User className="h-5 w-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-slate-900">Select Candidate</h2>
          </div>
          <select
            value={formData.candidateId}
            onChange={(e) => setFormData({ ...formData, candidateId: e.target.value })}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="">Choose a candidate...</option>
            {candidates.map((candidate) => (
              <option key={candidate.id} value={candidate.id.toString()}>
                {candidate.firstName} {candidate.lastName} - {candidate.email}
                {candidate.profile?.headline && ` (${candidate.profile.headline})`}
              </option>
            ))}
          </select>
        </div>

        {/* Interviewer Selection */}
        <div className="bg-white border border-slate-200 rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <Users className="h-5 w-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-slate-900">Select Interviewer</h2>
          </div>
          <select
            value={formData.interviewerId}
            onChange={(e) => setFormData({ ...formData, interviewerId: e.target.value })}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="">Choose an interviewer...</option>
            {interviewers.map((interviewer) => (
              <option key={interviewer.id} value={interviewer.id.toString()}>
                {interviewer.name} - {interviewer.email}
                {interviewer.expertise && interviewer.expertise.length > 0 && ` (${interviewer.expertise.join(', ')})`}
              </option>
            ))}
          </select>
        </div>

        {/* Interview Details */}
        <div className="bg-white border border-slate-200 rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="h-5 w-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-slate-900">Interview Details</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Interview Type</label>
              <select
                value={formData.interviewType}
                onChange={(e) => setFormData({ ...formData, interviewType: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {INTERVIEW_TYPES.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Interview Mode</label>
              <select
                value={formData.interviewMode}
                onChange={(e) => setFormData({ ...formData, interviewMode: e.target.value as 'in-person' | 'virtual' })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="in-person">In-Person</option>
                <option value="virtual">Virtual</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Date</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
                min={new Date().toISOString().split('T')[0]}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Start Time</label>
              <input
                type="time"
                value={formData.startTime}
                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">End Time</label>
              <input
                type="time"
                value={formData.endTime}
                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          </div>

          {formData.interviewMode === 'in-person' && (
            <div className="mt-4">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Location
                </div>
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g., Conference Room A, 123 Main St"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          )}

          {formData.interviewMode === 'virtual' && (
            <div className="mt-4">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                <div className="flex items-center gap-2">
                  <Video className="h-4 w-4" />
                  Meeting Link
                </div>
              </label>
              <div className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-slate-50 text-slate-600">
                Auto-generated by Google Calendar
              </div>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate('/recruiter/interviews')}
            className="px-6 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {submitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Scheduling...
              </>
            ) : (
              <>
                <Clock className="h-4 w-4" />
                Schedule Interview
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default InterviewSchedulingPage;
