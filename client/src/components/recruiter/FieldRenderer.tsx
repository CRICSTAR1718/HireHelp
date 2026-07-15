import React from 'react'

interface Field {
  id: string
  field_type: string
  label: string
  placeholder?: string
  is_required?: boolean
  helper_text?: string
  max_rating?: number
  options?: Array<{ id: string; label: string }>
}

interface FieldRendererProps {
  field: Field
  value: any
  onChange: (fieldId: string, newValue: any) => void
  error?: string
}

const FieldRenderer: React.FC<FieldRendererProps> = ({ field, value, onChange, error }) => {
  const handleChange = (newValue: any) => {
    onChange(field.id, newValue)
  }

  const renderField = () => {
    switch (field.field_type) {
      case 'text':
        return (
          <input
            type="text"
            value={value || ''}
            onChange={(e) => handleChange(e.target.value)}
            placeholder={field.placeholder}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${error ? 'border-red-500' : 'border-gray-300'}`}
          />
        )

      case 'textarea':
        return (
          <textarea
            value={value || ''}
            onChange={(e) => handleChange(e.target.value)}
            placeholder={field.placeholder}
            rows={4}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${error ? 'border-red-500' : 'border-gray-300'}`}
          />
        )

      case 'number':
        return (
          <input
            type="number"
            value={value || ''}
            onChange={(e) => handleChange(e.target.value)}
            placeholder={field.placeholder}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${error ? 'border-red-500' : 'border-gray-300'}`}
          />
        )

      case 'url':
        return (
          <input
            type="url"
            value={value || ''}
            onChange={(e) => handleChange(e.target.value)}
            placeholder={field.placeholder || 'https://'}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${error ? 'border-red-500' : 'border-gray-300'}`}
          />
        )

      case 'date':
        return (
          <input
            type="date"
            value={value || ''}
            onChange={(e) => handleChange(e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${error ? 'border-red-500' : 'border-gray-300'}`}
          />
        )

      case 'yes_no':
        return (
          <div className="flex gap-4">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="radio"
                name={`field-${field.id}`}
                value="true"
                checked={value === 'true'}
                onChange={(e) => handleChange(e.target.value)}
                className="text-indigo-400 focus:ring-indigo-500"
              />
              <span className="text-[color:var(--text-primary)]">Yes</span>
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="radio"
                name={`field-${field.id}`}
                value="false"
                checked={value === 'false'}
                onChange={(e) => handleChange(e.target.value)}
                className="text-indigo-400 focus:ring-indigo-500"
              />
              <span className="text-[color:var(--text-primary)]">No</span>
            </label>
          </div>
        )


      case 'checkbox':
        return (
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={value === true}
              onChange={(e) => handleChange(e.target.checked)}
              className="text-indigo-600 focus:ring-indigo-500 w-5 h-5"
            />
            <span>Check this option</span>
          </label>
        )

      case 'rating':
        return (
          <div className="flex gap-2">
            {Array.from({ length: field.max_rating || 5 }, (_, i) => i + 1).map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => handleChange(star)}
                className={`text-2xl ${star <= (value || 0) ? 'text-yellow-400' : 'text-gray-300'} hover:text-yellow-400 transition`}
              >
                ★
              </button>
            ))}
          </div>
        )

      case 'dropdown':
        return (
          <select
            value={value || ''}
            onChange={(e) => handleChange(e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${error ? 'border-red-500' : 'border-gray-300'}`}
          >
            <option value="">Select an option</option>
            {field.options?.map((opt) => (
              <option key={opt.id} value={opt.label}>
                {opt.label}
              </option>
            ))}
          </select>
        )

      case 'multi_select':
        return (
          <div className="space-y-2">
            {field.options?.map((opt) => (
              <label key={opt.id} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={(value || []).includes(opt.label)}
                  onChange={(e) => {
                    const currentValues = value || []
                    if (e.target.checked) {
                      handleChange([...currentValues, opt.label])
                    } else {
                      handleChange(currentValues.filter((v: string) => v !== opt.label))
                    }
                  }}
                  className="text-indigo-600 focus:ring-indigo-500 w-5 h-5"
                />
                <span>{opt.label}</span>
              </label>
            ))}
          </div>
        )

      case 'file':
        return (
          <input
            type="file"
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) {
                handleChange(file.name)
              }
            }}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${error ? 'border-red-500' : 'border-gray-300'}`}
          />
        )

      default:
        return <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Unknown field type</div>
    }
  }


  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {field.label}
        {field.is_required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {renderField()}
      {field.helper_text && (
        <p className="mt-1 text-sm text-gray-500">{field.helper_text}</p>
      )}
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  )
}

export default FieldRenderer
