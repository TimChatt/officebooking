import React, { useState } from 'react';
import Card from '../components/ui/Card.jsx';
import Button from '../components/ui/Button.jsx';
import { Box, Typography, TextField } from '@mui/material';

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
    <Box>
        <Typography variant="h5" gutterBottom>
          Settings
        </Typography>

        {/* Profile Section */}
        <Card sx={{ p: 2, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Profile
          </Typography>
          <Box component="form" onSubmit={saveProfile} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Name"
              size="small"
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
            />
            <TextField
              label="Email"
              size="small"
              value={profile.email}
              onChange={(e) => setProfile({ ...profile, email: e.target.value })}
            />
            <Button type="submit">Save Profile</Button>
          </Box>
        </Card>

        {/* Integrations Section */}
        <Card sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Integrations
          </Typography>
          <Box component="form" onSubmit={saveIntegrations} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Slack Webhook"
              size="small"
              value={integrations.slack}
              onChange={(e) => setIntegrations({ ...integrations, slack: e.target.value })}
            />
            <TextField
              label="Google API Key"
              size="small"
              value={integrations.google}
              onChange={(e) => setIntegrations({ ...integrations, google: e.target.value })}
            />
            <Button type="submit">Save Integrations</Button>
          </Box>
        </Card>
      </Box>
  );
}

