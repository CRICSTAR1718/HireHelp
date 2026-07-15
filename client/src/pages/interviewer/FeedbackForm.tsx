import React, { useState } from 'react';
import { Card, CardHeader, CardBody, Button, Input } from "../../components/interviewer";
import { feedbackApi, type FeedbackRating } from "../../api/interviewer";

export const FeedbackForm: React.FC = () => {
  const [ratings, setRatings] = useState<FeedbackRating[]>([
    { competency: 'Technical Skills', score: 0, comment: '' },
    { competency: 'Communication', score: 0, comment: '' },
    { competency: 'Problem Solving', score: 0, comment: '' },
    { competency: 'Cultural Fit', score: 0, comment: '' },
  ]);
  const [recommendation, setRecommendation] = useState('');
  const [notes, setNotes] = useState('');

  const handleScoreChange = (index: number, score: number) => {
    const newRatings = [...ratings];
    newRatings[index].score = score;
    setRatings(newRatings);
  };

  const handleCommentChange = (index: number, comment: string) => {
    const newRatings = [...ratings];
    newRatings[index].comment = comment;
    setRatings(newRatings);
  };

  const calculateOverallScore = () => {
    const total = ratings.reduce((sum, r) => sum + r.score, 0);
    return Math.round(total / ratings.length);
  };

  const handleSubmit = async () => {
    const feedback = {
      assignmentId: 1,
      interviewerId: 1,
      ratings,
      overallScore: calculateOverallScore(),
      recommendation,
      notes,
      submittedAt: new Date(),
    };

    try {
      await feedbackApi.createFeedback(feedback);
      alert('Feedback submitted successfully!');
    } catch (error) {
      console.error('Failed to submit feedback:', error);
      alert('Failed to submit feedback');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Submit Feedback</h1>
          <p className="text-gray-600">Provide detailed feedback for the interview</p>
        </div>

        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold text-gray-900">Interview Feedback</h2>
          </CardHeader>
          <CardBody className="space-y-6">
            {ratings.map((rating, index) => (
              <div key={index} className="border-b border-gray-200 pb-6 last:border-0">
                <h3 className="text-lg font-medium text-gray-900 mb-3">
                  {rating.competency}
                </h3>
                <div className="flex gap-2 mb-3">
                  {[1, 2, 3, 4, 5].map((score) => (
                    <button
                      key={score}
                      onClick={() => handleScoreChange(index, score)}
                      className={`w-10 h-10 rounded-full font-medium transition-colors ${
                        rating.score >= score
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                      }`}
                    >
                      {score}
                    </button>
                  ))}
                </div>
                <Input
                  placeholder="Add comments (optional)"
                  value={rating.comment}
                  onChange={(e) => handleCommentChange(index, e.target.value)}
                />
              </div>
            ))}

            <div className="pt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Overall Recommendation
              </label>
              <select
                value={recommendation}
                onChange={(e) => setRecommendation(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select recommendation</option>
                <option value="hire">Strong Hire</option>
                <option value="hire_with_reservations">Hire with Reservations</option>
                <option value="no_hire">No Hire</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Additional Notes</label>
              <textarea
                rows={4}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any additional observations or notes..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-gray-200">
              <div className="text-lg font-semibold text-gray-900">
                Overall Score: {calculateOverallScore()}/5
              </div>
              <Button onClick={handleSubmit} size="lg">
                Submit Feedback
              </Button>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};
