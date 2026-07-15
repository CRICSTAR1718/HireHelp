import React, { useState } from 'react';
import { Card, CardHeader, CardBody, Button } from "../../components/interviewer";
import { calendarApi, type CalendarIntegration } from "../../api/interviewer";

export const CalendarSync: React.FC = () => {
  const [integrations, setIntegrations] = useState<CalendarIntegration[]>([]);
  const [syncing, setSyncing] = useState<number | null>(null);

  const handleSync = async (id: number) => {
    setSyncing(id);
    try {
      await calendarApi.syncCalendar(id);
      alert('Calendar synced successfully!');
    } catch (error) {
      console.error('Failed to sync calendar:', error);
      alert('Failed to sync calendar');
    } finally {
      setSyncing(null);
    }
  };

  const providers = [
    { name: 'Google Calendar', icon: '📅', color: 'bg-blue-500' },
    { name: 'Outlook Calendar', icon: '📆', color: 'bg-purple-500' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Calendar Integrations</h1>
          <p className="text-gray-600">Connect and sync your external calendars</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {providers.map((provider) => {
            const integration = integrations.find(i => i.provider === provider.name.toLowerCase());
            return (
              <Card key={provider.name} className="hover:shadow-xl transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className={`w-16 h-16 rounded-xl ${provider.color} flex items-center justify-center text-3xl`}>
                      {provider.icon}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">{provider.name}</h3>
                      <p className={`text-sm ${integration ? 'text-green-600' : 'text-gray-500'}`}>
                        {integration ? 'Connected' : 'Not connected'}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardBody>
                  {integration ? (
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Last synced:</span>
                        <span className="font-medium text-gray-900">
                          {integration.lastSyncedAt
                            ? new Date(integration.lastSyncedAt).toLocaleString()
                            : 'Never'
                          }
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Sync enabled:</span>
                        <span className={`font-medium ${integration.syncEnabled ? 'text-green-600' : 'text-red-600'}`}>
                          {integration.syncEnabled ? 'Yes' : 'No'}
                        </span>
                      </div>
                      <Button
                        onClick={() => handleSync(integration.id)}
                        disabled={syncing === integration.id}
                        className="w-full"
                      >
                        {syncing === integration.id ? 'Syncing...' : 'Sync Now'}
                      </Button>
                    </div>
                  ) : (
                    <Button variant="primary" className="w-full">
                      Connect {provider.name}
                    </Button>
                  )}
                </CardBody>
              </Card>
            );
          })}
        </div>

        <Card className="mt-8">
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900">Sync Settings</h3>
          </CardHeader>
          <CardBody>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Auto-sync</p>
                  <p className="text-sm text-gray-500">Automatically sync calendar changes</p>
                </div>
                <button className="w-12 h-6 bg-blue-600 rounded-full relative">
                  <span className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Sync frequency</p>
                  <p className="text-sm text-gray-500">How often to check for updates</p>
                </div>
                <select className="px-4 py-2 border border-gray-300 rounded-lg">
                  <option>Every 15 minutes</option>
                  <option>Every 30 minutes</option>
                  <option>Every hour</option>
                </select>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};
