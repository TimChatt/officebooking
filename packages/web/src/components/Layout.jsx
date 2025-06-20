import React, { useState } from 'react';
import ChatButton from './ChatButton.jsx';
import ChatOverlay from './ChatOverlay.jsx';
import { ChatProvider } from '../context/ChatContext.jsx';
import AppShell from './AppShell.jsx';

export default function Layout({ children }) {
  const [open, setOpen] = useState(false);

  return (
    <ChatProvider>
      <AppShell>{children}</AppShell>
      <ChatButton onClick={() => setOpen(true)} />
      <ChatOverlay open={open} onClose={() => setOpen(false)} />
    </ChatProvider>
  );
}
