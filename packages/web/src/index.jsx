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
