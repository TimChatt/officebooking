import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import Modal from '../components/ui/Modal.jsx';
import Button from '../components/ui/Button.jsx';
import { Box, Typography } from '@mui/material';
import { DatePicker, DateTimePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';

// Scale factor for converting desk units to pixels
const SCALE = 40;

export default function DesksPage() {
  const [desks, setDesks] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [bookingDesk, setBookingDesk] = useState(null);
  const [booking, setBooking] = useState({
    start: dayjs().hour(9).minute(0).second(0),
    end: dayjs().hour(10).minute(0).second(0),
  });
  const [drag, setDrag] = useState(null);
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [bookings, setBookings] = useState([]);

  async function load() {
    const res = await fetch('/desks');
    if (res.ok) setDesks(await res.json());
  }

  async function loadBookings(date) {
    const res = await fetch('/bookings');
    if (!res.ok) return;
    const data = await res.json();
    const start = dayjs(date).startOf('day');
    const end = dayjs(date).endOf('day');
    setBookings(
      data.filter(
        (b) => dayjs(b.start_time).isBefore(end) && dayjs(b.end_time).isAfter(start)
      )
    );
  }

  useEffect(() => { load(); }, []);
  useEffect(() => { loadBookings(selectedDate); }, [selectedDate]);

  async function addDesk() {
    await fetch('/desks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ x: 1, y: 1, width: 1, height: 1 })
    });
    setShowAdd(false);
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
      const start = dayjs(selectedDate).hour(9).minute(0).second(0);
      setBookingDesk(d);
      setBooking({ start, end: start.add(1, 'hour') });
      return;
    }
    await fetch(`/desks/${d.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(d)
    });
  }

  async function submitBooking(e) {
    e.preventDefault();
    if (!bookingDesk) return;
    await fetch('/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id: 'anon',
        desk_id: bookingDesk.id,
        start_time: booking.start.toISOString(),
        end_time: booking.end.toISOString(),
      })
    });
    setBookingDesk(null);
  }

  function getDeskStatus(id) {
    const bs = bookings.filter((b) => b.desk_id === id);
    if (!bs.length) return 'available';
    return bs.some((b) => b.user_id === 'anon') ? 'mine' : 'booked';
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
          sx={{ position: 'relative', width: '100%', height: 500, border: '1px solid #ddd', borderRadius: 1, bgcolor: '#f1f5f9', overflow: 'hidden' }}
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
                bgcolor: deskColor(getDeskStatus(d.id)),
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
              Desk {d.id}
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
          <Box component="form" onSubmit={submitBooking} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <DateTimePicker
              label="Start Time"
              value={booking.start}
              onChange={(v) => v && setBooking({ ...booking, start: v })}
              slotProps={{ textField: { size: 'small', fullWidth: true } }}
            />
            <DateTimePicker
              label="End Time"
              value={booking.end}
              onChange={(v) => v && setBooking({ ...booking, end: v })}
              slotProps={{ textField: { size: 'small', fullWidth: true } }}
            />
            <Button type="submit" fullWidth>
              Book Desk
            </Button>
          </Box>
        </Modal>
      </Box>
    </Layout>
  );
}
