import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { Auth0Provider, useAuth0 } from '@auth0/auth0-react';

function App() {
  const { loginWithRedirect, logout, isAuthenticated, getAccessTokenSilently } = useAuth0();
  const [desks, setDesks] = useState([]);

  useEffect(() => {
    if (isAuthenticated) {
      getAccessTokenSilently().then((token) => {
        localStorage.setItem('access_token', token);
        fetch('http://localhost:3000/desks', {
          headers: { Authorization: `Bearer ${token}` },
        })
          .then((res) => res.json())
          .then(setDesks)
          .catch(console.error);
      });
    } else {
      setDesks([]);
      localStorage.removeItem('access_token');
    }
  }, [isAuthenticated, getAccessTokenSilently]);

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
      {isAuthenticated ? (
        <>
          <button onClick={() => logout({ returnTo: window.location.origin })}>Log Out</button>
          <ul>
            {desks.map((d) => (
              <li key={d.id}>
                Desk {d.id}: ({d.x}, {d.y})
              </li>
            ))}
          </ul>
        </>
      ) : (
        <button onClick={() => loginWithRedirect()}>Log In</button>
      )}

      <DeskList />

    </div>
  );
}

const container = document.getElementById('root');
const root = createRoot(container);
root.render(
  <Auth0Provider
    domain={import.meta.env.VITE_AUTH0_DOMAIN}
    clientId={import.meta.env.VITE_AUTH0_CLIENT_ID}
    authorizationParams={{
      audience: import.meta.env.VITE_AUTH0_AUDIENCE,
      redirect_uri: window.location.origin,
    }}
    cacheLocation="localstorage"
  >
    <App />
  </Auth0Provider>
);

root.render(<App />);


