import React from 'react'

interface ApplicationStatusBadgeProps {
  status: string
}

const ApplicationStatusBadge: React.FC<ApplicationStatusBadgeProps> = ({ status }) => {
  const colorMap: Record<string, string> = {
    submitted: 'bg-[var(--hh-info-soft)] text-[var(--hh-info)] border border-[var(--hh-info)]/30',
    under_review: 'bg-[var(--hh-warning-soft)] text-[var(--hh-warning)] border border-[var(--hh-warning)]/30',
    shortlisted: 'bg-[var(--hh-success-soft)] text-[var(--hh-success)] border border-[var(--hh-success)]/30',
    rejected: 'bg-[var(--hh-danger-soft)] text-[var(--hh-danger)] border border-[var(--hh-danger)]/30',
    hired: 'bg-[var(--hh-info-soft)] text-[var(--hh-info)] border border-[var(--hh-info)]/30'
  }


  const labelMap: Record<string, string> = {
    submitted: 'Submitted',
    under_review: 'Under Review',
    shortlisted: 'Shortlisted',
    rejected: 'Rejected',
    hired: 'Hired'
  }

  const colorClass = colorMap[status] || 'bg-[var(--hh-surface-hover)] text-[var(--hh-text-muted)]'
  const label = labelMap[status] || status

  return (
    <span 
      className={`px-3 py-1 text-xs font-medium inline-flex items-center gap-1 ${colorClass}`}
      style={{ borderRadius: 'var(--hh-radius-pill)' }}
    >
      {label}
    </span>
  )
}

export default ApplicationStatusBadge
