import React from 'react';
import { createRoot } from 'react-dom/client';
import UtilizationChart from './UtilizationChart';

function DeskList() {
  const [desks, setDesks] = React.useState([]);
  React.useEffect(() => {
    fetch('http://localhost:3000/desks')
      .then((res) => res.json())
      .then(setDesks)
      .catch(console.error);
  }, []);

  return (
    <ul>
      {desks.map((d) => (
        <li key={d.id}>{`Desk ${d.id}: (${d.x}, ${d.y})`}</li>
      ))}
    </ul>
  );
}

function AdminDesks() {
  const [desks, setDesks] = React.useState([]);

  const load = React.useCallback(() => {
    fetch('http://localhost:3000/desks')
      .then((r) => r.json())
      .then(setDesks);
  }, []);

  React.useEffect(() => {
    load();
  }, [load]);

  const action = (id, op) => {
    fetch(`http://localhost:3000/admin/desks/${id}/${op}`, {
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

  return (
    <div>
      <h1>Office Booking</h1>
      <UtilizationChart />

  if (window.location.pathname.startsWith('/admin')) {
    return <AdminDesks />;
  }

  return (
    <div>
      <h1>Office Booking</h1>
      <DeskList />

    </div>
  );
}

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);

