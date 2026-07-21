import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getPipeline, moveEntry, updateNotes } from "../../api/recruiter/pipeline"
import { getRequisition } from "../../api/recruiter/requisitions"

export const PipelineBoard: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const [board, setBoard] = useState<any[]>([])
  const [requisition, setRequisition] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const fetchPipeline = async () => {
    if (!id) return
    try {
      const [pipeData, reqData] = await Promise.all([
        getPipeline(id),
        getRequisition(id)
      ])
      setBoard(pipeData.board)
      setRequisition(reqData)
    } catch (err) {
      console.error('Failed to fetch pipeline', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPipeline()
  }, [id])

  if (loading) return <div className="p-8">Loading pipeline...</div>
  if (!requisition) return <div className="p-8">Requisition not found.</div>

  return (
    <div className="p-4 sm:p-6 lg:p-8 min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
          Pipeline: {requisition.title}
        </h1>
        <p className="text-sm text-gray-500 mt-1">{requisition.memo_no}</p>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row overflow-x-auto lg:overflow-visible gap-4 lg:gap-6 pb-4">
        {board.map((stage) => (
          <div key={stage.id} className="w-full lg:w-80 flex-shrink-0 flex flex-col bg-gray-100 dark:bg-gray-800 rounded-lg max-h-full">
            <div className="p-3 sm:p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center bg-white dark:bg-gray-800 rounded-t-lg">
              <h3 className="font-semibold text-gray-700 dark:text-gray-200 text-sm sm:text-base">{stage.name}</h3>
              <span className="text-xs bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded-full text-gray-600 dark:text-gray-300">
                {stage.entries.length}
              </span>
            </div>
            
            <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-2 sm:space-y-3">
              {stage.entries.map((entry: any) => (
                <div key={entry.id} className="bg-white dark:bg-gray-700 p-3 sm:p-4 rounded-md shadow-sm border border-gray-200 dark:border-gray-600">
                  <div className="flex justify-between items-start gap-2">
                    <span className="font-medium text-gray-900 dark:text-white text-sm truncate">
                      Candidate #{entry.candidate_id.substring(0, 8)}
                    </span>
                    {entry.ai_score && (
                      <span className="text-xs font-mono bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded flex-shrink-0">
                        AI: {entry.ai_score}
                      </span>
                    )}
                  </div>
                  
                  <div className="mt-3 flex gap-2">
                    <Link
                      to={`/recruiter/requisitions/${id}/pipeline/candidate/${entry.candidate_id}?applicationId=${entry.application_id}&entryId=${entry.id}`}
                      className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline"
                    >
                      View Profile & Actions
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
