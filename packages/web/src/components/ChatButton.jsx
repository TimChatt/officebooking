import React from 'react';

export default function ChatButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-4 right-4 z-40 h-12 w-12 rounded-full bg-primary text-white shadow-lg hover:bg-primary/90"
    >
      Chat
    </button>
  );
}
