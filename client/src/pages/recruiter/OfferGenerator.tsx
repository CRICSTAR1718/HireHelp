import React, { useState } from 'react'
import { createOffer } from "../../api/recruiter/offers"

interface OfferGeneratorProps {
  requisitionId: string
  applicationId: string
  candidateId: string
  onOfferGenerated: () => void
}

export const OfferGenerator: React.FC<OfferGeneratorProps> = ({ requisitionId, applicationId, candidateId, onOfferGenerated }) => {
  const [title, setTitle] = useState('')
  const [amount, setAmount] = useState('')
  const [startDate, setStartDate] = useState('')
  const [loading, setLoading] = useState(false)

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await createOffer({
        requisition_id: requisitionId,
        application_id: applicationId,
        candidate_id: candidateId,
        title,
        salary_amount: Number(amount),
        salary_currency: 'INR',
        start_date: new Date(startDate).toISOString()
      })
      setTitle('')
      setAmount('')
      setStartDate('')
      onOfferGenerated()
    } catch (err) {
      console.error('Failed to generate offer', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleGenerate} className="mt-4 p-4 border border-blue-200 dark:border-blue-900 rounded-md bg-blue-50/50 dark:bg-blue-900/10">
      <h4 className="font-semibold text-sm text-blue-900 dark:text-blue-100 mb-3">Generate New Offer</h4>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Job Title</label>
          <input 
            type="text" required
            value={title} onChange={e => setTitle(e.target.value)}
            className="w-full text-sm rounded border-gray-300 dark:border-gray-600 dark:bg-gray-700 p-2"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Salary (INR)</label>
          <input 
            type="number" required min="1"
            value={amount} onChange={e => setAmount(e.target.value)}
            className="w-full text-sm rounded border-gray-300 dark:border-gray-600 dark:bg-gray-700 p-2"
          />
        </div>
        <div className="col-span-2">
          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Start Date</label>
          <input 
            type="date" required
            value={startDate} onChange={e => setStartDate(e.target.value)}
            className="w-full text-sm rounded border-gray-300 dark:border-gray-600 dark:bg-gray-700 p-2"
          />
        </div>
      </div>
      <button 
        type="submit" 
        disabled={loading}
        className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm font-medium transition-colors disabled:opacity-50"
      >
        {loading ? 'Generating...' : 'Generate Offer Letter'}
      </button>
    </form>
  )
}
