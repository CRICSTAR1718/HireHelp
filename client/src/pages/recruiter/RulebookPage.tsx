import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { createRulebook } from "../../api/recruiter/rulebooks"

const CRITERION_TYPES = [
  { type: 'skills',      label: 'Skills',       icon: '🛠️' },
  { type: 'experience',  label: 'Experience',   icon: '📅' },
  { type: 'education',   label: 'Education',    icon: '🎓' },
  { type: 'profile_fit', label: 'Profile Fit',  icon: '🎯' }
]

export default function RulebookPage() {
  const { id: reqId } = useParams()
  const navigate = useNavigate()

  const [weights, setWeights] = useState({
    skills: 40,
    experience: 30,
    education: 20,
    profile_fit: 10
  })
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')

  const total = Object.values(weights).reduce((sum, v) => sum + Number(v || 0), 0)
  const isValid = Math.abs(total - 100) < 0.001

  const handleChange = (type: string, value: string) => {
    const num = Math.max(0, Math.min(100, Number(value) || 0))
    setWeights(prev => ({ ...prev, [type]: num }))
  }

  const handleSubmit = async () => {
    if (!isValid) return
    setLoading(true)
    setError('')
    try {
      const criteria = CRITERION_TYPES.map(({ type }) => ({
        criterion_type: type,
        weight_pct: weights[type as keyof typeof weights]
      }))
      await createRulebook(reqId || '', { criteria })
      navigate(`/recruiter/requisitions/${reqId}`)
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to create rulebook')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page-container" style={{ maxWidth: 620 }}>
      <button className="btn-secondary btn-sm" onClick={() => navigate(-1)} style={{ marginBottom: '1.5rem' }}>
        ← Back
      </button>

      <div className="glass-card fade-in" style={{ padding: '2rem' }}>
        <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
          Create Screening Rulebook
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '2rem' }}>
          Assign percentage weights to each criterion. Total must equal exactly 100%.
        </p>

        {error && <div className="alert-error" style={{ marginBottom: '1.25rem' }}>{error}</div>}

        {/* Weight Total Indicator */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '0.75rem 1rem',
            borderRadius: 10,
            marginBottom: '1.5rem',
            background: isValid ? 'rgba(16,185,129,0.08)' : 'rgba(239,68,68,0.08)',
            border: `1px solid ${isValid ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)'}`,
            transition: 'all 0.3s'
          }}
        >
          <span style={{ fontWeight: 600, color: isValid ? '#34d399' : '#f87171', fontSize: '0.875rem' }}>
            {isValid ? '✓ Total is 100% — ready to submit' : `⚠ Total: ${total}% — must equal 100%`}
          </span>
          <span style={{
            fontSize: '1.5rem',
            fontWeight: 800,
            color: isValid ? '#34d399' : '#f87171'
          }}>
            {total}%
          </span>
        </div>

        {/* Criteria Rows */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '2rem' }}>
          {CRITERION_TYPES.map(({ type, label, icon }) => (
            <div key={type}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <label className="label" htmlFor={`weight-${type}`} style={{ margin: 0, textTransform: 'none', fontSize: '0.9rem' }}>
                  {icon} {label}
                </label>
                <span style={{
                  fontWeight: 800,
                  fontSize: '1.1rem',
                  color: 'var(--accent)',
                  minWidth: '3rem',
                  textAlign: 'right'
                }}>
                  {weights[type as keyof typeof weights]}%
                </span>
              </div>

              {/* Weight bar preview */}
              <div className="weight-bar-bg" style={{ marginBottom: '0.5rem' }}>
                <div className="weight-bar" style={{ width: `${weights[type as keyof typeof weights]}%` }} />
              </div>

              <input
                id={`weight-${type}`}
                type="range"
                min="0"
                max="100"
                step="1"
                value={weights[type as keyof typeof weights]}
                onChange={e => handleChange(type, e.target.value)}
                style={{
                  width: '100%',
                  accentColor: 'var(--accent)',
                  cursor: 'pointer'
                }}
              />
            </div>
          ))}
        </div>

        {/* Numeric inputs row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem', marginBottom: '1.5rem' }}>
          {CRITERION_TYPES.map(({ type, label }) => (
            <div key={type}>
              <label className="label" htmlFor={`input-${type}`} style={{ fontSize: '0.7rem' }}>
                {label}
              </label>
              <input
                id={`input-${type}`}
                type="number"
                min="0"
                max="100"
                className="input-field"
                value={weights[type as keyof typeof weights]}
                onChange={e => handleChange(type, e.target.value)}
                style={{ textAlign: 'center' }}
              />
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
          <button className="btn-secondary" onClick={() => navigate(-1)}>
            Cancel
          </button>
          <button
            id="rulebook-submit"
            className="btn-primary"
            onClick={handleSubmit}
            disabled={!isValid || loading}
            title={!isValid ? 'Weights must sum to 100%' : ''}
          >
            {loading ? (
              <>
                <span className="spinner" style={{ width: 14, height: 14, borderWidth: 2 }} />
                Creating…
              </>
            ) : 'Create Rulebook'}
          </button>
        </div>
      </div>
    </div>
  )
}
