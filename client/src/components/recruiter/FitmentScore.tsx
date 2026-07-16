interface FitmentScoreProps {
  score?: string | number | null
  status?: 'pending' | 'processing' | 'completed' | 'failed' | string | null
  compact?: boolean
}

export default function FitmentScore({ score, status, compact = false }: FitmentScoreProps) {
  const numericScore = score === null || score === undefined || score === '' ? null : Number(score)
  const hasScore = numericScore !== null && Number.isFinite(numericScore)

  if (status === 'completed' && hasScore) {
    return (
      <span className={compact
        ? "inline-flex rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-800"
        : "inline-flex rounded-lg bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-800"}
      >
        {numericScore.toFixed(0)}% fit
      </span>
    )
  }

  if (status === 'failed') {
    return <span className="inline-flex rounded-full bg-rose-100 px-2.5 py-1 text-xs font-medium text-rose-700">Evaluation failed</span>
  }

  return (
    <span className="inline-flex rounded-full bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-800">
      {status === 'processing' ? 'Calculating fitment…' : 'Fitment queued'}
    </span>
  )
}