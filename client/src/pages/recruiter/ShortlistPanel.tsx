import React, { useState, useEffect } from 'react'
import { shortlistEntry, rejectEntry, updateNotes } from "../../api/recruiter/pipeline"
import { useNavigate } from 'react-router-dom'

interface ShortlistPanelProps {
  reqId: string
  entryId: string
  candidateId?: string
}

export const ShortlistPanel: React.FC<ShortlistPanelProps> = ({ reqId, entryId, candidateId }) => {
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const [justShortlisted, setJustShortlisted] = useState(false)
  const navigate = useNavigate()

  const handleAction = async (action: 'shortlist' | 'reject' | 'save_notes') => {
    setLoading(true)
    try {
      if (action === 'shortlist') {
        await shortlistEntry(reqId, entryId, notes)
        alert('Candidate shortlisted successfully.')
        // Stay on this page so HR can immediately assign an interviewer,
        // instead of navigating away -- shortlisting and scheduling are one
        // motion in practice.
        setJustShortlisted(true)
        setLoading(false)
        return
      } else if (action === 'reject') {
        await rejectEntry(reqId, entryId, notes)
        alert('Candidate rejected.')
      } else if (action === 'save_notes') {
        await updateNotes(reqId, entryId, notes)
        alert('Notes saved.')
      }
      navigate(-1) // go back to pipeline board
    } catch (err) {
      console.error(`Failed to ${action} candidate`, err)
    } finally {
      setLoading(false)
    }
  }

  const handleScheduleInterview = () => {
    const query = candidateId ? `?candidateId=${candidateId}` : ''
    navigate(`/recruiter/interviews/schedule${query}`)
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-semibold mb-4">Pipeline Actions</h3>
      
      <div className="space-y-4">
        {justShortlisted && (
          <div className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700 rounded p-3">
            <p className="text-sm text-green-800 dark:text-green-200 mb-2">
              Candidate shortlisted. Assign an interviewer and pick a slot now?
            </p>
            <button
              onClick={handleScheduleInterview}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm font-medium transition-colors"
            >
              Schedule Interview
            </button>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Recruiter Notes</label>
          <textarea 
            value={notes} 
            onChange={e => setNotes(e.target.value)}
            rows={3}
            placeholder="Add reasoning for shortlisting or rejection..."
            className="w-full text-sm rounded border-gray-300 dark:border-gray-600 dark:bg-gray-700 p-2"
          />
        </div>

        <div className="flex flex-col gap-2">
          <button 
            onClick={() => handleAction('save_notes')}
            disabled={loading}
            className="w-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white px-4 py-2 rounded text-sm transition-colors disabled:opacity-50"
          >
            Save Notes Only
          </button>
          <button
            onClick={handleScheduleInterview}
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded text-sm font-medium transition-colors disabled:opacity-50"
          >
            Schedule Interview
          </button>
          <button 
            onClick={() => handleAction('shortlist')}
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm font-medium transition-colors disabled:opacity-50"
          >
            Shortlist for Interview
          </button>
          <button 
            onClick={() => handleAction('reject')}
            disabled={loading}
            className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm font-medium transition-colors disabled:opacity-50"
          >
            Reject Candidate
          </button>
        </div>
      </div>
    </div>
  )
}