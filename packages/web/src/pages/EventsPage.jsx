import React, { useEffect, useState } from 'react';
import Button from '../components/ui/Button.jsx';
import CreateEventModal from '../components/CreateEventModal.jsx';
import RsvpModal from '../components/RsvpModal.jsx';
import {
  Box,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
} from '@mui/material';

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', event_time: '', tags: '' });
  const [selectedTag, setSelectedTag] = useState('');
  const [rsvpEvent, setRsvpEvent] = useState(null);

  async function load(tag = '') {
    const url = tag ? `/api/events?tag=${encodeURIComponent(tag)}` : '/api/events';
    const res = await fetch(url);
    if (res.ok) setEvents(await res.json());
  }

  useEffect(() => {
    load(selectedTag);
  }, [selectedTag]);

  async function submitCreate(e) {
    e.preventDefault();
    const payload = {
      ...form,
      tags: form.tags
        .split(',')
        .map((t) => t.trim())
        .filter((t) => t),
    };
    const res = await fetch('/api/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      setShowCreate(false);
      setForm({ title: '', description: '', event_time: '', tags: '' });
      load(selectedTag);
    }
  }

  async function sendRsvp(status) {
    if (!rsvpEvent) return;
    const res = await fetch(`/api/events/${rsvpEvent.id}/rsvp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: 'anon', status }),
    });
    if (res.ok) setRsvpEvent(null);
  }

  const allTags = Array.from(
    new Set(events.flatMap((ev) => ev.tags || []))
  );

  return (
    <Box>
        <Typography variant="h5" gutterBottom>
          Events
        </Typography>

        <Box mb={2} sx={{ display: 'flex', gap: 2 }}>
          <Button onClick={() => setShowCreate(true)}>New Event</Button>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel id="tag-filter">Filter</InputLabel>
            <Select
              labelId="tag-filter"
              label="Filter"
              value={selectedTag}
              onChange={(e) => setSelectedTag(e.target.value)}
            >
              <MenuItem value="">
                <em>All</em>
              </MenuItem>
              {allTags.map((t) => (
                <MenuItem key={t} value={t}>
                  {t}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <Paper sx={{ overflowX: 'auto' }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Tags</TableCell>
                <TableCell />
              </TableRow>
            </TableHead>
            <TableBody>
              {events.map((ev) => (
                <TableRow key={ev.id} hover>
                  <TableCell>{ev.title}</TableCell>
                  <TableCell>{new Date(ev.event_time).toLocaleString()}</TableCell>
                  <TableCell>
                    {ev.tags && ev.tags.map((t) => (
                      <Chip key={t} label={t} size="small" sx={{ mr: 0.5 }} />
                    ))}
                  </TableCell>
                  <TableCell>
                    <Button onClick={() => setRsvpEvent(ev)} size="small">
                      RSVP
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>

        <CreateEventModal
          open={showCreate}
          onClose={() => setShowCreate(false)}
          form={form}
          setForm={setForm}
          onSubmit={submitCreate}
        />

        <RsvpModal
          open={!!rsvpEvent}
          onClose={() => setRsvpEvent(null)}
          event={rsvpEvent}
          onSelect={sendRsvp}
        />
      </Box>
  );
}
