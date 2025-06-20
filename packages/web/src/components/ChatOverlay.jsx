import React, { useState } from 'react';
import Button from './ui/Button.jsx';
import { useChat } from '../context/ChatContext.js';

export default function ChatOverlay({ open, onClose }) {
  const { messages, loading, sendMessage } = useChat();
  const [text, setText] = useState('');

  if (!open) return null;

  async function submit(e) {
    e.preventDefault();
    if (!text.trim()) return;
    await sendMessage(text.trim());
    setText('');
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div
        className="absolute inset-0 bg-black/50"
        aria-hidden="true"
        onClick={onClose}
      />
      <div className="relative z-10 flex h-full w-full max-w-sm flex-col bg-white p-4 shadow-lg">
        <div className="mb-2 flex justify-between">
          <h2 className="text-lg font-semibold">Chatbot</h2>
          <button onClick={onClose}>×</button>
        </div>
        <div className="flex-1 overflow-y-auto space-y-2 mb-2">
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
