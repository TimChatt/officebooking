function App() {
  const [desks, setDesks] = React.useState([]);
  const [bookings, setBookings] = React.useState([]);
  const [deskId, setDeskId] = React.useState('');
  const [start, setStart] = React.useState('');
  const [end, setEnd] = React.useState('');
  const [message, setMessage] = React.useState('');

  async function loadData() {
    try {
      const desksRes = await fetch('http://localhost:3000/desks');
      setDesks(await desksRes.json());
      const bookingsRes = await fetch('http://localhost:3000/bookings');
      setBookings(await bookingsRes.json());
    } catch (err) {
      console.error(err);
    }
  }

  React.useEffect(() => {
    loadData();
  }, []);

  async function createBooking(e) {
    e.preventDefault();
    setMessage('');
    const res = await fetch('http://localhost:3000/bookings', {
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
    null,
    React.createElement('h1', null, 'Office Booking'),
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
    )
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(App));
