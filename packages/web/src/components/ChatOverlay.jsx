import React, { useState, useRef, useEffect } from 'react';
import clsx from 'clsx';
import Button from './ui/Button.jsx';
import { useChat } from '../context/ChatContext.jsx';

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
    <div className={clsx('fixed inset-0 z-50 flex justify-center sm:justify-end', !open && 'pointer-events-none')}>
      <div
        className={clsx(
          'absolute inset-0 bg-black/50 transition-opacity',
          open ? 'opacity-100' : 'opacity-0'
        )}
        aria-hidden="true"
        onClick={onClose}
      />
      <div
        className={clsx(
          'relative z-10 flex h-3/4 w-full max-w-sm flex-col bg-white p-4 shadow-lg transition-transform duration-300 sm:h-full',
          open ? 'translate-y-0 sm:translate-x-0' : 'translate-y-full sm:translate-x-full'
        )}
      >
        <div className="mb-2 flex justify-between">
          <h2 className="text-lg font-semibold">Chatbot</h2>
          <button onClick={onClose}>×</button>
        </div>
        <div ref={messagesRef} className="flex-1 overflow-y-auto space-y-2 mb-2">
          {messages.map((m, idx) => (
            <div key={idx} className={m.from === 'user' ? 'text-right' : ''}>
              <span className="inline-block rounded bg-gray-100 px-2 py-1">
                {m.content}
              </span>
            </div>
          ))}
          {loading && <div className="text-center text-gray-500">...</div>}
        </div>
        <form onSubmit={submit} className="mt-auto flex space-x-2">
          <input
            className="flex-1 rounded border p-2"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <Button type="submit" disabled={loading || !text.trim()}>
            Send
          </Button>
        </form>
      </div>
    </div>
  );
}
