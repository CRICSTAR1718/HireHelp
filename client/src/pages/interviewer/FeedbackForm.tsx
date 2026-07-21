import React, { useState } from 'react';
import { MessageSquare, X } from 'lucide-react';
import { Card, CardHeader, CardBody, Button } from "../../components/interviewer";
import { StarRating, TagInput } from "../../components/interviewer";
import { feedbackApi } from "../../api/interviewer";
import { toUserMessage } from "../../utils/toUserMessage";

interface DynamicField {
  id: string;
  label: string;
  type: 'rating' | 'text' | 'textarea' | 'tags';
  value: any;
  required: boolean;
}

export const FeedbackForm: React.FC = () => {
  // Required fields
  const [overallRecommendation, setOverallRecommendation] = useState('');
  const [overallRating, setOverallRating] = useState(0);
  const [communicationSkills, setCommunicationSkills] = useState(0);
  const [domainKnowledge, setDomainKnowledge] = useState(0);
  const [problemSolving, setProblemSolving] = useState(0);
  const [confidenceProfessionalism, setConfidenceProfessionalism] = useState(0);
  const [learningAbility, setLearningAbility] = useState(0);
  
  const [strengthAreas, setStrengthAreas] = useState<string[]>([]);
  const [weakAreas, setWeakAreas] = useState<string[]>([]);
  const [topicsCovered, setTopicsCovered] = useState<string[]>([]);
  const [topicsToWorkOn, setTopicsToWorkOn] = useState<string[]>([]);
  
  const [detailedRemarks, setDetailedRemarks] = useState('');
  const [suitableForFutureRoles, setSuitableForFutureRoles] = useState<'yes' | 'no' | ''>('');
  const [recommendedRole, setRecommendedRole] = useState('');
  const [nextAction, setNextAction] = useState('');

  // Dynamic fields
  const [dynamicFields, setDynamicFields] = useState<DynamicField[]>([]);
  const [showAddField, setShowAddField] = useState(false);
  const [newFieldType, setNewFieldType] = useState<'rating' | 'text' | 'textarea' | 'tags'>('text');
  const [newFieldLabel, setNewFieldLabel] = useState('');

  const strengthExamples = ['Communication', 'Leadership', 'Technical Knowledge', 'Teamwork', 'Problem Solving', 'Analytical Thinking', 'Presentation Skills', 'Customer Handling'];
  const weakExamples = ['Communication', 'Confidence', 'Technical Concepts', 'Time Management', 'Analytical Skills'];
  const topicsCoveredExamples = ['Java', 'React', 'SQL', 'OOP', 'Sales Pitch', 'Recruitment Process', 'Excel', 'Financial Analysis'];
  const topicsToWorkOnExamples = ['Database Optimization', 'Public Speaking', 'Leadership', 'DSA', 'Negotiation Skills'];

  const addDynamicField = () => {
    if (!newFieldLabel.trim()) return;
    
    const newField: DynamicField = {
      id: `dynamic-${Date.now()}`,
      label: newFieldLabel,
      type: newFieldType,
      value: newFieldType === 'rating' ? 0 : newFieldType === 'tags' ? [] : '',
      required: false,
    };
    
    setDynamicFields([...dynamicFields, newField]);
    setNewFieldLabel('');
    setShowAddField(false);
  };

  const updateDynamicField = (id: string, value: any) => {
    setDynamicFields(dynamicFields.map(field => 
      field.id === id ? { ...field, value } : field
    ));
  };

  const removeDynamicField = (id: string) => {
    setDynamicFields(dynamicFields.filter(field => field.id !== id));
  };

  const validateForm = () => {
    if (!overallRecommendation) return 'Please select overall recommendation';
    if (overallRating === 0) return 'Please provide overall rating';
    if (communicationSkills === 0) return 'Please rate communication skills';
    if (domainKnowledge === 0) return 'Please rate domain/technical knowledge';
    if (problemSolving === 0) return 'Please rate problem solving';
    if (confidenceProfessionalism === 0) return 'Please rate confidence & professionalism';
    if (learningAbility === 0) return 'Please rate learning ability';
    if (strengthAreas.length === 0) return 'Please add at least one strength area';
    if (weakAreas.length === 0) return 'Please add at least one weak area';
    if (topicsCovered.length === 0) return 'Please add topics covered';
    if (topicsToWorkOn.length === 0) return 'Please add topics to work on';
    if (!detailedRemarks.trim()) return 'Please provide detailed remarks';
    if (!suitableForFutureRoles) return 'Please specify if candidate is suitable for future roles';
    if (!nextAction) return 'Please select next action';
    return null;
  };

  const handleSubmit = async () => {
    const validationError = validateForm();
    if (validationError) {
      alert(validationError);
      return;
    }

    const feedback = {
      assignmentId: 1,
      interviewerId: 1,
      overallRecommendation,
      overallRating,
      ratings: {
        communicationSkills,
        domainKnowledge,
        problemSolving,
        confidenceProfessionalism,
        learningAbility,
      },
      strengthAreas,
      weakAreas,
      topicsCovered,
      topicsToWorkOn,
      detailedRemarks,
      suitableForFutureRoles,
      recommendedRole: suitableForFutureRoles === 'yes' ? recommendedRole : undefined,
      nextAction,
      dynamicFields,
      submittedAt: new Date(),
    };

    try {
      await feedbackApi.createFeedback(feedback);
      alert('Feedback submitted successfully!');
    } catch (error: unknown) {
      console.error('Failed to submit feedback:', error);
      alert(toUserMessage(error, 'Failed to submit feedback'));
    } finally { };
  };

  return (
    <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl shadow-lg">
              <MessageSquare className="w-6 h-6 text-white" strokeWidth={2} />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-slate-900">Submit Feedback</h1>
              <p className="text-slate-600">Provide detailed feedback for the interview</p>
            </div>
          </div>
        </div>

        <Card className="shadow-2xl border-0">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 border-0">
            <h2 className="text-xl font-semibold text-white">Interview Feedback Form</h2>
            <p className="text-blue-100 text-sm">Please fill all required fields marked with *</p>
          </CardHeader>
          <CardBody className="space-y-8 p-8">
            {/* 1. Overall Recommendation */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-slate-700">
                1. Overall Recommendation <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-3">
                {['Hire', 'Hire with Reservations', 'Hold', 'Reject'].map((option) => (
                  <label key={option} className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                    overallRecommendation === option.toLowerCase().replace(' ', '_')
                      ? 'border-blue-500 bg-blue-50 shadow-md'
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}>
                    <input
                      type="radio"
                      name="recommendation"
                      value={option.toLowerCase().replace(' ', '_')}
                      checked={overallRecommendation === option.toLowerCase().replace(' ', '_')}
                      onChange={(e) => setOverallRecommendation(e.target.value)}
                      className="w-5 h-5 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="font-medium text-slate-700">{option}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* 2. Overall Rating */}
            <StarRating
              label="2. Overall Rating"
              value={overallRating}
              onChange={setOverallRating}
              required
            />

            {/* 3. Communication Skills */}
            <StarRating
              label="3. Communication Skills"
              value={communicationSkills}
              onChange={setCommunicationSkills}
              required
            />

            {/* 4. Domain / Technical Knowledge */}
            <StarRating
              label="4. Domain / Technical Knowledge"
              value={domainKnowledge}
              onChange={setDomainKnowledge}
              required
            />

            {/* 5. Problem Solving / Decision Making */}
            <StarRating
              label="5. Problem Solving / Decision Making"
              value={problemSolving}
              onChange={setProblemSolving}
              required
            />

            {/* 6. Confidence & Professionalism */}
            <StarRating
              label="6. Confidence & Professionalism"
              value={confidenceProfessionalism}
              onChange={setConfidenceProfessionalism}
              required
            />

            {/* 7. Learning Ability / Adaptability */}
            <StarRating
              label="7. Learning Ability / Adaptability"
              value={learningAbility}
              onChange={setLearningAbility}
              required
            />

            {/* 8. Strength Areas */}
            <TagInput
              label="8. Strength Areas"
              value={strengthAreas}
              onChange={setStrengthAreas}
              examples={strengthExamples}
              required
            />

            {/* 9. Weak Areas */}
            <TagInput
              label="9. Weak Areas"
              value={weakAreas}
              onChange={setWeakAreas}
              examples={weakExamples}
              required
            />

            {/* 10. Topics Covered During Interview */}
            <TagInput
              label="10. Topics Covered During Interview"
              value={topicsCovered}
              onChange={setTopicsCovered}
              examples={topicsCoveredExamples}
              required
            />

            {/* 11. Topics to Work On */}
            <TagInput
              label="11. Topics to Work On"
              value={topicsToWorkOn}
              onChange={setTopicsToWorkOn}
              examples={topicsToWorkOnExamples}
              required
            />

            {/* 12. Detailed Remarks */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-slate-700">
                12. Detailed Remarks <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={5}
                value={detailedRemarks}
                onChange={(e) => setDetailedRemarks(e.target.value)}
                placeholder="Candidate communicated clearly and demonstrated strong understanding of core concepts. Needs improvement in advanced SQL and confidence while explaining solutions."
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white resize-none"
              />
            </div>

            {/* 13. Suitable for Future Roles */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-slate-700">
                13. Suitable for Future Roles? <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-4">
                {['Yes', 'No'].map((option) => (
                  <label key={option} className={`flex items-center gap-3 px-6 py-3 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                    suitableForFutureRoles === option.toLowerCase()
                      ? 'border-blue-500 bg-blue-50 shadow-md'
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}>
                    <input
                      type="radio"
                      name="futureRoles"
                      value={option.toLowerCase()}
                      checked={suitableForFutureRoles === option.toLowerCase()}
                      onChange={(e) => setSuitableForFutureRoles(e.target.value as 'yes' | 'no')}
                      className="w-5 h-5 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="font-medium text-slate-700">{option}</span>
                  </label>
                ))}
              </div>
              {suitableForFutureRoles === 'yes' && (
                <div className="mt-3 animate-in fade-in slide-in-from-top-2 duration-300">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Recommended Role (Optional)
                  </label>
                  <input
                    type="text"
                    value={recommendedRole}
                    onChange={(e) => setRecommendedRole(e.target.value)}
                    placeholder="e.g., Senior Developer, Team Lead"
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white"
                  />
                </div>
              )}
            </div>

            {/* 14. Next Action */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-slate-700">
                14. Next Action <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-1 gap-3">
                {['Move to Next Round', 'Schedule Another Round', 'Keep on Hold', 'Reject', 'Add to Talent Pool'].map((option) => (
                  <label key={option} className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                    nextAction === option.toLowerCase().replace(' ', '_')
                      ? 'border-blue-500 bg-blue-50 shadow-md'
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}>
                    <input
                      type="radio"
                      name="nextAction"
                      value={option.toLowerCase().replace(' ', '_')}
                      checked={nextAction === option.toLowerCase().replace(' ', '_')}
                      onChange={(e) => setNextAction(e.target.value)}
                      className="w-5 h-5 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="font-medium text-slate-700">{option}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Dynamic Fields Section */}
            <div className="border-t border-slate-200 pt-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-slate-900">Additional Fields</h3>
                <Button
                  onClick={() => setShowAddField(!showAddField)}
                  size="sm"
                  className="shadow-md"
                >
                  + Add Custom Field
                </Button>
              </div>

              {showAddField && (
                <div className="bg-gradient-to-br from-slate-50 to-blue-50 p-6 rounded-xl border border-slate-200 mb-6 space-y-4 shadow-sm animate-in fade-in slide-in-from-top-2 duration-300">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Field Label</label>
                    <input
                      type="text"
                      value={newFieldLabel}
                      onChange={(e) => setNewFieldLabel(e.target.value)}
                      placeholder="Enter field name"
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Field Type</label>
                    <select
                      value={newFieldType}
                      onChange={(e) => setNewFieldType(e.target.value as any)}
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white"
                    >
                      <option value="text">Text Input</option>
                      <option value="textarea">Text Area</option>
                      <option value="rating">Star Rating (1-5)</option>
                      <option value="tags">Tag Input</option>
                    </select>
                  </div>
                  <div className="flex gap-3">
                    <Button onClick={addDynamicField} size="sm" className="shadow-md">
                      Add Field
                    </Button>
                    <Button
                      onClick={() => setShowAddField(false)}
                      size="sm"
                      variant="secondary"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}

              {dynamicFields.map((field) => (
                <div key={field.id} className="bg-gradient-to-br from-slate-50 to-blue-50 p-6 rounded-xl border border-slate-200 mb-4 relative shadow-sm">
                  <button
                    onClick={() => removeDynamicField(field.id)}
                    className="absolute top-4 right-4 text-slate-400 hover:text-red-500 transition-colors p-1 hover:bg-red-50 rounded-lg"
                  >
                    <X className="w-5 h-5" strokeWidth={2} />
                  </button>
                  
                  {field.type === 'rating' && (
                    <StarRating
                      label={field.label}
                      value={field.value}
                      onChange={(val) => updateDynamicField(field.id, val)}
                    />
                  )}
                  
                  {field.type === 'text' && (
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-slate-700">{field.label}</label>
                      <input
                        type="text"
                        value={field.value}
                        onChange={(e) => updateDynamicField(field.id, e.target.value)}
                        className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white"
                      />
                    </div>
                  )}
                  
                  {field.type === 'textarea' && (
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-slate-700">{field.label}</label>
                      <textarea
                        rows={3}
                        value={field.value}
                        onChange={(e) => updateDynamicField(field.id, e.target.value)}
                        className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white resize-none"
                      />
                    </div>
                  )}
                  
                  {field.type === 'tags' && (
                    <TagInput
                      label={field.label}
                      value={field.value}
                      onChange={(val) => updateDynamicField(field.id, val)}
                    />
                  )}
                </div>
              ))}
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-6 border-t border-slate-200">
              <Button 
                onClick={handleSubmit} 
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-200 px-8"
              >
                Submit Feedback
              </Button>
            </div>
          </CardBody>
        </Card>
    </div>
  );
};
