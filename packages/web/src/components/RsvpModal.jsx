import React from 'react';
import Modal from './ui/Modal.jsx';
import Button from './ui/Button.jsx';
import { Box, Typography } from '@mui/material';

export default function RsvpModal({ open, onClose, event, onSelect }) {
  return (
    <Modal open={open} onClose={onClose}>
      <Typography variant="h6" gutterBottom>
        RSVP to {event?.title}
      </Typography>
      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
        <Button onClick={() => onSelect('yes')}>Yes</Button>
        <Button onClick={() => onSelect('maybe')}>Maybe</Button>
        <Button onClick={() => onSelect('no')}>No</Button>
      </Box>
    </Modal>
  );
}
