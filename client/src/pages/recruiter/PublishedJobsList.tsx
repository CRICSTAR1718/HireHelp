import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getPublishedJobs, type Job } from "../../api/recruiter/jobs"

export const PublishedJobsList: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const data = await getPublishedJobs()
        setJobs(data)
      } catch (err) {
        console.error('Failed to load published jobs', err)
      } finally {
        setLoading(false)
      }
    }
    fetchJobs()
  }, [])

  if (loading) return <div className="p-8">Loading jobs...</div>

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Published Jobs</h1>
      
      {jobs.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 p-8 text-center rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <p className="text-gray-500">No jobs are currently published.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map(job => (
            <div key={job.id} className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow flex flex-col">
              <div className="mb-4">
                <span className="text-xs font-mono text-gray-500 mb-1 block">{job.memo_no}</span>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{job.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{job.department} • {job.location}</p>
              </div>
              
              <div className="flex-1 space-y-2 text-sm text-gray-600 dark:text-gray-300">
                <p><strong>Type:</strong> {job.employment_type} • {job.work_mode}</p>
                <p><strong>Openings:</strong> {job.number_of_openings}</p>
                <p><strong>Hiring Manager:</strong> {job.hiring_manager}</p>
              </div>
              
              <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center text-xs text-gray-500">
                <span>Published: {job.published_at ? new Date(job.published_at).toLocaleDateString() : 'N/A'}</span>
                {job.application_deadline && (
                  <span className="text-red-500">Deadline: {new Date(job.application_deadline).toLocaleDateString()}</span>
                )}
              </div>

              <button
                onClick={() => navigate(`/recruiter/published-jobs/${job.id}/applications`)}
                className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors"
              >
                View Applications
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
