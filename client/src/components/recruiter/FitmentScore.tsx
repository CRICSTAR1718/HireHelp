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
      <span className="hh-ai-badge text-xs">
        <span className="hh-ai-dot"></span>
        {numericScore.toFixed(0)}% fit
      </span>
    )
  }

  if (status === 'failed') {
    return <span className="inline-flex rounded-full bg-rose-100 px-2.5 py-1 text-xs font-medium text-rose-700">Evaluation failed</span>
  }

  if (status === 'processing') {
    return (
      <div className="hh-ai-badge">
        <div className="hh-ai-dot" />
        Calculating fitment…
      </div>
    )
  }

  return (
    <span className="inline-flex rounded-full bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-800">
      Fitment queued
    </span>
  )
}