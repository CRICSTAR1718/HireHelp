interface StatusConfig {
  label: string
  bg: string
  color: string
  border: string
}

const STATUS_MAP: Record<string, StatusConfig> = {
  draft: { label: 'Draft', bg: 'var(--hh-surface-hover)', color: 'var(--hh-text-muted)', border: 'var(--hh-border)' },
  submitted: { label: 'Submitted', bg: 'var(--hh-info-soft)', color: 'var(--hh-info)', border: 'var(--hh-info)' },
  under_review: { label: 'Under Review', bg: 'var(--hh-warning-soft)', color: 'var(--hh-warning)', border: 'var(--hh-warning)' },
  needs_changes: { label: 'Needs Changes', bg: 'var(--hh-warning-soft)', color: 'var(--hh-warning)', border: 'var(--hh-warning)' },
  approved: { label: 'Approved', bg: 'var(--hh-success-soft)', color: 'var(--hh-success)', border: 'var(--hh-success)' },
  rejected: { label: 'Rejected', bg: 'var(--hh-danger-soft)', color: 'var(--hh-danger)', border: 'var(--hh-danger)' },
  published: { label: 'Published', bg: 'var(--hh-success-soft)', color: 'var(--hh-success)', border: 'var(--hh-success)' }
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
        borderRadius: 'var(--hh-radius-pill)',
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
