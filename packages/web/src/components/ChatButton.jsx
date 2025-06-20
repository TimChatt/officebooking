import React from 'react';
import Fab from '@mui/material/Fab';
import ChatIcon from '@mui/icons-material/Chat';

export default function ChatButton({ onClick }) {
  return (
    <Fab
      color="primary"
      onClick={onClick}
      sx={{ position: 'fixed', bottom: 16, right: 16, zIndex: 40 }}
      aria-label="Open chat"
    >
      <ChatIcon />
    </Fab>
  );
}
