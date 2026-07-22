import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { createRequisition, updateRequisition, getRequisition } from "../../api/recruiter/requisitions"
import { createForm } from "../../api/recruiter/forms"
import { toUserMessage } from "../../utils/toUserMessage"

const DEPARTMENTS = [
  'Engineering', 'Product', 'Design', 'Marketing', 'Sales',
  'HR', 'Finance', 'Operations', 'Legal', 'Support', 'Other'
]

const JOB_TITLES = [
  'Software Engineer',
  'Senior Software Engineer',
  'Lead Software Engineer',
  'Engineering Manager',
  'Product Manager',
  'Senior Product Manager',
  'UX Designer',
  'UI Designer',
  'Product Designer',
  'Data Analyst',
  'Data Scientist',
  'DevOps Engineer',
  'QA Engineer',
  'Technical Writer',
  'Project Manager',
  'Business Analyst',
  'Marketing Manager',
  'Sales Representative',
  'Account Executive',
  'Customer Success Manager',
  'HR Manager',
  'Recruiter',
  'Finance Manager',
  'Operations Manager',
  'Legal Counsel',
  'Support Engineer',
  'Other'
]

const TEAMS = [
  'Backend',
  'Frontend',
  'Full Stack',
  'Mobile',
  'DevOps',
  'QA/Testing',
  'Data Engineering',
  'Machine Learning',
  'Security',
  'Infrastructure',
  'Product',
  'Design',
  'Marketing',
  'Sales',
  'Customer Success',
  'HR',
  'Finance',
  'Operations',
  'Legal',
  'Support',
  'Other'
]

const EMPLOYMENT_TYPES = ['Full-time', 'Part-time', 'Contract', 'Internship', 'Freelance']
const WORK_MODES = ['On-site', 'Remote', 'Hybrid']
const PRIORITIES = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'critical', label: 'Critical' }
] as const

const normalizeHiringPriority = (value: string | null | undefined) => {
  const normalized = value?.trim().toLowerCase()
  if (normalized === 'critical' || normalized === 'high' || normalized === 'medium' || normalized === 'low') {
    return normalized
  }
  return ''
}

interface User {
  id: string
  email: string
  full_name?: string
  role: string
}

interface AdminRequisitionFormPageProps {
  mode?: 'create' | 'edit'
  user: User
}

