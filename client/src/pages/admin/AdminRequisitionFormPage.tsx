import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { createRequisition, updateRequisition, getRequisition } from "../../api/recruiter/requisitions"

const JOB_TITLES = [
  'Software Engineer',
  'Senior Software Engineer',
  'Product Manager',
  'Data Scientist',
  'DevOps Engineer',
  'UX Designer',
  'QA Engineer',
  'Technical Writer',
  'Engineering Manager',
  'Chief Technology Officer'
]

const DEPARTMENTS = [
  'Engineering',
  'Product',
  'Design',
  'Marketing',
  'Sales',
  'Customer Success',
  'Human Resources',
  'Finance',
  'Operations'
]

const TEAMS = [
  'Platform',
  'Infrastructure',
  'Frontend',
  'Backend',
  'Mobile',
  'Data',
  'Security',
  'AI/ML'
]

const LOCATIONS = [
  'San Francisco, CA',
  'New York, NY',
  'Remote',
  'London, UK',
  'Berlin, Germany',
  'Singapore',
  'Toronto, Canada'
]

const EMPLOYMENT_TYPES = [
  'Full-time',
  'Part-time',
  'Contract',
  'Internship'
]

const WORK_MODES = [
  'On-site',
  'Remote',
  'Hybrid'
]

const PRIORITIES = [
  'Low',
  'Medium',
  'High'
]

interface User {
  id: string
  email: string
  full_name?: string
  role: string
}

interface AdminRequisitionFormPageProps {
  user: User
  mode: 'create' | 'edit'
}

