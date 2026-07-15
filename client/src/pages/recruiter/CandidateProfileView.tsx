import React, { useState, useEffect } from 'react'
import { useParams, useSearchParams, useNavigate } from 'react-router-dom'
import { getCandidateProfile } from "../../api/recruiter/pipeline"
import { getFeedback } from "../../api/recruiter/pipeline"
import { getOffersForApplication } from "../../api/recruiter/offers"
import { FeedbackForm } from "./FeedbackForm"
import { OfferGenerator } from "./OfferGenerator"
import { ShortlistPanel } from "./ShortlistPanel"

export const CandidateProfileView: React.FC = () => {
  const { id: reqId, candidateId } = useParams<{ id: string; candidateId: string }>()
  const [searchParams] = useSearchParams()
  const applicationId = searchParams.get('applicationId')
  const entryId = searchParams.get('entryId')
  
  const navigate = useNavigate()

  const [profile, setProfile] = useState<any>(null)
  const [feedback, setFeedback] = useState<any>(null)
  const [offers, setOffers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const fetchData = async () => {
    if (!candidateId || !applicationId) return
    try {
      const [profData, fbData, offData] = await Promise.all([
        getCandidateProfile(candidateId),
        getFeedback(applicationId),
        getOffersForApplication(applicationId)
      ])
      setProfile(profData)
      setFeedback(fbData)
      setOffers(offData)
    } catch (err) {
      console.error('Failed to load candidate view', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [candidateId, applicationId])

  if (loading) return <div className="p-8">Loading profile...</div>
  if (!profile) return <div className="p-8 text-red-500">Failed to load profile.</div>

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-6">
      <button onClick={() => navigate(-1)} className="text-sm text-gray-500 hover:text-gray-900 mb-4 inline-flex items-center">
        ← Back to Pipeline
      </button>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Col: Profile Details */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">{profile.full_name}</h2>
            <p className="text-gray-500 dark:text-gray-400 mt-1">{profile.headline}</p>
            
            <div className="mt-4 space-y-2 text-sm text-gray-600 dark:text-gray-300">
              <p><strong>Email:</strong> {profile.email}</p>
              {profile.phone && <p><strong>Phone:</strong> {profile.phone}</p>}
              {profile.location && <p><strong>Location:</strong> {profile.location}</p>}
            </div>
            
            {profile.resume_url && (
              <a 
                href={profile.resume_url} 
                target="_blank" 
                rel="noreferrer"
                className="mt-4 block w-full text-center bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-white py-2 rounded-md transition-colors"
              >
                View Resume
              </a>
            )}
          </div>

          {reqId && entryId && (
            <ShortlistPanel reqId={reqId} entryId={entryId} />
          )}
        </div>

        {/* Right Col: Feedback & Offers */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold mb-4 border-b pb-2">Interview Feedback</h3>
            
            {feedback?.summary && (
              <div className="flex gap-4 mb-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-md text-sm">
                <div><span className="text-gray-500">Avg Rating:</span> <span className="font-bold">{feedback.summary.average_rating}</span></div>
                <div><span className="text-gray-500">Hires:</span> <span className="font-bold text-green-600">{feedback.summary.hires}</span></div>
                <div><span className="text-gray-500">No Hires:</span> <span className="font-bold text-red-600">{feedback.summary.no_hires}</span></div>
              </div>
            )}

            {feedback?.records.length === 0 ? (
              <p className="text-sm text-gray-500 italic">No feedback submitted yet.</p>
            ) : (
              <div className="space-y-3">
                {feedback?.records.map((r: any) => (
                  <div key={r.id} className="p-3 border rounded text-sm bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
                    <div className="flex justify-between font-medium">
                      <span>Round: {r.interview_round}</span>
                      <span className={r.recommendation?.includes('no_hire') ? 'text-red-500' : 'text-green-500'}>
                        {r.recommendation?.toUpperCase().replace('_', ' ')}
                      </span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">Rating: {r.overall_rating}/5</p>
                  </div>
                ))}
              </div>
            )}
            
            {/* Can embed FeedbackForm here to allow recruiters to add notes manually */}
            <div className="mt-6">
               <FeedbackForm applicationId={applicationId!} requisitionId={reqId!} onSubmitted={fetchData} />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold mb-4 border-b pb-2">Offers</h3>
            {offers.length === 0 ? (
              <p className="text-sm text-gray-500 italic mb-4">No offers generated yet.</p>
            ) : (
              <div className="space-y-3 mb-6">
                {offers.map((o) => (
                  <div key={o.id} className="p-3 border rounded text-sm bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-800">
                    <div className="flex justify-between font-medium">
                      <span>{o.title} - {o.salary_currency} {o.salary_amount}</span>
                      <span className="uppercase text-blue-700 dark:text-blue-300">{o.status}</span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">Sent: {new Date(o.created_at).toLocaleDateString()}</p>
                  </div>
                ))}
              </div>
            )}
            
            <OfferGenerator 
              requisitionId={reqId!} 
              applicationId={applicationId!} 
              candidateId={candidateId!} 
              onOfferGenerated={fetchData} 
            />
          </div>
        </div>
      </div>
    </div>
  )
}
