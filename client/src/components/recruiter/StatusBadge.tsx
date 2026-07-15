interface StatusConfig {
  label: string
  bg: string
  color: string
  border: string
}

const STATUS_MAP: Record<string, StatusConfig> = {
  draft: { label: 'Draft', bg: 'rgba(148,163,184,0.12)', color: 'rgba(226,232,240,0.95)', border: 'rgba(148,163,184,0.25)' },
  submitted: { label: 'Submitted', bg: 'rgba(99,102,241,0.10)', color: 'rgba(165,180,252,0.95)', border: 'rgba(99,102,241,0.25)' },
  under_review: { label: 'Under Review', bg: 'rgba(168,85,247,0.10)', color: 'rgba(192,132,252,0.95)', border: 'rgba(168,85,247,0.25)' },
  needs_changes: { label: 'Needs Changes', bg: 'rgba(245,158,11,0.10)', color: 'rgba(253,230,138,0.95)', border: 'rgba(245,158,11,0.25)' },
  approved: { label: 'Approved', bg: 'rgba(16,185,129,0.10)', color: 'rgba(110,231,183,0.95)', border: 'rgba(16,185,129,0.25)' },
  rejected: { label: 'Rejected', bg: 'rgba(239,68,68,0.10)', color: 'rgba(248,113,113,0.95)', border: 'rgba(239,68,68,0.25)' },
  published: { label: 'Published', bg: 'rgba(34,197,94,0.10)', color: 'rgba(134,239,172,0.95)', border: 'rgba(34,197,94,0.25)' }
}

interface StatusBadgeProps {
  status: string
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const config = STATUS_MAP[status] || STATUS_MAP.draft


  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.3rem',
        background: config.bg,
        color: config.color,
        border: `1px solid ${config.border}`,
        borderRadius: '20px',
        padding: '0.2rem 0.65rem',
        fontSize: '0.75rem',
        fontWeight: 700,
        letterSpacing: '0.04em',
        textTransform: 'uppercase',
        whiteSpace: 'nowrap'
      }}
    >
      <span
        style={{
          width: 6, height: 6,
          borderRadius: '50%',
          background: config.color,
          display: 'inline-block',
          flexShrink: 0
        }}
      />
      {config.label}
    </span>
  )
}