export default function AdminRequisitionFormPage({ user, mode }: AdminRequisitionFormPageProps) {
  const { id } = useParams()
  const navigate = useNavigate()
  
  const [formData, setFormData] = useState({
    title: '',
    department: '',
    team: '',
    location: '',
    employment_type: '',
    work_mode: '',
    number_of_openings: 1,
    hiring_priority: '',
    target_joining_date: '',
    application_deadline: '',
    about_role: '',
    responsibilities: '',
    required_skills: '',
    preferred_skills: '',
    experience_required: '',
    education_requirements: '',
    salary: '',
    benefits: '',
    hiring_manager: user?.full_name || user?.email || ''
  })
  
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    if (mode === 'edit' && id) {
      fetchRequisition()
    }
  }, [mode, id])

  const fetchRequisition = async () => {
    setLoading(true)
    try {
      const data = await getRequisition(id || '')
      setFormData({
        title: data.title || '',
        department: data.department || '',
        team: data.team || '',
        location: data.location || '',
        employment_type: data.employment_type || '',
        work_mode: data.work_mode || '',
        number_of_openings: data.number_of_openings || 1,
        hiring_priority: data.hiring_priority || '',
        target_joining_date: data.target_joining_date ? data.target_joining_date.split('T')[0] : '',
        application_deadline: data.application_deadline ? data.application_deadline.split('T')[0] : '',
        about_role: data.about_role || '',
        responsibilities: data.responsibilities || '',
        required_skills: data.required_skills || '',
        preferred_skills: data.preferred_skills || '',
        experience_required: data.experience_required || '',
        education_requirements: data.education_requirements || '',
        salary: data.salary || '',
        benefits: data.benefits || '',
        hiring_manager: data.hiring_manager || user?.full_name || user?.email || ''
      })
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load requisition')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    
    try {
      const requisitionData = {
        ...formData,
        target_joining_date: formData.target_joining_date ? new Date(formData.target_joining_date).toISOString() : null,
        application_deadline: formData.application_deadline ? new Date(formData.application_deadline).toISOString() : null
      }

      if (mode === 'create') {
        await createRequisition(requisitionData)
      } else {
        await updateRequisition(id || '', requisitionData)
      }
      
      setSuccess(true)
      setTimeout(() => {
        navigate('/admin/requisitions')
      }, 1500)
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to save requisition')
    } finally {
      setSubmitting(false)
    }
  }

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  if (loading) {
    return (
      <div className="admin-page-container">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
          <div style={{ textAlign: 'center' }}>
            <div className="spinner" style={{ margin: '0 auto 1rem' }} />
            <p style={{ color: '#64748b' }}>Loading…</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="admin-page-container">
      <button 
        className="admin-btn-secondary" 
        onClick={() => navigate('/admin/requisitions')} 
        style={{ marginBottom: '1.5rem' }}
      >
        ← Back to Requisitions
      </button>

      <div className="admin-form-container">
        <div className="admin-form-header">
          <h1 className="admin-form-title">
            {mode === 'create' ? 'Create New Requisition' : 'Edit Requisition'}
          </h1>
          <p className="admin-form-subtitle">
            {mode === 'create' 
              ? 'Fill in the details below to create a new job requisition.' 
              : 'Update the requisition details below.'}
          </p>
        </div>

        {success && (
          <div className="admin-alert admin-alert-success">
            Requisition {mode === 'create' ? 'created' : 'updated'} successfully! Redirecting…
          </div>
        )}

        {error && (
          <div className="admin-alert admin-alert-error">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Basic Information */}
          <div className="admin-form-section">
            <h2 className="admin-section-title">Basic Information</h2>
            <div className="admin-form-grid">
              <div className="admin-form-group admin-form-full">
                <label className="admin-form-label">
                  Job Title <span className="admin-form-label-required">*</span>
                </label>
                <select
                  className="admin-form-select"
                  value={formData.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                  required
                >
                  <option value="">Select job title…</option>
                  {JOB_TITLES.map(title => (
                    <option key={title} value={title}>{title}</option>
                  ))}
                </select>
              </div>

              <div className="admin-form-group">
                <label className="admin-form-label">
                  Department <span className="admin-form-label-required">*</span>
                </label>
                <select
                  className="admin-form-select"
                  value={formData.department}
                  onChange={(e) => handleChange('department', e.target.value)}
                  required
                >
                  <option value="">Select department…</option>
                  {DEPARTMENTS.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>

              <div className="admin-form-group">
                <label className="admin-form-label">
                  Team
                </label>
                <select
                  className="admin-form-select"
                  value={formData.team}
                  onChange={(e) => handleChange('team', e.target.value)}
                >
                  <option value="">Select team…</option>
                  {TEAMS.map(team => (
                    <option key={team} value={team}>{team}</option>
                  ))}
                </select>
              </div>

              <div className="admin-form-group">
                <label className="admin-form-label">
                  Location <span className="admin-form-label-required">*</span>
                </label>
                <select
                  className="admin-form-select"
                  value={formData.location}
                  onChange={(e) => handleChange('location', e.target.value)}
                  required
                >
                  <option value="">Select location…</option>
                  {LOCATIONS.map(loc => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
              </div>

              <div className="admin-form-group">
                <label className="admin-form-label">
                  Employment Type <span className="admin-form-label-required">*</span>
                </label>
                <select
                  className="admin-form-select"
                  value={formData.employment_type}
                  onChange={(e) => handleChange('employment_type', e.target.value)}
                  required
                >
                  <option value="">Select type…</option>
                  {EMPLOYMENT_TYPES.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div className="admin-form-group">
                <label className="admin-form-label">
                  Work Mode <span className="admin-form-label-required">*</span>
                </label>
                <select
                  className="admin-form-select"
                  value={formData.work_mode}
                  onChange={(e) => handleChange('work_mode', e.target.value)}
                  required
                >
                  <option value="">Select mode…</option>
                  {WORK_MODES.map(mode => (
                    <option key={mode} value={mode}>{mode}</option>
                  ))}
                </select>
              </div>

              <div className="admin-form-group">
                <label className="admin-form-label">
                  Number of Openings <span className="admin-form-label-required">*</span>
                </label>
                <input
                  type="number"
                  className="admin-form-input"
                  value={formData.number_of_openings}
                  onChange={(e) => handleChange('number_of_openings', parseInt(e.target.value))}
                  min="1"
                  required
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-form-label">
                  Hiring Priority <span className="admin-form-label-required">*</span>
                </label>
                <select
                  className="admin-form-select"
                  value={formData.hiring_priority}
                  onChange={(e) => handleChange('hiring_priority', e.target.value)}
                  required
                >
                  <option value="">Select priority…</option>
                  {PRIORITIES.map(priority => (
                    <option key={priority} value={priority.toLowerCase()}>{priority}</option>
                  ))}
                </select>
              </div>

              <div className="admin-form-group">
                <label className="admin-form-label">
                  Target Joining Date
                </label>
                <input
                  type="date"
                  className="admin-form-input"
                  value={formData.target_joining_date}
                  onChange={(e) => handleChange('target_joining_date', e.target.value)}
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-form-label">
                  Application Deadline
                </label>
                <input
                  type="date"
                  className="admin-form-input"
                  value={formData.application_deadline}
                  onChange={(e) => handleChange('application_deadline', e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Role Details */}
          <div className="admin-form-section">
            <h2 className="admin-section-title">Role Details</h2>
            <div className="admin-form-grid">
              <div className="admin-form-group admin-form-full">
                <label className="admin-form-label">
                  About the Role
                </label>
                <textarea
                  className="admin-form-input admin-form-textarea"
                  value={formData.about_role}
                  onChange={(e) => handleChange('about_role', e.target.value)}
                  placeholder="Describe the role and its importance to the organization…"
                />
              </div>

              <div className="admin-form-group admin-form-full">
                <label className="admin-form-label">
                  Responsibilities
                </label>
                <textarea
                  className="admin-form-input admin-form-textarea"
                  value={formData.responsibilities}
                  onChange={(e) => handleChange('responsibilities', e.target.value)}
                  placeholder="List the key responsibilities for this role…"
                />
              </div>

              <div className="admin-form-group admin-form-full">
                <label className="admin-form-label">
                  Required Skills
                </label>
                <textarea
                  className="admin-form-input admin-form-textarea"
                  value={formData.required_skills}
                  onChange={(e) => handleChange('required_skills', e.target.value)}
                  placeholder="List the required technical and soft skills…"
                />
              </div>

              <div className="admin-form-group admin-form-full">
                <label className="admin-form-label">
                  Preferred Skills
                </label>
                <textarea
                  className="admin-form-input admin-form-textarea"
                  value={formData.preferred_skills}
                  onChange={(e) => handleChange('preferred_skills', e.target.value)}
                  placeholder="List any preferred but not required skills…"
                />
              </div>
            </div>
          </div>

          {/* Requirements */}
          <div className="admin-form-section">
            <h2 className="admin-section-title">Requirements & Compensation</h2>
            <div className="admin-form-grid">
              <div className="admin-form-group">
                <label className="admin-form-label">
                  Experience Required
                </label>
                <input
                  type="text"
                  className="admin-form-input"
                  value={formData.experience_required}
                  onChange={(e) => handleChange('experience_required', e.target.value)}
                  placeholder="e.g., 3-5 years"
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-form-label">
                  Education Requirements
                </label>
                <input
                  type="text"
                  className="admin-form-input"
                  value={formData.education_requirements}
                  onChange={(e) => handleChange('education_requirements', e.target.value)}
                  placeholder="e.g., Bachelor's degree in Computer Science"
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-form-label">
                  Salary Range
                </label>
                <input
                  type="text"
                  className="admin-form-input"
                  value={formData.salary}
                  onChange={(e) => handleChange('salary', e.target.value)}
                  placeholder="e.g., $100,000 - $150,000"
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-form-label">
                  Benefits
                </label>
                <input
                  type="text"
                  className="admin-form-input"
                  value={formData.benefits}
                  onChange={(e) => handleChange('benefits', e.target.value)}
                  placeholder="e.g., Health insurance, 401k, Remote work"
                />
              </div>

              <div className="admin-form-group admin-form-full">
                <label className="admin-form-label">
                  Hiring Manager <span className="admin-form-label-required">*</span>
                </label>
                <input
                  type="text"
                  className="admin-form-input"
                  value={formData.hiring_manager}
                  onChange={(e) => handleChange('hiring_manager', e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="admin-form-actions">
            <button
              type="button"
              className="admin-btn-secondary"
              onClick={() => navigate('/admin/requisitions')}
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="admin-btn-primary"
              disabled={submitting}
            >
              {submitting ? 'Saving…' : mode === 'create' ? 'Create Requisition' : 'Update Requisition'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
