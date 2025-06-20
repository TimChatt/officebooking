import React, { useState } from 'react';
import Layout from '../components/layout';
import Card from '../components/ui/Card.jsx';
import Button from '../components/ui/Button.jsx';

export default function SettingsPage() {
  const [profile, setProfile] = useState({ name: '', email: '' });
  const [integrations, setIntegrations] = useState({ slack: '', google: '' });

  const saveProfile = e => {
    e.preventDefault();
    console.log('save profile', profile);
  };

  const saveIntegrations = e => {
    e.preventDefault();
    console.log('save integrations', integrations);
  };

  return (
    <Layout>
      <div>
        <h1 className="text-2xl font-semibold mb-6">Settings</h1>

        {/* Profile Section */}
        <Card className="p-4 mb-6">
          <h2 className="text-lg font-semibold mb-4">Profile</h2>
          <form onSubmit={saveProfile} className="space-y-4">
            <div>
              <label className="block text-sm text-slate-600 mb-1">Name</label>
              <input
                className="w-full border rounded px-3 py-2 text-sm"
                placeholder="Your name"
                value={profile.name}
                onChange={e => setProfile({ ...profile, name: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm text-slate-600 mb-1">Email</label>
              <input
                className="w-full border rounded px-3 py-2 text-sm"
                placeholder="you@example.com"
                value={profile.email}
                onChange={e => setProfile({ ...profile, email: e.target.value })}
              />
            </div>
            <Button type="submit">Save Profile</Button>
          </form>
        </Card>

        {/* Integrations Section */}
        <Card className="p-4">
          <h2 className="text-lg font-semibold mb-4">Integrations</h2>
          <form onSubmit={saveIntegrations} className="space-y-4">
            <div>
              <label className="block text-sm text-slate-600 mb-1">Slack Webhook</label>
              <input
                className="w-full border rounded px-3 py-2 text-sm"
                placeholder="https://hooks.slack.com/services/..."
                value={integrations.slack}
                onChange={e => setIntegrations({ ...integrations, slack: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm text-slate-600 mb-1">Google API Key</label>
              <input
                className="w-full border rounded px-3 py-2 text-sm"
                placeholder="AIzaSy..."
                value={integrations.google}
                onChange={e => setIntegrations({ ...integrations, google: e.target.value })}
              />
            </div>
            <Button type="submit">Save Integrations</Button>
          </form>
        </Card>
      </div>
    </Layout>
  );
}

