import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardBody, Button } from "../../components/interviewer";
import { feedbackApi, type Feedback } from "../../api/interviewer";

export const InterviewHistory: React.FC = () => {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFeedbacks();
  }, []);

  const loadFeedbacks = async () => {
    try {
      const data = await feedbackApi.getInterviewerFeedback(1);
      setFeedbacks(data);
    } catch (error) {
      console.error('Failed to load feedbacks:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRecommendationColor = (recommendation: string) => {
    switch (recommendation) {
      case 'hire': return 'bg-green-100 text-green-800';
      case 'hire_with_reservations': return 'bg-yellow-100 text-yellow-800';
      case 'hold': return 'bg-gray-100 text-gray-800';
      case 'reject': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRecommendationLabel = (recommendation: string) => {
    switch (recommendation) {
      case 'hire': return 'Hire';
      case 'hire_with_reservations': return 'Hire with Reservations';
      case 'hold': return 'Hold';
      case 'reject': return 'Reject';
      default: return 'Pending';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading history...</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Interview History</h1>
          <p className="text-gray-600">View your past interview feedback and ratings</p>
        </div>

        <div className="space-y-6">
          {feedbacks.map((feedback) => (
            <Card key={feedback.id} className="hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Assignment #{feedback.assignmentId}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Submitted: {new Date(feedback.submittedAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Overall Rating</p>
                      <p className="text-2xl font-bold text-gray-900">{feedback.overallRating}/5</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getRecommendationColor(feedback.overallRecommendation)}`}>
                      {getRecommendationLabel(feedback.overallRecommendation)}
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardBody>
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Competency Ratings</h4>
                  <div className="space-y-2">
                    {Object.entries(feedback.ratings).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </span>
                        <div className="flex items-center gap-2">
                          <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((score) => (
                              <div
                                key={score}
                                className={`w-4 h-4 rounded-full ${
                                  value >= score ? 'bg-blue-600' : 'bg-gray-200'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-sm font-medium text-gray-900">{value}/5</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {feedback.strengthAreas && feedback.strengthAreas.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Strength Areas</h4>
                    <div className="flex flex-wrap gap-2">
                      {feedback.strengthAreas.map((area, idx) => (
                        <span key={idx} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                          {area}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {feedback.weakAreas && feedback.weakAreas.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Areas to Improve</h4>
                    <div className="flex flex-wrap gap-2">
                      {feedback.weakAreas.map((area, idx) => (
                        <span key={idx} className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm">
                          {area}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {feedback.detailedRemarks && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Detailed Remarks</h4>
                    <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">{feedback.detailedRemarks}</p>
                  </div>
                )}
              </CardBody>
            </Card>
          ))}
        </div>

        {feedbacks.length === 0 && (
          <Card>
            <CardBody className="text-center py-12">
              <p className="text-gray-500 mb-4">No interview feedback history yet</p>
              <Button variant="outline" onClick={loadFeedbacks}>Refresh</Button>
            </CardBody>
          </Card>
        )}
    </div>
  );
};
