import React, { useState } from 'react'
import api from "../../api/recruiter"

interface FeedbackFormProps {
  applicationId: string
  requisitionId: string
  onSubmitted: () => void
}

export const FeedbackForm: React.FC<FeedbackFormProps> = ({ applicationId, requisitionId, onSubmitted }) => {
  const [round, setRound] = useState('HR Screening')
  const [rating, setRating] = useState('3')
  const [recommendation, setRecommendation] = useState('hire')
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      // In a real app, this might go through interview-service, but for manual override we use a webhook/API
      await api.post(`/feedback-webhook`, {
        applicationId,
        requisitionId,
        interviewRound: round,
        overallRating: Number(rating),
        recommendation,
        details: { notes }
      })
      setNotes('')
      onSubmitted()
    } catch (err) {
      console.error('Failed to submit feedback', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h4 className="font-semibold text-sm text-gray-700 dark:text-gray-300">Add Manual Feedback</h4>
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Round</label>
          <input 
            type="text" 
            value={round} 
            onChange={e => setRound(e.target.value)}
            className="w-full text-sm rounded border-gray-300 dark:border-gray-600 dark:bg-gray-700 p-2"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Rating (1-5)</label>
          <input 
            type="number" min="1" max="5" 
            value={rating} 
            onChange={e => setRating(e.target.value)}
            className="w-full text-sm rounded border-gray-300 dark:border-gray-600 dark:bg-gray-700 p-2"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Recommendation</label>
          <select 
            value={recommendation} 
            onChange={e => setRecommendation(e.target.value)}
            className="w-full text-sm rounded border-gray-300 dark:border-gray-600 dark:bg-gray-700 p-2"
          >
            <option value="strong_hire">Strong Hire</option>
            <option value="hire">Hire</option>
            <option value="no_hire">No Hire</option>
            <option value="strong_no_hire">Strong No Hire</option>
          </select>
        </div>
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Notes</label>
        <textarea 
          value={notes} 
          onChange={e => setNotes(e.target.value)}
          rows={2}
          className="w-full text-sm rounded border-gray-300 dark:border-gray-600 dark:bg-gray-700 p-2"
        />
      </div>
      <button 
        type="submit" 
        disabled={loading}
        className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-4 py-2 rounded text-sm font-medium disabled:opacity-50"
      >
        {loading ? 'Submitting...' : 'Submit Feedback'}
      </button>
    </form>
  )
}
