import { useState, useEffect } from 'react'
import { useAppSelector } from '@/store/hooks'
import { calendarApi, type CalendarIntegration } from '@/api/interviewer'
import apiClient from '@/api/shared/client'
import { Calendar, ExternalLink, Check, X, RefreshCw, AlertCircle, Key } from 'lucide-react'

export default function CalcomSetup() {
  const { user } = useAppSelector((s) => s.auth)
  const [interviewerId, setInterviewerId] = useState<number | null>(null)
  const [integration, setIntegration] = useState<CalendarIntegration | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [showUpdateForm, setShowUpdateForm] = useState(false)
  
  // Form state
  const [apiKey, setApiKey] = useState('')
  const [eventTypeId, setEventTypeId] = useState('')
  const [syncEnabled, setSyncEnabled] = useState(true)

  useEffect(() => {
    loadInterviewerId()
  }, [])

  useEffect(() => {
    if (interviewerId) {
      loadIntegration()
    }
  }, [interviewerId])

  const loadInterviewerId = async () => {
    if (!user?.id) return
    
    try {
      const response = await apiClient.get(`/interviews/interviewers/user/${user.id}`)
      setInterviewerId(response.data.id)
    } catch (err) {
      console.error('Failed to load interviewer ID:', err)
      setError('Could not load your interviewer profile. Please contact support.')
    } finally {
      setLoading(false)
    }
  }

  const loadIntegration = async () => {
    if (!interviewerId) return
    
    try {
      const integrations = await calendarApi.getInterviewerIntegrations(interviewerId)
      const calcomIntegration = integrations.find(i => i.provider === 'calcom')
      setIntegration(calcomIntegration || null)
      
      if (calcomIntegration) {
        setApiKey(calcomIntegration.accessToken)
        setEventTypeId(calcomIntegration.calendarId || '')
        setSyncEnabled(calcomIntegration.syncEnabled)
      }
    } catch (err) {
      console.error('Failed to load integration:', err)
      setError('Failed to load Cal.com integration')
    }
  }

  const maskApiKey = (key: string) => {
    if (!key) return ''
    if (key.length <= 8) return '•'.repeat(key.length)
    return key.substring(0, 8) + '•'.repeat(key.length - 8)
  }

  const validateAndCleanApiKey = (key: string): { cleaned: string; correction?: string } => {
    let cleaned = key.trim()
    let correction: string | undefined
    
    // Handle duplicated prefixes
    if (cleaned.startsWith('cal_live_cal_live_')) {
      cleaned = cleaned.replace('cal_live_cal_live_', 'cal_live_')
      correction = 'Removed duplicated "cal_live_" prefix'
    } else if (cleaned.startsWith('cal_test_cal_test_')) {
      cleaned = cleaned.replace('cal_test_cal_test_', 'cal_test_')
      correction = 'Removed duplicated "cal_test_" prefix'
    }
    
    return { cleaned, correction }
  }

  const handleSave = async () => {
    setError(null)
    setSuccess(null)
    setSaving(true)

    try {
      const { cleaned: cleanedApiKey, correction } = validateAndCleanApiKey(apiKey)
      
      if (correction) {
        setSuccess(correction)
      }

      const data = {
        interviewerId: interviewerId!,
        provider: 'calcom',
        accessToken: cleanedApiKey,
        calendarId: eventTypeId,
        syncEnabled
      }

      if (integration) {
        await calendarApi.updateIntegration(integration.id, data)
        setSuccess('Cal.com integration updated successfully')
      } else {
        await calendarApi.createIntegration(data)
        setSuccess('Cal.com integration connected successfully')
      }

      await loadIntegration()
      setShowUpdateForm(false)
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000)
    } catch (err) {
      console.error('Failed to save integration:', err)
      setError('Failed to save Cal.com integration. Please check your credentials and try again.')
    } finally {
      setSaving(false)
    }
  }

  const handleDisconnect = async () => {
    if (!integration || !window.confirm('Are you sure you want to disconnect your Cal.com integration?')) {
      return
    }

    setError(null)
    setSuccess(null)
    setSaving(true)

    try {
      await calendarApi.deleteIntegration(integration.id)
      setIntegration(null)
      setApiKey('')
      setEventTypeId('')
      setSuccess('Cal.com integration disconnected successfully')
      
      setTimeout(() => setSuccess(null), 3000)
    } catch (err) {
      console.error('Failed to disconnect:', err)
      setError('Failed to disconnect Cal.com integration')
    } finally {
      setSaving(false)
    }
  }

  const handleSync = async () => {
    if (!integration) return
    
    setError(null)
    setSuccess(null)
    setSaving(true)

    try {
      await calendarApi.syncCalendar(integration.id)
      setSuccess('Calendar synced successfully')
      await loadIntegration()
      
      setTimeout(() => setSuccess(null), 3000)
    } catch (err) {
      console.error('Failed to sync:', err)
      setError('Failed to sync calendar')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
        </div>
      </div>
    )
  }

  if (error && !integration) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
            <div>
              <h3 className="font-semibold text-red-900 mb-1">Error</h3>
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Cal.com Setup</h1>
        <p className="text-gray-600">Connect your Cal.com account for interview scheduling</p>
      </div>

      {/* Success/Error Messages */}
      {success && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
          <div className="flex items-center gap-2">
            <Check className="w-5 h-5 text-green-600" />
            <p className="text-green-800">{success}</p>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <p className="text-red-800">{error}</p>
          </div>
        </div>
      )}

      {/* Connected State */}
      {integration && !showUpdateForm ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 rounded-lg">
                <Calendar className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Cal.com Connected</h2>
                <p className="text-sm text-gray-500">Your Cal.com account is linked</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${integration.syncEnabled ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                {integration.syncEnabled ? 'Sync Enabled' : 'Sync Disabled'}
              </span>
            </div>
          </div>

          <div className="space-y-4 mb-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Event Type ID</label>
                <p className="text-gray-900 font-medium">{integration.calendarId || 'Not set'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">API Key</label>
                <p className="text-gray-900 font-medium font-mono text-sm">{maskApiKey(integration.accessToken)}</p>
              </div>
            </div>
            
            {integration.updatedAt && (
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Last Updated</label>
                <p className="text-gray-900">{new Date(integration.updatedAt).toLocaleString()}</p>
              </div>
            )}

            {integration.lastSyncedAt && (
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Last Synced</label>
                <p className="text-gray-900">{new Date(integration.lastSyncedAt).toLocaleString()}</p>
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => setShowUpdateForm(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Update Credentials
            </button>
            <button
              onClick={handleSync}
              disabled={saving}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium flex items-center gap-2"
            >
              {saving ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Syncing...
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4" />
                  Sync Now
                </>
              )}
            </button>
            <button
              onClick={handleDisconnect}
              disabled={saving}
              className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors font-medium"
            >
              Disconnect
            </button>
          </div>
        </div>
      ) : (
        /* Connection Form */
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {integration ? 'Update Cal.com Integration' : 'Connect Cal.com'}
              </h2>
              <p className="text-sm text-gray-500">
                {integration ? 'Update your Cal.com credentials' : 'Link your Cal.com account for scheduling'}
              </p>
            </div>
          </div>

          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cal.com API Key <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="cal_live_..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-sm text-gray-500 mt-1">
                Your Cal.com API key (starts with <code className="bg-gray-100 px-1 rounded">cal_live_</code> or <code className="bg-gray-100 px-1 rounded">cal_test_</code>)
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Event Type ID <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={eventTypeId}
                onChange={(e) => setEventTypeId(e.target.value)}
                placeholder="12345"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-sm text-gray-500 mt-1">
                The numeric ID from your Cal.com event type URL.{' '}
                <a
                  href="https://app.cal.com/event-types"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-700 flex items-center gap-1 mt-1"
                >
                  <ExternalLink className="w-3 h-3" />
                  Open Cal.com Event Types
                </a>
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Navigate to your event type and copy the ID from the URL: <code className="bg-gray-100 px-1 rounded">app.cal.com/event-types/&lt;ID&gt;</code>
              </p>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="syncEnabled"
                checked={syncEnabled}
                onChange={(e) => setSyncEnabled(e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="syncEnabled" className="text-sm text-gray-700">
                Enable automatic calendar sync
              </label>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleSave}
              disabled={saving || !apiKey.trim() || !eventTypeId.trim()}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {saving ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Key className="w-4 h-4" />
                  {integration ? 'Update' : 'Connect'}
                </>
              )}
            </button>
            {integration && (
              <button
                onClick={() => setShowUpdateForm(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      )}

      {/* Help Section */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row items-start gap-4">
          <div className="p-3 bg-blue-100 rounded-lg">
            <Key className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-blue-900 mb-2">How to get your Cal.com credentials</h3>
            <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
              <li>Log in to your <a href="https://app.cal.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-900">Cal.com account</a></li>
              <li>Go to Settings → Integrations → API</li>
              <li>Generate a new API key (use "cal_live_" for production)</li>
              <li>Navigate to Event Types and select your interview event type</li>
              <li>Copy the numeric ID from the URL: <code className="bg-blue-100 px-1 rounded">app.cal.com/event-types/&lt;ID&gt;</code></li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  )
}
