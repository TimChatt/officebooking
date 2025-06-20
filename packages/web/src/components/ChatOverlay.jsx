import React, { useState, useRef, useEffect } from 'react';
import Button from './ui/Button.jsx';
import { useChat } from '../context/ChatContext.jsx';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import Box from '@mui/material/Box';

export default function ChatOverlay({ open, onClose }) {
  const { messages, loading, sendMessage } = useChat();
  const [text, setText] = useState('');
  const messagesRef = useRef(null);

  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    function handleKey(e) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  async function submit(e) {
    e.preventDefault();
    if (!text.trim()) return;
    await sendMessage(text.trim());
    setText('');
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogContent>
        <Box sx={{ mb: 1, display: 'flex', justifyContent: 'space-between' }}>
          <h2>Chatbot</h2>
          <button onClick={onClose}>×</button>
        </Box>
        <Box ref={messagesRef} sx={{ mb: 2, maxHeight: 300, overflowY: 'auto' }}>
          {messages.map((m, idx) => (
            <Box key={idx} textAlign={m.from === 'user' ? 'right' : 'left'}>
              <Box
                component="span"
                sx={{ display: 'inline-block', background: '#f3f4f6', px: 1, py: 0.5, borderRadius: 1 }}
              >
                {m.content}
              </Box>
            </Box>
          ))}
          {loading && (
            <Box textAlign="center" color="text.secondary">
              ...
            </Box>
          )}
        </Box>
        <Box component="form" onSubmit={submit} sx={{ display: 'flex', gap: 1 }}>
          <input
            style={{ flex: 1, padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <Button type="submit" disabled={loading || !text.trim()}>Send</Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
