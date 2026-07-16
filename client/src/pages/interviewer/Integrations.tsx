import { useState } from 'react'
import { Link as LinkIcon, Calendar, Mail, Video, Phone, CheckCircle, XCircle, RefreshCw, Settings, ChevronRight, Zap, Shield, Globe, ExternalLink } from 'lucide-react'

interface Integration {
  id: string
  name: string
  icon: React.ReactNode
  description: string
  connected: boolean
  category: 'calendar' | 'communication' | 'video' | 'productivity'
  lastSynced?: Date
  features: string[]
  meetingLink?: string
}

export default function InterviewerIntegrations() {
  const [integrations, setIntegrations] = useState<Integration[]>([
    {
      id: 'google-calendar',
      name: 'Google Calendar',
      icon: <Calendar className="w-6 h-6" />,
      description: 'Sync your interview schedule with Google Calendar',
      connected: false,
      category: 'calendar',
      features: ['Two-way sync', 'Auto-sync', 'Conflict detection']
    },
    {
      id: 'outlook-calendar',
      name: 'Outlook Calendar',
      icon: <Calendar className="w-6 h-6" />,
      description: 'Connect your Outlook Calendar for seamless scheduling',
      connected: false,
      category: 'calendar',
      features: ['Office 365 integration', 'Meeting reminders', 'Availability sync']
    },
    {
      id: 'gmail',
      name: 'Gmail',
      icon: <Mail className="w-6 h-6" />,
      description: 'Send interview invitations and updates via Gmail',
      connected: false,
      category: 'communication',
      features: ['Email templates', 'Auto-reminders', 'Tracking']
    },
    {
      id: 'google-meet',
      name: 'Google Meet',
      icon: <Video className="w-6 h-6" />,
      description: 'Create Google Meet links for video interviews',
      connected: false,
      category: 'video',
      features: ['Instant meeting links', 'Calendar integration', 'Recording']
    },
    {
      id: 'zoom',
      name: 'Zoom',
      icon: <Video className="w-6 h-6" />,
      description: 'Create and manage Zoom meetings for interviews',
      connected: false,
      category: 'video',
      features: ['Auto-join links', 'Recording', 'Waiting room']
    },
    {
      id: 'teams',
      name: 'Microsoft Teams',
      icon: <Video className="w-6 h-6" />,
      description: 'Integration with Microsoft Teams for video interviews',
      connected: false,
      category: 'video',
      features: ['Meeting scheduling', 'Chat integration', 'File sharing']
    },
    {
      id: 'slack',
      name: 'Slack',
      icon: <Zap className="w-6 h-6" />,
      description: 'Get interview notifications in Slack channels',
      connected: false,
      category: 'productivity',
      features: ['Channel notifications', 'Status updates', 'Quick actions']
    }
  ])

  const [syncing, setSyncing] = useState<string | null>(null)
  const [activeCategory, setActiveCategory] = useState<'all' | 'calendar' | 'communication' | 'video' | 'productivity'>('all')

  const handleConnect = (id: string) => {
    setSyncing(id)
    
    // For video integrations, generate real meeting links
    if (id === 'google-meet') {
      // Open Google Meet instant meeting
      window.open('https://meet.google.com/new', '_blank')
      setIntegrations(prev => prev.map(int => 
        int.id === id ? { ...int, connected: true, lastSynced: new Date(), meetingLink: 'https://meet.google.com/new' } : int
      ))
      setSyncing(null)
      return
    }
    
    if (id === 'zoom') {
      // Open Zoom meeting creation (requires Zoom API for real implementation)
      window.open('https://zoom.us/meeting/schedule', '_blank')
      setIntegrations(prev => prev.map(int => 
        int.id === id ? { ...int, connected: true, lastSynced: new Date(), meetingLink: 'https://zoom.us/meeting/schedule' } : int
      ))
      setSyncing(null)
      return
    }
    
    if (id === 'teams') {
      // Open Teams meeting creation (requires Microsoft Graph API for real implementation)
      window.open('https://teams.microsoft.com/l/meeting/new', '_blank')
      setIntegrations(prev => prev.map(int => 
        int.id === id ? { ...int, connected: true, lastSynced: new Date(), meetingLink: 'https://teams.microsoft.com/l/meeting/new' } : int
      ))
      setSyncing(null)
      return
    }
    
    // For non-video integrations, use dummy connection
    setTimeout(() => {
      setIntegrations(prev => prev.map(int => 
        int.id === id ? { ...int, connected: true, lastSynced: new Date() } : int
      ))
      setSyncing(null)
    }, 2000)
  }

  const handleDisconnect = (id: string) => {
    if (window.confirm('Are you sure you want to disconnect this integration?')) {
      setIntegrations(prev => prev.map(int => 
        int.id === id ? { ...int, connected: false, lastSynced: undefined } : int
      ))
    }
  }

  const handleSync = (id: string) => {
    setSyncing(id)
    setTimeout(() => {
      setIntegrations(prev => prev.map(int => 
        int.id === id ? { ...int, lastSynced: new Date() } : int
      ))
      setSyncing(null)
    }, 1500)
  }

  const filteredIntegrations = activeCategory === 'all' 
    ? integrations 
    : integrations.filter(int => int.category === activeCategory)

  const categories = [
    { id: 'all', label: 'All Integrations', icon: Globe },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'communication', label: 'Communication', icon: Mail },
    { id: 'video', label: 'Video Conferencing', icon: Video },
    { id: 'productivity', label: 'Productivity', icon: Zap }
  ]

  const connectedCount = integrations.filter(int => int.connected).length

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Integrations</h1>
        <p className="text-gray-600">Connect your favorite tools to streamline your interview process</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <LinkIcon className="w-8 h-8 opacity-80" />
            <div className="text-3xl font-bold">{connectedCount}</div>
          </div>
          <h3 className="font-semibold mb-1">Connected Integrations</h3>
          <p className="text-blue-100 text-sm">Active connections</p>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <CheckCircle className="w-8 h-8 opacity-80" />
            <div className="text-3xl font-bold">{integrations.length - connectedCount}</div>
          </div>
          <h3 className="font-semibold mb-1">Available</h3>
          <p className="text-green-100 text-sm">Ready to connect</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <Shield className="w-8 h-8 opacity-80" />
            <div className="text-3xl font-bold">100%</div>
          </div>
          <h3 className="font-semibold mb-1">Secure</h3>
          <p className="text-purple-100 text-sm">Enterprise-grade security</p>
        </div>
      </div>

      {/* Category Filter */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => {
            const Icon = category.icon
            return (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeCategory === category.id
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                {category.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Integration Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredIntegrations.map((integration) => (
          <div
            key={integration.id}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-lg ${
                  integration.connected 
                    ? 'bg-green-100' 
                    : 'bg-gray-100'
                }`}>
                  <div className={`${
                    integration.connected 
                      ? 'text-green-600' 
                      : 'text-gray-600'
                  }`}>
                    {integration.icon}
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{integration.name}</h3>
                  <div className="flex items-center gap-1 mt-1">
                    {integration.connected ? (
                      <>
                        <CheckCircle className="w-3 h-3 text-green-600" />
                        <span className="text-xs text-green-600">Connected</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-3 h-3 text-gray-400" />
                        <span className="text-xs text-gray-500">Not connected</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Settings className="w-4 h-4 text-gray-400" />
              </button>
            </div>

            <p className="text-sm text-gray-600 mb-4">{integration.description}</p>

            <div className="mb-4">
              <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Features</h4>
              <div className="flex flex-wrap gap-2">
                {integration.features.map((feature, index) => (
                  <span
                    key={index}
                    className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded"
                  >
                    {feature}
                  </span>
                ))}
              </div>
            </div>

            {integration.connected && integration.lastSynced && (
              <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Last synced:</span>
                  <span className="font-medium text-gray-900">
                    {new Date(integration.lastSynced).toLocaleString()}
                  </span>
                </div>
              </div>
            )}

            {/* Meeting Link Section for Video Integrations */}
            {integration.connected && integration.meetingLink && ['google-meet', 'zoom', 'teams'].includes(integration.id) && (
              <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="text-xs font-medium text-blue-900 uppercase tracking-wide mb-2">Meeting Link</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={integration.meetingLink}
                      readOnly
                      className="flex-1 text-sm bg-white border border-blue-300 rounded px-2 py-1 text-blue-900"
                    />
                    <button
                      onClick={() => window.open(integration.meetingLink, '_blank')}
                      className="p-1.5 hover:bg-blue-100 rounded transition-colors"
                      title="Open link"
                    >
                      <ExternalLink className="w-4 h-4 text-blue-600" />
                    </button>
                  </div>
                  <button
                    onClick={() => window.open(integration.meetingLink, '_blank')}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                  >
                    <Video className="w-4 h-4" />
                    Open Meeting
                  </button>
                </div>
              </div>
            )}

            <div className="flex gap-2">
              {integration.connected ? (
                <>
                  <button
                    onClick={() => handleSync(integration.id)}
                    disabled={syncing === integration.id}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2"
                  >
                    {syncing === integration.id ? (
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
                    onClick={() => handleDisconnect(integration.id)}
                    className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors font-medium"
                  >
                    Disconnect
                  </button>
                </>
              ) : (
                <button
                  onClick={() => handleConnect(integration.id)}
                  disabled={syncing === integration.id}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2"
                >
                  {syncing === integration.id ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Connecting...
                    </>
                  ) : (
                    <>
                      <LinkIcon className="w-4 h-4" />
                      Connect
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Integration Settings */}
      <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Global Integration Settings</h2>
          <button className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
            Advanced Settings <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h3 className="font-medium text-gray-900">Auto-sync all integrations</h3>
              <p className="text-sm text-gray-500">Automatically sync data across all connected services</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" defaultChecked className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h3 className="font-medium text-gray-900">Conflict resolution</h3>
              <p className="text-sm text-gray-500">How to handle scheduling conflicts across calendars</p>
            </div>
            <select className="px-4 py-2 border border-gray-300 rounded-lg">
              <option>Ask me</option>
              <option>Prefer HireHelp</option>
              <option>Prefer external calendar</option>
            </select>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h3 className="font-medium text-gray-900">Notification preferences</h3>
              <p className="text-sm text-gray-500">Get notified about integration events</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" defaultChecked className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h3 className="font-medium text-gray-900">Data retention</h3>
              <p className="text-sm text-gray-500">How long to keep synced data</p>
            </div>
            <select className="px-4 py-2 border border-gray-300 rounded-lg">
              <option>30 days</option>
              <option>60 days</option>
              <option>90 days</option>
              <option>1 year</option>
            </select>
          </div>
        </div>
      </div>

      {/* Security Notice */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-6">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-blue-100 rounded-lg">
            <Shield className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-blue-900 mb-2">Secure Integration</h3>
            <p className="text-sm text-blue-800">
              All integrations use OAuth 2.0 for secure authentication. We never store your passwords and only access the data you explicitly authorize. You can revoke access at any time.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
