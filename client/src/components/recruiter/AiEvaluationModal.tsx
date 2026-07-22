import React, { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'

interface AiEvaluationModalProps {
  isOpen: boolean
  onClose: () => void
  applicationId: string
  requisitionId?: string
  candidateName: string
  position?: { top: number; left: number }
}

interface DimensionScore {
  score: number | null
  reasoning: string | null
}

interface Dimensions {
  skills: DimensionScore
  experience: DimensionScore
  education: DimensionScore
  culture_fit: DimensionScore
}

interface AiEvaluationData {
  application_id: string
  candidate_id: string
  requisition_id: string
  overall_score: number | null
  overall_reasoning: string | null
  fit_verdict: 'strong_fit' | 'moderate_fit' | 'weak_fit'
  strengths: string[]
  weaknesses: string[]
  recommendations: string[]
  consider_because: string[]
  not_consider_because: string[]
  suitable_roles: string[]
  dimensions: Dimensions
  matched_skills: string[]
  missing_skills: string[]
}

export const AiEvaluationModal: React.FC<AiEvaluationModalProps> = ({
  isOpen,
  onClose,
  applicationId,
  requisitionId,
  candidateName,
  position
}) => {
  const [evaluation, setEvaluation] = useState<AiEvaluationData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showDetailedBreakdown, setShowDetailedBreakdown] = useState(false)
  const [modalPosition, setModalPosition] = useState<{ top: number; left: number } | null>(null)
  const [modalWidth, setModalWidth] = useState(600)

  useEffect(() => {
    if (isOpen && applicationId) {
      fetchEvaluation()
    }
  }, [isOpen, applicationId])

  useEffect(() => {
    if (isOpen && position) {
      const margin = 16
      const estimatedModalHeight = 500
      const estimatedModalWidth = modalWidth

      let top = position.top + 8
      let left = position.left

      // Clamp to viewport
      if (left + estimatedModalWidth > window.innerWidth - margin) {
        left = window.innerWidth - estimatedModalWidth - margin
      }
      if (left < margin) {
        left = margin
      }

      if (top + estimatedModalHeight > window.innerHeight - margin) {
        // Flip to open above the button
        top = position.top - estimatedModalHeight - 8
      }
      if (top < margin) {
        top = margin
      }

      setModalPosition({ top, left })
    } else {
      setModalPosition(null)
    }
  }, [isOpen, position, modalWidth])

  const fetchEvaluation = async () => {
    setLoading(true)
    setError(null)
    try {
      const { getAiEvaluation } = await import('../../api/recruiter/applications')
      const data = await getAiEvaluation(applicationId, requisitionId)
      setEvaluation(data)
    } catch (err: any) {
      setError(err.message || 'Failed to load AI evaluation')
    } finally {
      setLoading(false)
    }
  }

  const getFitVerdictColor = (verdict: string) => {
    switch (verdict) {
      case 'strong_fit':
        return 'bg-green-100 text-green-800 border-green-300'
      case 'moderate_fit':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300'
      case 'weak_fit':
        return 'bg-red-100 text-red-800 border-red-300'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }

  const getFitVerdictLabel = (verdict: string) => {
    switch (verdict) {
      case 'strong_fit':
        return 'Strong Fit'
      case 'moderate_fit':
        return 'Moderate Fit'
      case 'weak_fit':
        return 'Weak Fit'
      default:
        return verdict
    }
  }

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose()
    }
  }

  if (!isOpen) return null

  const modalContent = (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm"
        onClick={handleBackdropClick}
        onKeyDown={handleKeyDown}
      />
      
      {/* Modal */}
      <div 
        className="fixed z-50 bg-white rounded-xl shadow-2xl max-h-[90vh] overflow-y-auto"
        style={{
          top: modalPosition?.top ?? '50%',
          left: modalPosition?.left ?? '50%',
          transform: modalPosition ? 'none' : 'translate(-50%, -50%)',
          width: modalWidth
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 sticky top-0 bg-white">
          <h2 className="text-xl font-semibold text-gray-900">AI Evaluation - {candidateName}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="px-6 py-4">
          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
          )}

          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {evaluation && !loading && (
            <div className="space-y-6">
              {/* Header with score and verdict */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    {evaluation.overall_score !== null ? `${evaluation.overall_score}%` : 'N/A'}
                  </h3>
                  <p className="text-sm text-gray-500">Overall Score</p>
                </div>
                <span className={`px-3 py-1 text-sm font-medium border ${getFitVerdictColor(evaluation.fit_verdict)}`}>
                  {getFitVerdictLabel(evaluation.fit_verdict)}
                </span>
              </div>

              {/* Overall reasoning */}
              {evaluation.overall_reasoning && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Overall Assessment</h4>
                  <p className="text-gray-700 text-sm">{evaluation.overall_reasoning}</p>
                </div>
              )}

              {/* Strengths */}
              {evaluation.strengths && evaluation.strengths.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Strengths</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                    {evaluation.strengths.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Weaknesses */}
              {evaluation.weaknesses && evaluation.weaknesses.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Weaknesses</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                    {evaluation.weaknesses.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Recommendations */}
              {evaluation.recommendations && evaluation.recommendations.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Recommendations</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                    {evaluation.recommendations.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Consider because */}
              <div>
                <h4 className="font-medium text-gray-900 mb-2">May be considered for this role because</h4>
                {evaluation.consider_because && evaluation.consider_because.length > 0 ? (
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                    {evaluation.consider_because.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-500">No specific reasons identified.</p>
                )}
              </div>

              {/* Not consider because */}
              <div>
                <h4 className="font-medium text-gray-900 mb-2">May not be considered for this role because</h4>
                {evaluation.not_consider_because && evaluation.not_consider_because.length > 0 ? (
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                    {evaluation.not_consider_because.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-500">No significant concerns identified.</p>
                )}
              </div>

              {/* Suitable roles */}
              {evaluation.suitable_roles && evaluation.suitable_roles.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Suitable Roles</h4>
                  <div className="flex flex-wrap gap-2">
                    {evaluation.suitable_roles.map((role, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-indigo-100 text-indigo-800 text-sm rounded-full"
                      >
                        {role}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Matched/Missing skills */}
              {(evaluation.matched_skills?.length > 0 || evaluation.missing_skills?.length > 0) && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {evaluation.matched_skills && evaluation.matched_skills.length > 0 && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Matched Skills</h4>
                      <div className="flex flex-wrap gap-2">
                        {evaluation.matched_skills.map((skill, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {evaluation.missing_skills && evaluation.missing_skills.length > 0 && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Missing Skills</h4>
                      <div className="flex flex-wrap gap-2">
                        {evaluation.missing_skills.map((skill, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Collapsible detailed breakdown */}
              <div className="border-t border-gray-200 pt-4">
                <button
                  onClick={() => setShowDetailedBreakdown(!showDetailedBreakdown)}
                  className="flex items-center gap-2 text-sm font-medium text-indigo-600 hover:text-indigo-800"
                >
                  <svg
                    className={`w-4 h-4 transition-transform ${showDetailedBreakdown ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                  {showDetailedBreakdown ? 'Hide' : 'Show'} Detailed Breakdown
                </button>

                {showDetailedBreakdown && (
                  <div className="mt-4 space-y-4">
                    {Object.entries(evaluation.dimensions).map(([key, dimension]) => (
                      <div key={key} className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h5 className="font-medium text-gray-900 capitalize">
                            {key.replace('_', ' ')}
                          </h5>
                          {dimension.score !== null && (
                            <span className="text-sm font-semibold text-gray-700">
                              {dimension.score}%
                            </span>
                          )}
                        </div>
                        {dimension.reasoning && (
                          <p className="text-sm text-gray-600">{dimension.reasoning}</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )

  return createPortal(modalContent, document.body)
}
