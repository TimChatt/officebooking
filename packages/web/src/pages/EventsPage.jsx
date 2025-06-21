import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout.jsx';
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
} from '@mui/material';

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', event_time: '' });
  const [rsvpEvent, setRsvpEvent] = useState(null);

  async function load() {
    const res = await fetch('/api/events');
    if (res.ok) setEvents(await res.json());
  }

  useEffect(() => {
    load();
  }, []);

  async function submitCreate(e) {
    e.preventDefault();
    const res = await fetch('/api/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      setShowCreate(false);
      setForm({ title: '', description: '', event_time: '' });
      load();
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

  return (
    <Layout>
      <Box>
        <Typography variant="h5" gutterBottom>
          Events
        </Typography>

        <Box mb={2}>
          <Button onClick={() => setShowCreate(true)}>New Event</Button>
        </Box>

        <Paper sx={{ overflowX: 'auto' }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Date</TableCell>
                <TableCell />
              </TableRow>
            </TableHead>
            <TableBody>
              {events.map((ev) => (
                <TableRow key={ev.id} hover>
                  <TableCell>{ev.title}</TableCell>
                  <TableCell>{new Date(ev.event_time).toLocaleString()}</TableCell>
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
    </Layout>
  );
}
