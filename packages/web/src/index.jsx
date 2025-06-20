import React, { useState, useEffect, useCallback } from 'react';
import { createRoot } from 'react-dom/client';
import UtilizationChart from './UtilizationChart';

function AdminDesks() {
  const [desks, setDesks] = useState([]);

  const load = useCallback(() => {
    fetch('/desks')
      .then((r) => r.json())
      .then(setDesks);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const action = (id, op) => {
    fetch(`/admin/desks/${id}/${op}`, {
      method: 'POST',
      headers: { 'x-user-role': 'admin' },
    }).then(load);
  };

  return (
    <div>
      <h1>Admin Desk Management</h1>
      <ul>
        {desks.map((d) => (
          <li key={d.id}>
            {`Desk ${d.id} - ${d.status} `}
            {d.status === 'blocked' ? (
              <button onClick={() => action(d.id, 'unblock')}>Unblock</button>
            ) : (
              <button onClick={() => action(d.id, 'block')}>Block</button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

function App() {
  const [desks, setDesks] = useState([]);

  useEffect(() => {
    fetch('/desks')
      .then((res) => res.json())
      .then(setDesks)
      .catch(console.error);
  }, []);

  if (window.location.pathname.startsWith('/admin')) {
    return <AdminDesks />;
  }

  return (
    <div>
      <h1>Office Booking</h1>
      <UtilizationChart />
      <ul>
        {desks.map((d) => (
          <li key={d.id}>Desk {d.id}: ({d.x}, {d.y})</li>
        ))}
      </ul>
    </div>
  );
}

const root = createRoot(document.getElementById('root'));
root.render(<App />);