export default function AdminRequisitionFormPage({ mode = 'create', user }: AdminRequisitionFormPageProps) {
  const { id } = useParams()
  const navigate = useNavigate()
  const isAdmin = user?.role === 'admin'

  const [formData, setFormData] = useState({
    title: '',
    department: '',
    team: '',
    location: '',
    employment_type: '',
    work_mode: '',
    number_of_openings: 1,
    about_role: '',
    responsibilities: '',
    required_skills: '',
    preferred_skills: '',
    experience_required: '',
    education_requirements: '',
    salary: '',
    benefits: '',
    hiring_priority: '',
    target_joining_date: '',
    application_deadline: '',
    internal_application_form: true,
    job_description_document: '',
    additional_documents: ''
  })

  const [customTitle, setCustomTitle] = useState(false)
  const [customTeam, setCustomTeam] = useState(false)

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [loadingData, setLoadingData] = useState(mode === 'edit')
  const [apiError, setApiError] = useState('')

  useEffect(() => {
    if (mode === 'edit' && id) {
      setLoadingData(true)
      getRequisition(id)
        .then(data => {
          setFormData({
            title: data.title || '',
            department: data.department || '',
            team: data.team || '',
            location: data.location || '',
            employment_type: data.employment_type || '',
            work_mode: data.work_mode || '',
            number_of_openings: data.number_of_openings || 1,
            about_role: data.about_role || '',
            responsibilities: data.responsibilities || '',
            required_skills: data.required_skills || '',
            preferred_skills: data.preferred_skills || '',
            experience_required: data.experience_required || '',
            education_requirements: data.education_requirements || '',
            salary: data.salary || '',
            benefits: data.benefits || '',
            hiring_priority: normalizeHiringPriority(data.hiring_priority || ''),
            target_joining_date: data.target_joining_date ? data.target_joining_date.split('T')[0] : '',
            application_deadline: data.application_deadline ? data.application_deadline.split('T')[0] : '',
            internal_application_form: data.internal_application_form !== undefined ? data.internal_application_form : true,
            job_description_document: data.job_description_document || '',
            additional_documents: data.additional_documents || ''
          })
        })
        .catch(() => setApiError('Failed to load requisition'))
        .finally(() => setLoadingData(false))
    }
  }, [mode, id])

  const handleChange = (field: string, value: any) => {
    const normalizedValue = field === 'hiring_priority' ? normalizeHiringPriority(value) : value
    setFormData(prev => ({ ...prev, [field]: normalizedValue }))
  }

  const validate = () => {
    const errs: Record<string, string> = {}
    if (!formData.title.trim()) errs.title = 'Job Title is required'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async () => {
    if (!validate()) return
    setLoading(true)
    setApiError('')
    try {
      const payload = {
        ...formData,
        hiring_priority: normalizeHiringPriority(formData.hiring_priority)
      }

      if (mode === 'create') {
        const req = await createRequisition(payload)
        // Auto-create form and redirect to form builder (same flow as JR portal)
        await createForm(req.id)
        navigate(`/admin/requisitions/${req.id}/form/builder`)
      } else {
        await updateRequisition(id || '', payload)
        navigate(`/admin/requisitions/${id}`)
      }
    } catch (err: unknown) {
      setApiError(toUserMessage(err, 'Operation failed'))
    } finally {
      setLoading(false)
    }
  }

  if (loadingData) {
    return (
      <div className="admin-page-container">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="spinner" />
        </div>
      </div>
    )
  }

  return (
    <div className="admin-page-container">
      <button 
        className="admin-btn-secondary" 
        onClick={() => navigate(mode === 'create' ? '/admin/requisitions' : `/admin/requisitions/${id}`)} 
        style={{ marginBottom: '1.5rem' }}
      >
        ← Back
      </button>

      <div className="admin-form-container">
        <div className="admin-form-header">
          <h1 className="admin-form-title">
            {mode === 'create' ? 'New Job Requisition' : 'Edit Requisition'}
          </h1>
          <p className="admin-form-subtitle">
            {mode === 'create' ? 'Fill in the details to create a new requisition.' : 'Update the requisition details.'}
          </p>
        </div>

        {apiError && <div className="admin-alert admin-alert-error" style={{ marginBottom: '1.25rem' }}>{apiError}</div>}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* Basic Information */}
          <section>
            <h2 className="admin-section-title" style={{ marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border)' }}>
              Basic Information
            </h2>
            <div className="admin-form-grid">
              <div className="admin-form-group admin-form-full">
                <label className="admin-form-label" htmlFor="req-title">Job Title *</label>
                {!customTitle ? (
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <select
                      id="req-title"
                      className={`admin-form-select${errors.title ? ' border-red-500' : ''}`}
                      value={formData.title}
                      onChange={e => {
                        if (e.target.value === 'custom') {
                          setCustomTitle(true)
                          handleChange('title', '')
                        } else {
                          handleChange('title', e.target.value)
                        }
                      }}
                      style={errors.title ? { borderColor: 'var(--danger)', flex: 1 } : { flex: 1 }}
                    >
                      <option value="">Select job title…</option>
                      {JOB_TITLES.map(t => <option key={t} value={t}>{t}</option>)}
                      <option value="custom">Custom / Other…</option>
                    </select>
                  </div>
                ) : (
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <input
                      id="req-title"
                      type="text"
                      className={`admin-form-input${errors.title ? ' border-red-500' : ''}`}
                      placeholder="Enter custom job title"
                      value={formData.title}
                      onChange={e => handleChange('title', e.target.value)}
                      style={errors.title ? { borderColor: 'var(--danger)', flex: 1 } : { flex: 1 }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setCustomTitle(false)
                        handleChange('title', '')
                      }}
                      className="admin-btn-secondary"
                      style={{ padding: '0.5rem 1rem' }}
                    >
                      Use List
                    </button>
                  </div>
                )}
                {errors.title && <p style={{ color: 'var(--danger)', fontSize: '0.8rem', marginTop: '0.25rem' }}>{errors.title}</p>}
              </div>

              <div className="admin-form-group">
                <label className="admin-form-label" htmlFor="req-dept">Department</label>
                <select
                  id="req-dept"
                  className="admin-form-select"
                  value={formData.department}
                  onChange={e => handleChange('department', e.target.value)}
                >
                  <option value="">Select department…</option>
                  {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>

              <div className="admin-form-group">
                <label className="admin-form-label" htmlFor="req-team">Team</label>
                {!customTeam ? (
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <select
                      id="req-team"
                      className="admin-form-select"
                      value={formData.team}
                      onChange={e => {
                        if (e.target.value === 'custom') {
                          setCustomTeam(true)
                          handleChange('team', '')
                        } else {
                          handleChange('team', e.target.value)
                        }
                      }}
                      style={{ flex: 1 }}
                    >
                      <option value="">Select team…</option>
                      {TEAMS.map(t => <option key={t} value={t}>{t}</option>)}
                      <option value="custom">Custom / Other…</option>
                    </select>
                  </div>
                ) : (
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <input
                      id="req-team"
                      type="text"
                      className="admin-form-input"
                      placeholder="Enter custom team"
                      value={formData.team}
                      onChange={e => handleChange('team', e.target.value)}
                      style={{ flex: 1 }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setCustomTeam(false)
                        handleChange('team', '')
                      }}
                      className="admin-btn-secondary"
                      style={{ padding: '0.5rem 1rem' }}
                    >
                      Use List
                    </button>
                  </div>
                )}
              </div>

              <div className="admin-form-group">
                <label className="admin-form-label" htmlFor="req-location">Location</label>
                <input
                  id="req-location"
                  type="text"
                  className="admin-form-input"
                  placeholder="e.g. New York, NY"
                  value={formData.location}
                  onChange={e => handleChange('location', e.target.value)}
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-form-label" htmlFor="req-emp-type">Employment Type</label>
                <select
                  id="req-emp-type"
                  className="admin-form-select"
                  value={formData.employment_type}
                  onChange={e => handleChange('employment_type', e.target.value)}
                >
                  <option value="">Select type…</option>
                  {EMPLOYMENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              <div className="admin-form-group">
                <label className="admin-form-label" htmlFor="req-work-mode">Work Mode</label>
                <select
                  id="req-work-mode"
                  className="admin-form-select"
                  value={formData.work_mode}
                  onChange={e => handleChange('work_mode', e.target.value)}
                >
                  <option value="">Select mode…</option>
                  {WORK_MODES.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>

              <div className="admin-form-group">
                <label className="admin-form-label" htmlFor="req-openings">Number of Openings</label>
                <input
                  id="req-openings"
                  type="number"
                  className="admin-form-input"
                  min="1"
                  value={formData.number_of_openings}
                  onChange={e => handleChange('number_of_openings', parseInt(e.target.value) || 1)}
                />
              </div>
            </div>
          </section>

          {/* Job Description */}
          <section>
            <h2 className="admin-section-title" style={{ marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border)' }}>
              Job Description
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div className="admin-form-group admin-form-full">
                <label className="admin-form-label" htmlFor="req-about">About the Role</label>
                <textarea
                  id="req-about"
                  className="admin-form-input admin-form-textarea"
                  placeholder="Describe the role and its impact…"
                  value={formData.about_role}
                  onChange={e => handleChange('about_role', e.target.value)}
                  rows={4}
                  style={{ resize: 'vertical' }}
                />
              </div>

              <div className="admin-form-group admin-form-full">
                <label className="admin-form-label" htmlFor="req-resp">Responsibilities</label>
                <textarea
                  id="req-resp"
                  className="admin-form-input admin-form-textarea"
                  placeholder="List key responsibilities…"
                  value={formData.responsibilities}
                  onChange={e => handleChange('responsibilities', e.target.value)}
                  rows={4}
                  style={{ resize: 'vertical' }}
                />
              </div>

              <div className="admin-form-group admin-form-full">
                <label className="admin-form-label" htmlFor="req-req-skills">Required Skills</label>
                <textarea
                  id="req-req-skills"
                  className="admin-form-input admin-form-textarea"
                  placeholder="List required technical and soft skills…"
                  value={formData.required_skills}
                  onChange={e => handleChange('required_skills', e.target.value)}
                  rows={3}
                  style={{ resize: 'vertical' }}
                />
              </div>

              <div className="admin-form-group admin-form-full">
                <label className="admin-form-label" htmlFor="req-pref-skills">Preferred Skills</label>
                <textarea
                  id="req-pref-skills"
                  className="admin-form-input admin-form-textarea"
                  placeholder="List preferred but not required skills…"
                  value={formData.preferred_skills}
                  onChange={e => handleChange('preferred_skills', e.target.value)}
                  rows={3}
                  style={{ resize: 'vertical' }}
                />
              </div>

              <div className="admin-form-grid">
                <div className="admin-form-group">
                  <label className="admin-form-label" htmlFor="req-exp">Experience Required</label>
                  <input
                    id="req-exp"
                    type="text"
                    className="admin-form-input"
                    placeholder="e.g. 3-5 years"
                    value={formData.experience_required}
                    onChange={e => handleChange('experience_required', e.target.value)}
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-form-label" htmlFor="req-edu">Education Requirements</label>
                  <input
                    id="req-edu"
                    type="text"
                    className="admin-form-input"
                    placeholder="e.g. Bachelor's in Computer Science"
                    value={formData.education_requirements}
                    onChange={e => handleChange('education_requirements', e.target.value)}
                  />
                </div>
              </div>

              <div className="admin-form-grid">
                <div className="admin-form-group">
                  <label className="admin-form-label" htmlFor="req-salary">Salary (Optional)</label>
                  <input
                    id="req-salary"
                    type="text"
                    className="admin-form-input"
                    placeholder="e.g. $80,000 - $120,000"
                    value={formData.salary}
                    onChange={e => handleChange('salary', e.target.value)}
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-form-label" htmlFor="req-benefits">Benefits (Optional)</label>
                  <input
                    id="req-benefits"
                    type="text"
                    className="admin-form-input"
                    placeholder="e.g. Health insurance, 401k"
                    value={formData.benefits}
                    onChange={e => handleChange('benefits', e.target.value)}
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Hiring Information */}
          <section>
            <h2 className="admin-section-title" style={{ marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border)' }}>
              Hiring Information
            </h2>
            <div className="admin-form-grid">
              <div className="admin-form-group">
                <label className="admin-form-label" htmlFor="req-priority">Hiring Priority</label>
                <select
                  id="req-priority"
                  className="admin-form-select"
                  value={formData.hiring_priority}
                  onChange={e => handleChange('hiring_priority', e.target.value)}
                >
                  <option value="">Select priority…</option>
                  {PRIORITIES.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
                </select>
              </div>

              <div className="admin-form-group">
                <label className="admin-form-label" htmlFor="req-join-date">Target Joining Date</label>
                <input
                  id="req-join-date"
                  type="date"
                  className="admin-form-input"
                  value={formData.target_joining_date}
                  onChange={e => handleChange('target_joining_date', e.target.value)}
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-form-label" htmlFor="req-deadline">Application Deadline</label>
                <input
                  id="req-deadline"
                  type="date"
                  className="admin-form-input"
                  value={formData.application_deadline}
                  onChange={e => handleChange('application_deadline', e.target.value)}
                />
              </div>
            </div>
          </section>

          {/* Application Information */}
          <section>
            <h2 className="admin-section-title" style={{ marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border)' }}>
              Application Information
            </h2>
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={formData.internal_application_form}
                  onChange={e => handleChange('internal_application_form', e.target.checked)}
                  style={{ width: 18, height: 18 }}
                />
                <span style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>Use internal application form</span>
              </label>
            </div>
          </section>

          {/* Attachments */}
          <section>
            <h2 className="admin-section-title" style={{ marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border)' }}>
              Attachments
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div className="admin-form-group admin-form-full">
                <label className="admin-form-label" htmlFor="req-jd-doc">Job Description Document URL</label>
                <input
                  id="req-jd-doc"
                  type="text"
                  className="admin-form-input"
                  placeholder="https://..."
                  value={formData.job_description_document}
                  onChange={e => handleChange('job_description_document', e.target.value)}
                />
              </div>

              <div className="admin-form-group admin-form-full">
                <label className="admin-form-label" htmlFor="req-add-docs">Additional Documents (JSON)</label>
                <textarea
                  id="req-add-docs"
                  className="admin-form-input admin-form-textarea"
                  placeholder='[{"name": "Document 1", "url": "https://..."}]'
                  value={formData.additional_documents}
                  onChange={e => handleChange('additional_documents', e.target.value)}
                  rows={3}
                  style={{ resize: 'vertical', fontFamily: 'monospace' }}
                />
              </div>
            </div>
          </section>

          {mode === 'create' && (
            <div style={{
              padding: '0.75rem 1rem',
              background: 'var(--accent-light)',
              borderRadius: 8,
              border: '1px solid rgba(99,102,241,0.2)',
              fontSize: '0.825rem',
              color: 'var(--accent)'
            }}>
              ℹ️ After creating, you'll be redirected to the application form builder. Admin requisitions are <strong>auto-approved</strong>.
            </div>
          )}

          <div className="admin-form-actions">
            <button className="admin-btn-secondary" onClick={() => navigate(mode === 'create' ? '/admin/requisitions' : `/admin/requisitions/${id}`)}>
              Cancel
            </button>
            <button
              className="admin-btn-primary"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner" style={{ width: 14, height: 14, borderWidth: 2 }} />
                  Saving…
                </>
              ) : mode === 'create' ? 'Create Requisition' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
