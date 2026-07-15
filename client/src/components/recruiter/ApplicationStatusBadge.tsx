import React from 'react'

interface ApplicationStatusBadgeProps {
  status: string
}

const ApplicationStatusBadge: React.FC<ApplicationStatusBadgeProps> = ({ status }) => {
  const colorMap: Record<string, string> = {
    // Dark UI variants (avoid light bg + dark text combo that reduces contrast)
    submitted: 'bg-blue-500/15 text-sky-200 border border-sky-500/30',
    under_review: 'bg-yellow-500/15 text-yellow-200 border border-yellow-500/30',
    shortlisted: 'bg-emerald-500/15 text-emerald-200 border border-emerald-500/30',
    rejected: 'bg-rose-500/15 text-rose-200 border border-rose-500/30',
    hired: 'bg-indigo-500/15 text-indigo-200 border border-indigo-500/30'
  }


  const labelMap: Record<string, string> = {
    submitted: 'Submitted',
    under_review: 'Under Review',
    shortlisted: 'Shortlisted',
    rejected: 'Rejected',
    hired: 'Hired'
  }

  const colorClass = colorMap[status] || 'bg-gray-100 text-gray-800'
  const label = labelMap[status] || status

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium inline-flex items-center gap-1 ${colorClass}`}>
      {label}
    </span>
  )
}

export default ApplicationStatusBadge
