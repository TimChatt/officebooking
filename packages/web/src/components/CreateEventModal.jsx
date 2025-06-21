import React from 'react';
import Modal from './ui/Modal.jsx';
import Button from './ui/Button.jsx';
import { Box, TextField, Typography } from '@mui/material';

export default function CreateEventModal({ open, onClose, form, setForm, onSubmit }) {
  return (
    <Modal open={open} onClose={onClose}>
      <Typography variant="h6" gutterBottom>
        Create Event
      </Typography>
      <Box component="form" onSubmit={onSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField
          label="Title"
          size="small"
          fullWidth
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />
        <TextField
          label="Description"
          size="small"
          multiline
          rows={3}
          fullWidth
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        <TextField
          type="datetime-local"
          label="Event Time"
          size="small"
          fullWidth
          InputLabelProps={{ shrink: true }}
          value={form.event_time}
          onChange={(e) => setForm({ ...form, event_time: e.target.value })}
        />
        <TextField
          label="Tags (comma separated)"
          size="small"
          fullWidth
          value={form.tags}
          onChange={(e) => setForm({ ...form, tags: e.target.value })}
        />
        <Button type="submit" fullWidth>
          Create Event
        </Button>
      </Box>
    </Modal>
  );
}
