import React from 'react';
import { createRoot } from 'react-dom/client';
import UtilizationChart from './UtilizationChart';

function App() {
  return (
    <div>
      <h1>Office Booking</h1>
      <UtilizationChart />
    </div>
  );
}

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);

