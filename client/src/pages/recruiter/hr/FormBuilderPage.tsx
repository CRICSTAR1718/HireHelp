import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { getForm, createForm, addField, updateField, deleteField, reorderFields, publishForm, getQuestionTemplates, saveQuestionTemplate } from "../../../api/recruiter/forms"
import { getFormApprovalStatus } from "../../../api/recruiter/formApprovals"

interface Field {
  id: string
  label: string
  field_type: string
  is_required: boolean
  placeholder?: string
  helper_text?: string
  max_rating?: number
  options?: Array<{ label: string }>
}

interface SortableItemProps {
  field: Field
  onEdit: (field: Field) => void
  onDelete: (fieldId: string) => void
}

const SortableItem: React.FC<SortableItemProps> = ({ field, onEdit, onDelete }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition
  } = useSortable({ id: field.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="glass-card border border-gray-200/30 p-4 mb-3 shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 flex-1">
          <button
            {...attributes}
            {...listeners}
            className="text-gray-400 hover:text-gray-600 cursor-grab active:cursor-grabbing"
          >
            ⠿
          </button>
          <div className="flex-1">
            <div className="font-medium text-gray-900">{field.label}</div>
            <div className="flex gap-2 mt-1">
              <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded">
                {field.field_type}
              </span>
              {field.is_required && (
                <span className="text-xs px-2 py-0.5 bg-red-100 text-red-600 rounded">
                  Required
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(field)}
            className="text-gray-400 hover:text-indigo-600 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            onClick={() => onDelete(field.id)}
            className="text-gray-400 hover:text-red-600 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

const FormBuilderPage: React.FC = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [form, setForm] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [editingField, setEditingField] = useState<Field | null>(null)
  const [approvalStatus, setApprovalStatus] = useState<any>(null)
  const [formData, setFormData] = useState({
    label: '',
    field_type: 'text',
    is_required: false,
    placeholder: '',
    helper_text: '',
    max_rating: 5,
    options: [{ label: '' }]
  })
  const [message, setMessage] = useState('')
  const [templates, setTemplates] = useState<any[]>([])
  const [templateCategory, setTemplateCategory] = useState('all')
  const [showTemplates, setShowTemplates] = useState(false)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  )

  useEffect(() => {
    fetchForm()
  }, [id])

  useEffect(() => {
    if (form) {
      fetchApprovalStatus()
    }
  }, [form])

  useEffect(() => {
    if (showTemplates) {
      fetchTemplates()
    }
  }, [showTemplates, templateCategory])

  const fetchForm = async () => {
    try {
      const data = await getForm(id || '')
      setForm(data)
    } catch (err: any) {
      console.error('Failed to fetch form:', err)
      if (err.message.includes('404')) {
        // Form doesn't exist, show create button
        setForm(null)
      }
    } finally {
      setLoading(false)
    }
  }

  const fetchApprovalStatus = async () => {
    try {
      const status = await getFormApprovalStatus(form.id)
      setApprovalStatus(status)
    } catch (err) {
      console.error('Failed to fetch approval status:', err)
    }
  }

  const fetchTemplates = async () => {
    try {
      const data = await getQuestionTemplates(templateCategory)
      setTemplates(data)
    } catch (err) {
      console.error('Failed to fetch templates:', err)
    }
  }

  const handleSelectTemplate = (template: any) => {
    setFormData({
      label: template.label,
      field_type: template.field_type,
      is_required: template.is_required,
      placeholder: template.placeholder || '',
      helper_text: template.helper_text || '',
      max_rating: template.max_rating || 5,
      options: template.options?.length > 0 ? template.options.map((opt: any) => ({ label: opt.label })) : [{ label: '' }]
    })
    setShowTemplates(false)
  }

  const handleCreateForm = async () => {
    try {
      const newForm = await createForm(id || '')
      setForm(newForm)
    } catch (err: any) {
      console.error('Failed to create form:', err)
      setMessage(err.message || 'Failed to create form')
    }
  }

  const handleAddField = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const fieldData: any = {
        label: formData.label,
        field_type: formData.field_type,
        is_required: formData.is_required,
        placeholder: formData.placeholder || null,
        helper_text: formData.helper_text || null,
        max_rating: formData.max_rating
      }

      if (formData.field_type === 'dropdown' || formData.field_type === 'multi_select') {
        fieldData.options = formData.options.filter(opt => opt.label.trim() !== '')
      }

      if (editingField) {
        await updateField(id || '', editingField.id, fieldData)
      } else {
        await addField(id || '', fieldData)
        // Save as personal template for future use
        try {
          await saveQuestionTemplate(fieldData)
        } catch (err) {
          console.log('Failed to save template (may already exist):', err)
        }
      }

      await fetchForm()
      resetForm()
      setMessage(editingField ? 'Field updated' : 'Field added')
      setTimeout(() => setMessage(''), 3000)
    } catch (err: any) {
      console.error('Failed to save field:', err)
      setMessage(err.message || 'Failed to save field')
    }
  }

  const handleEditField = (field: Field) => {
    setEditingField(field)
    setFormData({
      label: field.label,
      field_type: field.field_type,
      is_required: field.is_required,
      placeholder: field.placeholder || '',
      helper_text: field.helper_text || '',
      max_rating: field.max_rating || 5,
      options: (field.options && field.options.length > 0) ? field.options.map((opt: any) => ({ label: opt.label })) : [{ label: '' }]
    })
  }

  const handleDeleteField = async (fieldId: string) => {
    if (!confirm('Are you sure you want to delete this field?')) return
    try {
      await deleteField(id || '', fieldId)
      await fetchForm()
      setMessage('Field deleted')
      setTimeout(() => setMessage(''), 3000)
    } catch (err: any) {
      console.error('Failed to delete field:', err)
      setMessage(err.message || 'Failed to delete field')
    }
  }

  const handleDragEnd = async (event: any) => {
    const { active, over } = event
    if (active.id !== over.id) {
      const oldIndex = form.fields.findIndex((f: Field) => f.id === active.id)
      const newIndex = form.fields.findIndex((f: Field) => f.id === over.id)
      const newFields = arrayMove(form.fields, oldIndex, newIndex) as Field[]

      // Update positions
      const order = newFields.map((f: Field, idx: number) => ({ id: f.id, position: idx + 1 }))
      await reorderFields(id || '', order as any)

      setForm({ ...form, fields: newFields })
    }
  }

  const handlePublish = async () => {
    try {
      await publishForm(id || '')
      await fetchApprovalStatus()
      setMessage('Approval request sent to admins')
      setTimeout(() => setMessage(''), 3000)
    } catch (err: any) {
      console.error('Failed to request approval:', err)
      setMessage(err.message || 'Failed to request approval')
    }
  }

  const resetForm = () => {
    setEditingField(null)
    setFormData({
      label: '',
      field_type: 'text',
      is_required: false,
      placeholder: '',
      helper_text: '',
      max_rating: 5,
      options: [{ label: '' }]
    })
  }

  const handleAddOption = () => {
    setFormData({ ...formData, options: [...formData.options, { label: '' }] })
  }

  const handleRemoveOption = (index: number) => {
    const newOptions = formData.options.filter((_, i) => i !== index)
    setFormData({ ...formData, options: newOptions })
  }

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = formData.options.map((opt, i) =>
      i === index ? { label: value } : opt
    )
    setFormData({ ...formData, options: newOptions })
  }

  const showPlaceholderHelper = ['text', 'textarea', 'number', 'url', 'date'].includes(formData.field_type)
  const showOptions = ['dropdown', 'multi_select'].includes(formData.field_type)
  const showMaxRating = formData.field_type === 'rating'

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  if (!form) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-primary)' }}>

        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No Form Created</h2>
          <p className="text-gray-600 mb-4">Create an application form for this requisition</p>
          <button
            onClick={handleCreateForm}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700"
          >
            Create Form
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>

      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <button
              onClick={() => navigate(`/recruiter/requisitions/${id}`)}
              className="text-indigo-600 hover:text-indigo-800 mb-2 inline-flex items-center"
            >
              ← Back to Requisition
            </button>
            <h1 className="text-3xl font-bold text-gray-900">Application Form</h1>
            <div className="flex items-center gap-3 mt-2">
              {approvalStatus?.is_published && (
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                  Published
                </span>
              )}
              {approvalStatus && !approvalStatus.is_published && (
                <>
                  {approvalStatus.approvals?.some((a: any) => a.approval.status === 'pending') && (
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                      Pending Approval
                    </span>
                  )}
                  {approvalStatus.approvals?.some((a: any) => a.approval.status === 'rejected') && (
                    <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">
                      Rejected
                    </span>
                  )}
                </>
              )}
              <span className="text-gray-600 text-sm">
                {form.fields?.length || 0} fields
              </span>
            </div>
          </div>
          <button
            onClick={handlePublish}
            disabled={form.is_published || (approvalStatus?.approvals?.some((a: any) => a.approval.status === 'pending'))}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {form.is_published ? 'Published' : approvalStatus?.approvals?.some((a: any) => a.approval.status === 'pending') ? 'Approval Pending' : 'Request Approval'}
          </button>
        </div>

        {message && (
          <div className="mb-4 p-3 rounded-md border" style={{ background: 'rgba(59,130,246,0.08)', borderColor: 'rgba(59,130,246,0.2)', color: '#1e40af' }}>

            {message}
          </div>
        )}

        <div className="flex gap-6">
          {/* Main Field List */}
          <div className="flex-1">
            <div className="glass-card rounded-lg shadow p-6" style={{ border: '1px solid var(--border)' }}>

              <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Form Fields</h2>

              {form.fields?.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No fields added yet. Use the form on the right to add your first field.
                </div>
              ) : (
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                  <SortableContext items={form.fields.map((f: Field) => f.id)} strategy={verticalListSortingStrategy}>
                    {form.fields.map((field: Field) => (
                      <SortableItem
                        key={field.id}
                        field={field}
                        onEdit={handleEditField}
                        onDelete={handleDeleteField}
                      />
                    ))}
                  </SortableContext>
                </DndContext>
              )}
            </div>
          </div>

          {/* Sidebar Form */}
          <div className="w-96">
            <div className="glass-card rounded-lg shadow p-6 sticky top-6" style={{ border: '1px solid var(--border)' }}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
                  {editingField ? 'Edit Field' : 'Add Field'}
                </h2>
                <button
                  type="button"
                  onClick={() => setShowTemplates(!showTemplates)}
                  className="text-sm text-indigo-600 hover:text-indigo-800"
                >
                  {showTemplates ? 'Hide Templates' : 'Show Templates'}
                </button>
              </div>

              {showTemplates && (
                <div className="mb-4 p-3 rounded-lg" style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)' }}>
                  <div className="flex gap-2 mb-3">
                    <button
                      type="button"
                      onClick={() => setTemplateCategory('all')}
                      className={`text-xs px-3 py-1 rounded-full ${templateCategory === 'all' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                    >
                      All
                    </button>
                    <button
                      type="button"
                      onClick={() => setTemplateCategory('generic')}
                      className={`text-xs px-3 py-1 rounded-full ${templateCategory === 'generic' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                    >
                      Generic
                    </button>
                    <button
                      type="button"
                      onClick={() => setTemplateCategory('personal')}
                      className={`text-xs px-3 py-1 rounded-full ${templateCategory === 'personal' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                    >
                      My Questions
                    </button>
                  </div>
                  <div className="max-h-48 overflow-y-auto space-y-2">
                    {templates.length === 0 ? (
                      <p className="text-sm text-gray-500 text-center py-2">No templates found</p>
                    ) : (
                      templates.map((template: any) => (
                        <button
                          key={template.id}
                          type="button"
                          onClick={() => handleSelectTemplate(template)}
                          className="w-full text-left p-2 rounded hover:bg-indigo-50 transition-colors border border-gray-200"
                        >
                          <div className="font-medium text-sm text-gray-900">{template.label}</div>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded">
                              {template.field_type}
                            </span>
                            {template.is_required && (
                              <span className="text-xs px-2 py-0.5 bg-red-100 text-red-600 rounded">
                                Required
                              </span>
                            )}
                          </div>
                        </button>
                      ))
                    )}
                  </div>
                </div>
              )}

              <form onSubmit={handleAddField} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Label *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.label}
                    onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Field Type *
                  </label>
                  <select
                    value={formData.field_type}
                    onChange={(e) => setFormData({ ...formData, field_type: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="text">Text</option>
                    <option value="textarea">Textarea</option>
                    <option value="dropdown">Dropdown</option>
                    <option value="file">File Upload</option>
                    <option value="checkbox">Checkbox</option>
                    <option value="date">Date</option>
                    <option value="number">Number</option>
                    <option value="url">URL</option>
                    <option value="multi_select">Multi Select</option>
                    <option value="rating">Rating</option>
                    <option value="yes_no">Yes/No</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="is_required"
                    checked={formData.is_required}
                    onChange={(e) => setFormData({ ...formData, is_required: e.target.checked })}
                    className="text-indigo-600 focus:ring-indigo-500"
                  />
                  <label htmlFor="is_required" className="text-sm text-gray-700">
                    Required field
                  </label>
                </div>

                {showPlaceholderHelper && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Placeholder
                      </label>
                      <input
                        type="text"
                        value={formData.placeholder}
                        onChange={(e) => setFormData({ ...formData, placeholder: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Helper Text
                      </label>
                      <input
                        type="text"
                        value={formData.helper_text}
                        onChange={(e) => setFormData({ ...formData, helper_text: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </>
                )}

                {showMaxRating && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Max Rating
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={formData.max_rating}
                      onChange={(e) => setFormData({ ...formData, max_rating: parseInt(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                )}

                {showOptions && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Options
                    </label>
                    {formData.options.map((opt, idx) => (
                      <div key={idx} className="flex gap-2 mb-2">
                        <input
                          type="text"
                          value={opt.label}
                          onChange={(e) => handleOptionChange(idx, e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          placeholder={`Option ${idx + 1}`}
                        />
                        {formData.options.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveOption(idx)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={handleAddOption}
                      className="text-sm text-indigo-600 hover:text-indigo-800"
                    >
                      + Add Option
                    </button>
                  </div>
                )}

                <div className="flex gap-2 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    {editingField ? 'Update Field' : 'Add Field'}
                  </button>
                  {editingField && (
                    <button
                      type="button"
                      onClick={resetForm}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FormBuilderPage
