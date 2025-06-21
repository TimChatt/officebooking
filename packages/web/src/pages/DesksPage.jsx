import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import Modal from '../components/ui/Modal.jsx';
import Button from '../components/ui/Button.jsx';
import { Box, Typography, TextField, MenuItem } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';

// Scale factor for converting desk units to pixels
const SCALE = 40;
const COMPANIES = ['Hawk-Eye', 'Pulselive', 'Beyond Sports', 'KinaTrax', 'Sony Sports'];

export default function DesksPage() {
  const [desks, setDesks] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [bookingDesk, setBookingDesk] = useState(null);
  const [currentBooking, setCurrentBooking] = useState(null);
  const [booking, setBooking] = useState({
    name: 'Anon',
    team: '',
    company: COMPANIES[0],
    date: dayjs(),
  });
  const [drag, setDrag] = useState(null);
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [bookings, setBookings] = useState([]);

  async function load() {
    const res = await fetch('/api/desks');
    if (res.ok) setDesks(await res.json());
  }

  async function loadBookings(date) {
    const start = dayjs(date).startOf('day');
    const end = dayjs(date).endOf('day');
    const res = await fetch(`/api/bookings?start=${start.toISOString()}&end=${end.toISOString()}`);
    if (!res.ok) return;
    setBookings(await res.json());
  }

  useEffect(() => { load(); }, []);
  useEffect(() => { loadBookings(selectedDate); }, [selectedDate]);

  async function addDesk() {
    await fetch('/api/desks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ x: 1, y: 1, width: 1, height: 1 })
    });
    setShowAdd(false);
    load();
  }

  async function removeDesk(id) {
    await fetch(`/api/desks/${id}`, { method: 'DELETE' });
    setBookingDesk(null);
    load();
  }

  function startDrag(d, e) {
    e.preventDefault();
    setDrag({
      id: d.id,
      offsetX: e.clientX - d.x * SCALE,
      offsetY: e.clientY - d.y * SCALE,
      moved: false
    });
  }

  function onMouseMove(e) {
    if (!drag) return;
    setDesks(ds =>
      ds.map(d =>
        d.id === drag.id
          ? {
              ...d,
              x: Math.max(0, Math.round((e.clientX - drag.offsetX) / SCALE)),
              y: Math.max(0, Math.round((e.clientY - drag.offsetY) / SCALE))
            }
          : d
      )
    );
    if (!drag.moved) setDrag({ ...drag, moved: true });
  }

  async function endDrag() {
    if (!drag) return;
    const d = desks.find(dd => dd.id === drag.id);
    setDrag(null);
    if (!drag.moved) {
      const existing = bookings.find(b => b.desk_id === d.id);
      setCurrentBooking(existing || null);
      setBookingDesk(d);
      setBooking({ name: 'Anon', team: '', company: COMPANIES[0], date: selectedDate });
      return;
    }
    await fetch(`/api/desks/${d.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(d)
    });
  }

  async function submitBooking(e) {
    e.preventDefault();
    if (!bookingDesk) return;
    await fetch('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id: 'anon',
        desk_id: bookingDesk.id,
        start_time: dayjs(booking.date).startOf('day').toISOString(),
        end_time: dayjs(booking.date).endOf('day').toISOString(),
        name: booking.name,
        team: booking.team,
        company: booking.company,
      })
    });
    setBookingDesk(null);
    loadBookings(selectedDate);
  }

  function getDeskInfo(id) {
    const b = bookings.find((bk) => bk.desk_id === id);
    if (!b) return { status: 'available', booking: null };
    return { status: b.user_id === 'anon' ? 'mine' : 'booked', booking: b };
  }

  function deskColor(status) {
    if (status === 'booked') return 'error.light';
    if (status === 'mine') return 'success.light';
    return 'background.paper';
  }

  return (
    <Layout>
      <Box onMouseMove={onMouseMove} onMouseUp={endDrag} onMouseLeave={endDrag}>
        <Typography variant="h5" gutterBottom>
          Floor Plan
        </Typography>

        <Box mb={2} maxWidth={200}>
          <DatePicker
            label="Select Date"
            value={selectedDate}
            onChange={(v) => v && setSelectedDate(v)}
            slotProps={{ textField: { size: 'small', fullWidth: true } }}
          />
        </Box>

        <Box mb={2}>
          <Button onClick={() => setShowAdd(true)}>Add New Desk</Button>
        </Box>

        <Box
          sx={{ position: 'relative', width: '100%', height: '70vh', border: '1px solid #ddd', borderRadius: 1, bgcolor: '#f1f5f9', overflow: 'hidden' }}
        >
          {desks.map((d) => (
            <Box
              key={d.id}
              onMouseDown={(e) => startDrag(d, e)}
              sx={{
                position: 'absolute',
                left: d.x * SCALE,
                top: d.y * SCALE,
                width: d.width * SCALE,
                height: d.height * SCALE,
                bgcolor: deskColor(getDeskInfo(d.id).status),
                border: '1px solid #cbd5e1',
                fontSize: 12,
                fontWeight: 500,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 1,
                cursor: 'move',
                boxShadow: 1,
                '&:hover': { boxShadow: 3 },
                userSelect: 'none',
              }}
            >
              {getDeskInfo(d.id).booking ? (
                <Box sx={{ textAlign: 'center' }}>
                  <div>{getDeskInfo(d.id).booking.name}</div>
                  <div style={{ fontSize: 10 }}>{getDeskInfo(d.id).booking.team}</div>
                </Box>
              ) : (
                `Desk ${d.id}`
              )}
            </Box>
          ))}
        </Box>

        <Modal open={showAdd} onClose={() => setShowAdd(false)}>
          <Typography variant="h6" gutterBottom>
            Add a New Desk
          </Typography>
          <Button onClick={addDesk}>Create Desk</Button>
        </Modal>

        <Modal open={!!bookingDesk} onClose={() => setBookingDesk(null)}>
          <Typography variant="h6" gutterBottom>
            Book Desk {bookingDesk?.id}
          </Typography>
          {currentBooking ? (
            <Typography sx={{ mb: 2 }}>
              Booked by {currentBooking.name} ({currentBooking.team}, {currentBooking.company})
            </Typography>
          ) : null}
        <Box component="form" onSubmit={submitBooking} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField label="Name" size="small" fullWidth value={booking.name} onChange={(e) => setBooking({ ...booking, name: e.target.value })} />
          <TextField label="Team" size="small" fullWidth value={booking.team} onChange={(e) => setBooking({ ...booking, team: e.target.value })} />
          <TextField select label="Company" size="small" fullWidth value={booking.company} onChange={(e) => setBooking({ ...booking, company: e.target.value })}>
            {COMPANIES.map((c) => (
              <MenuItem key={c} value={c}>{c}</MenuItem>
            ))}
          </TextField>
          <DatePicker label="Date" value={booking.date} onChange={(v) => v && setBooking({ ...booking, date: v })} slotProps={{ textField: { size: 'small', fullWidth: true } }} />
          {!currentBooking && (
            <Button type="submit" fullWidth>
              Book Desk
            </Button>
          )}
          <Button color="error" onClick={() => removeDesk(bookingDesk.id)} fullWidth>
            Delete Desk
          </Button>
        </Box>
        </Modal>
      </Box>
    </Layout>
  );
}
