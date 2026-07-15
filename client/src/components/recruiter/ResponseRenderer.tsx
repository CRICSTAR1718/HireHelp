import React from 'react'

interface ResponseRendererProps {
  field_type: string
  response_text?: string
  response_json?: any
  file_url?: string
  max_rating?: number
}

const ResponseRenderer: React.FC<ResponseRendererProps> = ({ field_type, response_text, response_json, file_url, max_rating }) => {
  const renderResponse = () => {
    switch (field_type) {
      case 'rating':
        return (
          <div className="flex gap-1">
            {Array.from({ length: max_rating || 5 }, (_, i) => i + 1).map((star) => (
              <span
                key={star}
                className={`text-xl ${star <= (response_json || 0) ? 'text-yellow-400' : 'text-gray-300'}`}
              >
                ★
              </span>
            ))}
          </div>
        )

      case 'multi_select':
        if (!response_json || response_json.length === 0) {
          return <span style={{ color: 'var(--text-muted)' }}>No selection</span>
        }
        return (
          <div className="flex flex-wrap gap-2">
            {response_json.map((item: string, idx: number) => (
              <span
                key={idx}
                style={{
                  padding: '0.25rem 0.75rem',
                  background: 'rgba(99,102,241,0.15)',
                  color: 'rgba(199,210,254,0.95)',
                  border: '1px solid rgba(99,102,241,0.25)',
                  borderRadius: 999,
                  fontSize: '0.875rem'
                }}
              >
                {item}
              </span>
            ))}
          </div>
        )


      case 'yes_no':
        return (
          <span
            className="font-medium"
            style={{
              color: response_text === 'true' ? 'rgba(52,211,153,0.95)' : 'rgba(248,113,113,0.95)'
            }}
          >
            {response_text === 'true' ? 'Yes' : 'No'}
          </span>
        )


      case 'file':
        if (!file_url) {
          return <span className="text-gray-500">No file uploaded</span>
        }
        return (
          <a
            href={file_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-600 hover:text-indigo-800 underline"
          >
            View File
          </a>
        )

      case 'checkbox':
        return response_json ? (
          <span className="text-green-600 text-xl">✓</span>
        ) : (
          <span className="text-red-600 text-xl">✗</span>
        )

      case 'text':
      case 'textarea':
      case 'number':
      case 'url':
      case 'date':
      case 'dropdown':
      default:
        if (!response_text) {
          return <span className="text-gray-500">No response</span>
        }
        return <span className="text-gray-800">{response_text}</span>
    }
  }

  return <div className="text-gray-700">{renderResponse()}</div>
}

export default ResponseRenderer
