import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ChatIcon from '@mui/icons-material/Chat';
import CloseIcon from '@mui/icons-material/Close';
import { useChat } from '../context/ChatContext.jsx';
import Button from './ui/Button.jsx';

export default function ChatWidget() {
  const { messages, loading, sendMessage } = useChat();
  const [open, setOpen] = useState(false);
  const [text, setText] = useState('');
  const messagesRef = useRef(null);

  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [messages]);


  async function submit(e) {
    e.preventDefault();
    if (!text.trim()) return;
    await sendMessage(text.trim());
    setText('');
  }


  return (
    <div style={{ position: 'fixed', bottom: 16, right: 16, zIndex: 50 }}>
      <AnimatePresence initial={false} mode="wait">
        {open ? (
          <motion.div
            key="chat"
            initial={{ opacity: 0, scale: 0.3 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.3 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            className="chat-window"
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <strong>Booking Assistant</strong>
              <button onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }} aria-label="Close chat">
                <CloseIcon />
              </button>
            </div>
            <div ref={messagesRef} style={{ flex: 1, overflowY: 'auto', marginBottom: 8 }}>
              {messages.map((m, idx) => (
                <div key={idx} style={{ textAlign: m.from === 'user' ? 'right' : 'left' }}>
                  <span style={{ display: 'inline-block', background: '#f3f4f6', padding: '4px 8px', borderRadius: 4 }}>
                    {m.content}
                  </span>
                </div>
              ))}
              {loading && <div style={{ textAlign: 'center', color: '#666' }}>...</div>}
            </div>
            <form onSubmit={submit} style={{ display: 'flex', gap: 4 }}>
              <input
                style={{ flex: 1, padding: 8, borderRadius: 4, border: '1px solid #ccc', fontSize: '14px' }}
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
              <Button type="submit" disabled={loading || !text.trim()}>Send</Button>
            </form>
          </motion.div>
        ) : (
          <motion.button
            key="button"
            className="chat-trigger"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            onClick={() => setOpen(true)}
            aria-label="Open chat"
          >
            <ChatIcon />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
