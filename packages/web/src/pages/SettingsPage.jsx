import React, { useState } from 'react';
import Card from '../components/ui/Card.jsx';
import Button from '../components/ui/Button.jsx';

export default function SettingsPage() {
  const [profile, setProfile] = useState({ name: '', email: '' });
  const [integrations, setIntegrations] = useState({ slack: '', google: '' });

  const saveProfile = e => {
    e.preventDefault();
    // Placeholder action
    console.log('save profile', profile);
  };

  const saveIntegrations = e => {
    e.preventDefault();
    // Placeholder action
    console.log('save integrations', integrations);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Settings</h2>
      <Card className="space-y-2">
        <h3 className="font-semibold">Profile</h3>
        <form onSubmit={saveProfile} className="space-y-2">
          <input
            className="border p-2 w-full"
            placeholder="Name"
            value={profile.name}
            onChange={e => setProfile({ ...profile, name: e.target.value })}
          />
          <input
            className="border p-2 w-full"
            placeholder="Email"
            value={profile.email}
            onChange={e => setProfile({ ...profile, email: e.target.value })}
          />
          <Button type="submit">Save</Button>
        </form>
      </Card>
      <Card className="space-y-2">
        <h3 className="font-semibold">Integrations</h3>
        <form onSubmit={saveIntegrations} className="space-y-2">
          <input
            className="border p-2 w-full"
            placeholder="Slack webhook"
            value={integrations.slack}
            onChange={e => setIntegrations({ ...integrations, slack: e.target.value })}
          />
          <input
            className="border p-2 w-full"
            placeholder="Google API key"
            value={integrations.google}
            onChange={e => setIntegrations({ ...integrations, google: e.target.value })}
          />
          <Button type="submit">Save</Button>
        </form>
      </Card>
    </div>
  );
}
