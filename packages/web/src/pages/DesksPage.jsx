import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import Modal from '../components/ui/Modal.jsx';
import Button from '../components/ui/Button.jsx';
import { Box, Typography } from '@mui/material';

// Scale factor for converting desk units to pixels
const SCALE = 40;

export default function DesksPage() {
  const [desks, setDesks] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [bookingDesk, setBookingDesk] = useState(null);
  const [booking, setBooking] = useState({ start: '', end: '' });
  const [drag, setDrag] = useState(null);

  async function load() {
    const res = await fetch('/desks');
    if (res.ok) setDesks(await res.json());
  }

  useEffect(() => { load(); }, []);

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
      setBookingDesk(d);
      setBooking({ start: '', end: '' });
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
        start_time: booking.start,
        end_time: booking.end
      })
    });
    setBookingDesk(null);
  }

  return (
    <Layout>
      <Box onMouseMove={onMouseMove} onMouseUp={endDrag} onMouseLeave={endDrag}>
        <Typography variant="h5" gutterBottom>
          Floor Plan
        </Typography>

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
                bgcolor: 'background.paper',
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
            <div>
              <label>Start Time</label>
              <input
                type="datetime-local"
                value={booking.start}
                onChange={(e) => setBooking({ ...booking, start: e.target.value })}
                style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
              />
            </div>
            <div>
              <label>End Time</label>
              <input
                type="datetime-local"
                value={booking.end}
                onChange={(e) => setBooking({ ...booking, end: e.target.value })}
                style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
              />
            </div>
            <Button type="submit" fullWidth>
              Book Desk
            </Button>
          </Box>
        </Modal>
      </Box>
    </Layout>
  );
}
