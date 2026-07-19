import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardBody, CardFooter, Button } from "../../components/interviewer";
import { assignmentApi, type Assignment } from "../../api/interviewer";
import { Video, Mail, CheckCircle } from 'lucide-react';

export const AssignedInterviews: React.FC = () => {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [sendingInvitation, setSendingInvitation] = useState<number | null>(null);

  useEffect(() => {
    loadAssignments();
  }, []);

  const loadAssignments = async () => {
    try {
      const data = await assignmentApi.getInterviewerAssignments(1);
      // Deduplicate assignments by interviewId to prevent duplicate cards
      const uniqueAssignments = data.filter((assignment, index, self) =>
        index === self.findIndex((a) => a.interviewId === assignment.interviewId)
      );
      setAssignments(uniqueAssignments);
    } catch (error) {
      console.error('Failed to load assignments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendInvitation = async (scheduleId: number, candidateEmail: string, candidateName: string, interviewerEmail: string, interviewerName: string) => {
    try {
      setSendingInvitation(scheduleId);
      
      await fetch('/api/interviews/scheduling/' + scheduleId + '/send-invite', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          interviewerId: 1, // Should come from current user
          candidateEmail,
          candidateName,
          interviewerEmail,
          interviewerName,
        }),
      });
      
      // Refresh assignments to update invitation status
      await loadAssignments();
    } catch (error) {
      console.error('Failed to send invitation:', error);
      alert('Failed to send calendar invitation');
    } finally {
      setSendingInvitation(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-xl text-gray-600">Loading assignments...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">My Interviews</h1>
          <p className="text-gray-600">Manage your assigned interview sessions</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {assignments.map((assignment) => (
            <Card key={assignment.id} className="hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Interview #{assignment.interviewId}
                    </h3>
                    <p className="text-sm text-gray-500">Candidate ID: {assignment.candidateId}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(assignment.status)}`}>
                    {assignment.status}
                  </span>
                </div>
              </CardHeader>
              <CardBody>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Candidate:</span>
                    <span className="font-medium text-gray-900">{assignment.candidateName || `Candidate #${assignment.candidateId}`}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Role:</span>
                    <span className="font-medium text-gray-900">{assignment.role}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Interviewer:</span>
                    <span className="font-medium text-gray-900">{assignment.interviewerName || `Interviewer #${assignment.interviewerId}`}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Assigned:</span>
                    <span className="font-medium text-gray-900">
                      {new Date(assignment.assignedAt).toLocaleDateString()}
                    </span>
                  </div>
                  {assignment.completedAt && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Completed:</span>
                      <span className="font-medium text-gray-900">
                        {new Date(assignment.completedAt).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>
              </CardBody>
              <CardFooter className="flex flex-col gap-2">
                <Button variant="primary" className="w-full">
                  View Details
                </Button>
                {assignment.status === 'pending' && !assignment.invitationSent && (
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => handleSendInvitation(
                      assignment.scheduleId || assignment.id,
                      assignment.candidateEmail || 'candidate@example.com',
                      assignment.candidateName || 'Candidate',
                      assignment.interviewerEmail || 'interviewer@example.com',
                      assignment.interviewerName || 'Interviewer'
                    )}
                    disabled={sendingInvitation === assignment.id}
                  >
                    {sendingInvitation === assignment.id ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Mail className="w-4 h-4 mr-2" />
                        Send Invitation
                      </>
                    )}
                  </Button>
                )}
                {assignment.invitationSent && assignment.meetingLink && (
                  <Button variant="outline" className="w-full bg-blue-50 border-blue-200 text-blue-700">
                    <Video className="w-4 h-4 mr-2" />
                    <a href={assignment.meetingLink} target="_blank" rel="noopener noreferrer" className="flex items-center">
                      Join Meeting
                    </a>
                  </Button>
                )}
                {assignment.invitationSent && !assignment.meetingLink && (
                  <Button variant="outline" className="w-full bg-green-50 border-green-200 text-green-700" disabled>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Invitation Sent
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>

        {assignments.length === 0 && (
          <Card>
            <CardBody className="text-center py-12">
              <p className="text-gray-500 mb-4">No interviews assigned yet</p>
              <Button variant="outline">Refresh</Button>
            </CardBody>
          </Card>
        )}
      </div>
    </div>
  );
};
