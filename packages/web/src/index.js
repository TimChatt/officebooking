let auth0Client;

async function configureAuth(setAuthState) {
  const res = await fetch('../auth_config.json');
  const config = await res.json();
  auth0Client = await createAuth0Client({
    domain: config.domain,
    clientId: config.clientId,
    audience: config.audience,
  });

  if (window.location.search.includes('code=')) {
    await auth0Client.handleRedirectCallback();
    window.history.replaceState({}, document.title, '/');
  }

  const isAuthenticated = await auth0Client.isAuthenticated();
  const user = isAuthenticated ? await auth0Client.getUser() : null;
  setAuthState({ isAuthenticated, user, loading: false });
}

function App() {
  const [desks, setDesks] = React.useState([]);
  const [bookings, setBookings] = React.useState([]);
  const [deskId, setDeskId] = React.useState('');
  const [start, setStart] = React.useState('');
  const [end, setEnd] = React.useState('');
  const [message, setMessage] = React.useState('');
  const [edit, setEdit] = React.useState(false);
  const [auth, setAuth] = React.useState({ loading: true, isAuthenticated: false, user: null });
  const [dailyStats, setDailyStats] = React.useState([]);
  const [weeklyStats, setWeeklyStats] = React.useState([]);
  const dragRef = React.useRef(null);

  async function apiFetch(url, options = {}) {
    if (auth.isAuthenticated) {
      const token = await auth0Client.getTokenSilently();
      options.headers = Object.assign({}, options.headers, {
        Authorization: `Bearer ${token}`,
      });
    }
    return fetch(url, options);
  }

  async function loadData() {
    try {
      const desksRes = await apiFetch('http://localhost:3000/desks');
      setDesks(await desksRes.json());
      const bookingsRes = await apiFetch('http://localhost:3000/bookings');
      setBookings(await bookingsRes.json());
      const dailyRes = await apiFetch('http://localhost:3000/analytics/daily');
      setDailyStats(await dailyRes.json());
      const weeklyRes = await apiFetch('http://localhost:3000/analytics/weekly');
      setWeeklyStats(await weeklyRes.json());
    } catch (err) {
      console.error(err);
    }
  }

  function startDrag(desk, e) {
    if (!edit) return;
    dragRef.current = {
      id: desk.id,
      offsetX: e.clientX - desk.x,
      offsetY: e.clientY - desk.y,
    };
  }

  function handleMove(e) {
    if (!dragRef.current) return;
    const { id, offsetX, offsetY } = dragRef.current;
    setDesks((ds) =>
      ds.map((d) =>
        d.id === id ? { ...d, x: e.clientX - offsetX, y: e.clientY - offsetY } : d
      )
    );
  }

  async function endDrag() {
    if (!dragRef.current) return;
    const { id } = dragRef.current;
    dragRef.current = null;
    const desk = desks.find((d) => d.id === id);
    if (desk) {
      await apiFetch(`http://localhost:3000/desks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(desk),
      });
    }
  }

  React.useEffect(() => {
    configureAuth(setAuth).then(() => {
      loadData();
    });
  }, []);

  async function createBooking(e) {
    e.preventDefault();
    setMessage('');
    const res = await apiFetch('http://localhost:3000/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id: auth.user ? auth.user.sub : 'anonymous',
        desk_id: Number(deskId),
        start_time: start,
        end_time: end,
      }),
    });
    if (res.ok) {
      setMessage('Booked!');
      setDeskId('');
      setStart('');
      setEnd('');
      loadData();
    } else {
      const data = await res.json().catch(() => ({}));
      setMessage(data.error || 'Error booking');
    }
  }

  return React.createElement(
    'div',
    { onMouseMove: handleMove, onMouseUp: endDrag },
    React.createElement('h1', null, 'Office Booking'),
    auth.loading
      ? React.createElement('p', null, 'Loading auth...')
      : auth.isAuthenticated
      ? React.createElement(
          'button',
          { onClick: () => auth0Client.logout({ returnTo: window.location.origin }) },
          `Logout (${auth.user.name || auth.user.email})`
        )
      : React.createElement(
          'button',
          { onClick: () => auth0Client.loginWithRedirect({ redirect_uri: window.location.origin }) },
          'Login'
        ),
    React.createElement(
      'button',
      { onClick: () => setEdit(!edit) },
      edit ? 'Done Editing' : 'Edit Layout'
    ),
    React.createElement(
      'div',
      {
        style: {
          position: 'relative',
          width: 600,
          height: 400,
          border: '1px solid #ccc',
          marginBottom: '1em',
        },
      },
      desks.map((d) =>
        React.createElement(
          'div',
          {
            key: d.id,
            onMouseDown: (e) => startDrag(d, e),
            style: {
              position: 'absolute',
              left: d.x,
              top: d.y,
              width: d.width,
              height: d.height,
              backgroundColor: '#def',
              border: '1px solid #333',
              cursor: edit ? 'move' : 'default',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              userSelect: 'none',
            },
          },
          d.id
        )
      )
    ),
    React.createElement(
      'form',
      { onSubmit: createBooking },
      React.createElement(
        'select',
        {
          value: deskId,
          onChange: (e) => setDeskId(e.target.value),
        },
        React.createElement('option', { value: '' }, 'Select desk'),
        desks.map((d) =>
          React.createElement(
            'option',
            { key: d.id, value: d.id },
            `Desk ${d.id}`
          )
        )
      ),
      React.createElement('input', {
        type: 'datetime-local',
        value: start,
        onChange: (e) => setStart(e.target.value),
      }),
      React.createElement('input', {
        type: 'datetime-local',
        value: end,
        onChange: (e) => setEnd(e.target.value),
      }),
      React.createElement('button', { type: 'submit' }, 'Book')
    ),
    message && React.createElement('p', null, message),
    React.createElement('h2', null, 'Bookings'),
    React.createElement(
      'ul',
      null,
      bookings.map((b) =>
        React.createElement(
          'li',
          { key: b.id },
          `Desk ${b.desk_id} from ${new Date(b.start_time).toLocaleString()} to ${new Date(b.end_time).toLocaleString()}`
        )
      )
    ),
    React.createElement('h2', null, 'Daily Utilization'),
    React.createElement(
      'ul',
      null,
      dailyStats.map((d, idx) =>
        React.createElement(
          'li',
          { key: idx },
          `${new Date(d.day).toLocaleDateString()}: ${d.bookings}`
        )
      )
    ),
    React.createElement('h2', null, 'Weekly Utilization'),
    React.createElement(
      'ul',
      null,
      weeklyStats.map((w, idx) =>
        React.createElement(
          'li',
          { key: idx },
          `${new Date(w.week).toLocaleDateString()}: ${w.bookings}`
        )
      )
    )
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(App));
