import React, { useState, useEffect } from 'react'
import { shortlistEntry, rejectEntry, updateNotes } from "../../api/recruiter/pipeline"
import { useNavigate } from 'react-router-dom'

interface ShortlistPanelProps {
  reqId: string
  entryId: string
}

export const ShortlistPanel: React.FC<ShortlistPanelProps> = ({ reqId, entryId }) => {
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleAction = async (action: 'shortlist' | 'reject' | 'save_notes') => {
    setLoading(true)
    try {
      if (action === 'shortlist') {
        await shortlistEntry(reqId, entryId, notes)
        alert('Candidate shortlisted successfully.')
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

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-semibold mb-4">Pipeline Actions</h3>
      
      <div className="space-y-4">
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
