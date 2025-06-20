import React, { useState, useEffect, useRef, Fragment } from 'react';
import { createRoot } from 'react-dom/client';
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
} from 'recharts';
import { Calendar } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';

export function App() {
  const [desks, setDesks] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [deskId, setDeskId] = useState('');
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [message, setMessage] = useState('');
  const [edit, setEdit] = useState(false);
  const [auth] = useState({ loading: false, isAuthenticated: true, user: { sub: 'anon' } });
  const [dailyStats, setDailyStats] = useState([]);
  const [weeklyStats, setWeeklyStats] = useState([]);
  const [forecast, setForecast] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const dragRef = useRef(null);
  const calRef = useRef(null);
  const [recLoading, setRecLoading] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [users, setUsers] = useState([]);
  const [showAdmin, setShowAdmin] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatLog, setChatLog] = useState([]);

  async function apiFetch(url, options = {}) {
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
        if (data.reply) setChatLog((l) => l.concat({ from: 'bot', text: data.reply }));
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
      ds.map((d) => (d.id === id ? { ...d, x: e.clientX - offsetX, y: e.clientY - offsetY } : d))
    );
  }

  async function endDrag() {
    if (!dragRef.current) return;
    const { id } = dragRef.current;
    dragRef.current = null;
    const desk = desks.find((d) => d.id === id);
    if (desk) {
      await apiFetch(`/desks/${id}`, {
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

  useEffect(() => {
    loadData();
    loadForecast();
    loadAlerts();
    loadUserInfo().then((info) => {
      if (info && info.role === 'admin') {
        loadUsers();
      }
    });
  }, []);

  useEffect(() => {
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
      cal.addEvent({ title: `Desk ${b.desk_id}`, start: b.start_time, end: b.end_time });
    });
  }, [bookings]);

  async function createBooking(e) {
    e.preventDefault();
    setMessage('');
    const res = await apiFetch('/bookings', {
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

  return (
    <div onMouseMove={handleMove} onMouseUp={endDrag}>
      <h1>Office Booking</h1>
      {/* Authentication removed */}
      <button onClick={() => setEdit(!edit)}>{edit ? 'Done Editing' : 'Edit Layout'}</button>
      {edit && (
        <button onClick={addDesk} style={{ marginLeft: '0.5em' }}>
          Add Desk
        </button>
      )}
      {userInfo && userInfo.role === 'admin' && (
        <button
          onClick={() => {
            setShowAdmin(!showAdmin);
            if (!showAdmin) loadUsers();
          }}
        >
          {showAdmin ? 'Close Admin' : 'Admin Panel'}
        </button>
      )}
      <div ref={calRef} style={{ maxWidth: 600, marginBottom: '1em' }} />
      <div
        style={{
          position: 'relative',
          width: 600,
          height: 400,
          border: '1px solid #ccc',
          marginBottom: '1em',
        }}
      >
        {desks.map((d) => (
          <div
            key={d.id}
            onMouseDown={(e) => startDrag(d, e)}
            style={{
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
            }}
          >
            {edit && (
              <button
                onClick={() => removeDesk(d.id)}
                style={{ position: 'absolute', top: 0, right: 0 }}
              >
                x
              </button>
            )}
            {d.id}
          </div>
        ))}
      </div>
      <form onSubmit={createBooking}>
        <select value={deskId} onChange={(e) => setDeskId(e.target.value)}>
          <option value="">Select desk</option>
          {desks.map((d) => (
            <option key={d.id} value={d.id}>
              Desk {d.id}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={loadRecommendation}
          disabled={recLoading}
          style={{ marginLeft: '0.5em' }}
        >
          {recLoading ? '...' : 'Get Recommended Desk'}
        </button>
        <input type="datetime-local" value={start} onChange={(e) => setStart(e.target.value)} />
        <input type="datetime-local" value={end} onChange={(e) => setEnd(e.target.value)} />
        <button type="submit">Book</button>
      </form>
      {message && <p>{message}</p>}
      <h2>Bookings</h2>
      <ul>
        {bookings.map((b) => (
          <li key={b.id}>
            Desk {b.desk_id} from {new Date(b.start_time).toLocaleString()} to{' '}
            {new Date(b.end_time).toLocaleString()}
          </li>
        ))}
      </ul>
      <h2>Daily Utilization</h2>
      <LineChart
        width={600}
        height={200}
        data={dailyStats.map((d) => ({
          day: new Date(d.day).toLocaleDateString(),
          bookings: d.bookings,
        }))}
      >
        <CartesianGrid stroke="#ccc" />
        <XAxis dataKey="day" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="bookings" stroke="#8884d8" />
      </LineChart>
      <h2>Weekly Utilization</h2>
      <BarChart
        width={600}
        height={200}
        data={weeklyStats.map((w) => ({
          week: new Date(w.week).toLocaleDateString(),
          bookings: w.bookings,
        }))}
      >
        <CartesianGrid stroke="#ccc" />
        <XAxis dataKey="week" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="bookings" fill="#82ca9d" />
      </BarChart>
      <h2>Monthly Heatmap</h2>
      {(() => {
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
        return (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(7, 20px)',
              gap: '2px',
              marginBottom: '1em',
            }}
          >
            {cells.map((c, idx) => (
              <div
                key={idx}
                title={`${c.day.toLocaleDateString()}: ${c.count} bookings`}
                style={{
                  width: '20px',
                  height: '20px',
                  backgroundColor: colorFor(c.count),
                }}
              />
            ))}
          </div>
        );
      })()}
      <h2>Forecast (Next 7 Days)</h2>
      <ul>
        {forecast.map((f, idx) => (
          <li key={idx}>{`${new Date(f.day).toLocaleDateString()}: ${f.bookings} bookings`}</li>
        ))}
      </ul>
      {alerts.length > 0 && (
        <Fragment>
          <h2>Alerts</h2>
          <ul>
            {alerts.map((a, idx) => (
              <li key={idx}>{`${new Date(a.day).toLocaleDateString()} high demand (${a.bookings} bookings)`}</li>
            ))}
          </ul>
        </Fragment>
      )}
      {showAdmin && (
        <div>
          <h2>User Roles</h2>
          <ul>
            {users.map((u) => (
              <li key={u.id}>
                {u.email}:{' '}
                <select value={u.role} onChange={(e) => updateRole(u.id, e.target.value)}>
                  <option value="user">user</option>
                  <option value="admin">admin</option>
                </select>
              </li>
            ))}
          </ul>
        </div>
      )}
      <h2>Assistant</h2>
      <div
        style={{
          maxWidth: 600,
          border: '1px solid #ccc',
          padding: '0.5em',
          height: 150,
          overflowY: 'auto',
          marginBottom: '0.5em',
        }}
      >
        {chatLog.map((m, idx) => (
          <div key={idx}>{`${m.from === 'user' ? 'You' : 'Bot'}: ${m.text}`}</div>
        ))}
      </div>
      <form onSubmit={sendChat} style={{ maxWidth: 600 }}>
        <input value={chatInput} onChange={(e) => setChatInput(e.target.value)} style={{ width: '80%' }} />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}

const root = createRoot(document.getElementById('root'));
root.render(<App />);
