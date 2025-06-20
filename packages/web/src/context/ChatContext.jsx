import React, { createContext, useContext, useState } from 'react';

const ChatContext = createContext();

export function ChatProvider({ children }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  async function sendMessage(text) {
    const userMsg = { from: 'user', content: text };
    setMessages((m) => [...m, userMsg]);
    setLoading(true);
    try {
      const res = await fetch('/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.reply) {
          setMessages((m) => [...m, { from: 'bot', content: data.reply }]);
        }
      }
    } catch (err) {
      console.error('chat failed', err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <ChatContext.Provider value={{ messages, loading, sendMessage }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  return useContext(ChatContext);
}
