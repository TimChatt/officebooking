import React from 'react';
import { createRoot } from 'react-dom/client';

export function App() {
  return <h1>Office Booking</h1>;
}

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}
