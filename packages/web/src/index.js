let auth0Client;
const {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
} = window.Recharts;

const { Calendar } = window.FullCalendar;
const dayGridPlugin = window.dayGridPlugin;

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
  const [forecast, setForecast] = React.useState([]);
  const [alerts, setAlerts] = React.useState([]);
  const dragRef = React.useRef(null);
  const calRef = React.useRef(null);
  const [recLoading, setRecLoading] = React.useState(false);
  const [userInfo, setUserInfo] = React.useState(null);
  const [users, setUsers] = React.useState([]);
  const [showAdmin, setShowAdmin] = React.useState(false);
  const [chatInput, setChatInput] = React.useState('');
  const [chatLog, setChatLog] = React.useState([]);
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
      const desksRes = await apiFetch('/desks');
      setDesks(await desksRes.json());
      const bookingsRes = await apiFetch('/bookings');
      setBookings(await bookingsRes.json());
      const dailyRes = await apiFetch('/analytics/daily');
      setDailyStats(await dailyRes.json());
      const weeklyRes = await apiFetch('/analytics/weekly');
      setWeeklyStats(await weeklyRes.json());
    } catch (err) {
      console.error(err);
    }
  }

  async function loadForecast() {
    try {
      const res = await fetch('/forecast');
      if (res.ok) {
        const data = await res.json();
        setForecast(data.forecast);
      }
    } catch (err) {
      console.error(err);
    }
  }

  async function loadUserInfo() {
    if (!auth.isAuthenticated) return;
    const res = await apiFetch('/users/me', { method: 'POST' });
    if (res.ok) {
      const data = await res.json();
      setUserInfo(data);
      return data;
    }
  }

  async function loadUsers() {
    if (!auth.isAuthenticated) return;
    const res = await apiFetch('/users');
    if (res.ok) {
      const data = await res.json();
      setUsers(data);
    }
  }

  async function updateRole(id, role) {
    await apiFetch(`/users/${id}/role`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role }),
    });
    loadUsers();
  }

  async function sendChat(e) {
    e.preventDefault();
    const msg = chatInput.trim();
    if (!msg) return;
    setChatLog((l) => l.concat({ from: 'user', text: msg }));
    setChatInput('');
    try {
      const res = await apiFetch('/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: msg }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.reply)
          setChatLog((l) => l.concat({ from: 'bot', text: data.reply }));
      }
    } catch (err) {
      console.error(err);
    }
  }

  async function loadAlerts() {
    try {
      const res = await fetch('/alerts');
      if (res.ok) {
        const data = await res.json();
        setAlerts(data.alerts);
      }
=======
  async function loadAlerts() {
    try {
      const res = await fetch('/alerts');
      if (res.ok) {
        const data = await res.json();
        setAlerts(data.alerts);
      }
=======

  const dragRef = React.useRef(null);
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
      await fetch(`/desks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(desk),
      });
    }
  }

    { onMouseMove: handleMove, onMouseUp: endDrag },
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
  const dragRef = React.useRef(null);

  async function loadData() {
    try {
      const desksRes = await fetch('/desks');
      setDesks(await desksRes.json());
      const bookingsRes = await fetch('/bookings');
      setBookings(await bookingsRes.json());
    } catch (err) {
      console.error(err);
    }
  }

  async function loadRecommendation() {
    setRecLoading(true);
    try {
      const res = await apiFetch('/recommendation');
      if (res.ok) {
        const desk = await res.json();
        setDeskId(String(desk.id));
      }
    } finally {
      setRecLoading(false);
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
      await apiFetch(`/desks/${id}`, {

      await fetch(`/desks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(desk),
      });
    }
  }

  async function addDesk() {
    const res = await apiFetch('/desks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ x: 10, y: 10, width: 50, height: 50 }),
    });
    if (res.ok) {
      const desk = await res.json();
      setDesks((ds) => ds.concat(desk));
    }
  }

  async function removeDesk(id) {
    const res = await apiFetch(`/desks/${id}`, {
      method: 'DELETE',
    });
    if (res.ok) {
      setDesks((ds) => ds.filter((d) => d.id !== id));
    }
  }

  React.useEffect(() => {
    configureAuth(setAuth).then(() => {
      loadData();
      loadForecast();
      loadAlerts();
      loadUserInfo().then((info) => {
        if (info && info.role === 'admin') {
          loadUsers();
        }
      });
    });
  }, []);

  React.useEffect(() => {
    if (!calRef.current) return;
    if (!calRef.current._calendar) {
      calRef.current._calendar = new Calendar(calRef.current, {
        plugins: [dayGridPlugin],
        initialView: 'dayGridMonth',
        selectable: true,
        select: (info) => {
          setStart(info.startStr);
          setEnd(info.endStr);
        },
      });
      calRef.current._calendar.render();
    }
    const cal = calRef.current._calendar;
    cal.removeAllEvents();
    bookings.forEach((b) => {
      cal.addEvent({
        title: `Desk ${b.desk_id}`,
        start: b.start_time,
        end: b.end_time,
      });
    });
  }, [bookings]);

  React.useEffect(() => {
    configureAuth(setAuth).then(() => {
      loadData();
    });

    loadData();
  }, []);

  async function createBooking(e) {
    e.preventDefault();
    setMessage('');
    const res = await apiFetch('/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id: auth.user ? auth.user.sub : 'anonymous',

    const res = await fetch('/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id: 'anonymous',
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
    edit &&
      React.createElement(
        'button',
        { onClick: addDesk, style: { marginLeft: '0.5em' } },
        'Add Desk'
      ),
    userInfo && userInfo.role === 'admin' &&
      React.createElement(
        'button',
        { onClick: () => {
            setShowAdmin(!showAdmin);
            if (!showAdmin) loadUsers();
          } },
        showAdmin ? 'Close Admin' : 'Admin Panel'
      ),
      React.createElement('div', { ref: calRef, style: { maxWidth: 600, marginBottom: '1em' } }),
      React.createElement(
        'div',
        {
          style: {
            position: 'relative',
         
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
          edit &&
            React.createElement(
              'button',
              {
                onClick: () => removeDesk(d.id),
                style: {
                  position: 'absolute',
                  top: 0,
                  right: 0,
                },
              },
              'x'
            ),
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
      React.createElement(
        'button',
        {
          type: 'button',
          onClick: loadRecommendation,
          disabled: recLoading,
          style: { marginLeft: '0.5em' },
        },
        recLoading ? '...' : 'Get Recommended Desk'
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
      LineChart,
      {
        width: 600,
        height: 200,
        data: dailyStats.map((d) => ({
          day: new Date(d.day).toLocaleDateString(),
          bookings: d.bookings,
        })),
      },
      React.createElement(CartesianGrid, { stroke: '#ccc' }),
      React.createElement(XAxis, { dataKey: 'day' }),
      React.createElement(YAxis, null),
      React.createElement(Tooltip, null),
      React.createElement(Line, { type: 'monotone', dataKey: 'bookings', stroke: '#8884d8' })
    ),
    React.createElement('h2', null, 'Weekly Utilization'),
    React.createElement(
      BarChart,
      {
        width: 600,
        height: 200,
        data: weeklyStats.map((w) => ({
          week: new Date(w.week).toLocaleDateString(),
          bookings: w.bookings,
        })),
      },
      React.createElement(CartesianGrid, { stroke: '#ccc' }),
      React.createElement(XAxis, { dataKey: 'week' }),
      React.createElement(YAxis, null),
      React.createElement(Tooltip, null),
      React.createElement(Bar, { dataKey: 'bookings', fill: '#82ca9d' })
    ),
    React.createElement('h2', null, 'Monthly Heatmap'),
    (() => {
      const counts = {};
      dailyStats.forEach((d) => {
        counts[new Date(d.day).toDateString()] = d.bookings;
      });
      const today = new Date();
      const start = new Date();
      start.setDate(today.getDate() - 34);
      const cells = [];
      let max = 0;
      for (let i = 0; i < 35; i++) {
        const day = new Date(start);
        day.setDate(start.getDate() + i);
        const count = counts[day.toDateString()] || 0;
        if (count > max) max = count;
        cells.push({ day, count });
      }
      function colorFor(c) {
        if (c === 0) return '#eee';
        const level = c / (max || 1);
        if (level > 0.75) return '#196127';
        if (level > 0.5) return '#239a3b';
        if (level > 0.25) return '#7bc96f';
        return '#c6e48b';
      }
      return React.createElement(
        'div',
        {
          style: {
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 20px)',
            gap: '2px',
            marginBottom: '1em',
          },
        },
        cells.map((c, idx) =>
          React.createElement('div', {
            key: idx,
            title: `${c.day.toLocaleDateString()}: ${c.count} bookings`,
            style: {
              width: '20px',
              height: '20px',
              backgroundColor: colorFor(c.count),
            },
          })
        )
      );
    })(),
    React.createElement('h2', null, 'Forecast (Next 7 Days)'),
    React.createElement(
      'ul',
      null,
      forecast.map((f, idx) =>
        React.createElement(
          'li',
          { key: idx },
          `${new Date(f.day).toLocaleDateString()}: ${f.bookings} bookings`
        )
      )
    ),
    alerts.length > 0 &&
      React.createElement(
        React.Fragment,
        null,
        React.createElement('h2', null, 'Alerts'),
        React.createElement(
          'ul',
          null,
          alerts.map((a, idx) =>
            React.createElement(
              'li',
              { key: idx },
              `${new Date(a.day).toLocaleDateString()} high demand (${a.bookings} bookings)`
            )
          )
        )
    showAdmin &&
      React.createElement(
        'div',
        null,
        React.createElement('h2', null, 'User Roles'),
        React.createElement(
          'ul',
          null,
          users.map((u) =>
            React.createElement(
              'li',
              { key: u.id },
              `${u.email}: `,
              React.createElement(
                'select',
                {
                  value: u.role,
                  onChange: (e) => updateRole(u.id, e.target.value),
                },
                React.createElement('option', { value: 'user' }, 'user'),
                React.createElement('option', { value: 'admin' }, 'admin')
              )
            )
          )
        )
      ),
    React.createElement('h2', null, 'Assistant'),
    React.createElement(
      'div',
      {
        style: {
          maxWidth: 600,
          border: '1px solid #ccc',
          padding: '0.5em',
          height: 150,
          overflowY: 'auto',
          marginBottom: '0.5em',
        },
      },
      chatLog.map((m, idx) =>
        React.createElement(
          'div',
          { key: idx },
          `${m.from === 'user' ? 'You' : 'Bot'}: ${m.text}`
        )
      )
    ),
    React.createElement(
      'form',
      { onSubmit: sendChat, style: { maxWidth: 600 } },
      React.createElement('input', {
        value: chatInput,
        onChange: (e) => setChatInput(e.target.value),
        style: { width: '80%' },
      }),
      React.createElement('button', { type: 'submit' }, 'Send')
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

  React.useEffect(() => {
    fetch('/desks')
      .then((res) => res.json())
      .then(setDesks)
      .catch(console.error);
  }, []);

  return React.createElement(
    'div',
    null,
    React.createElement('h1', null, 'Office Booking'),
    React.createElement(
      'ul',
      null,
      desks.map((d) =>
        React.createElement('li', { key: d.id }, `Desk ${d.id}: (${d.x}, ${d.y})`)
      )
    )
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(App));
