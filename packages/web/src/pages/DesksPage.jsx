import React, { useEffect, useState } from 'react';
import Modal from '../components/ui/Modal.jsx';
import Button from '../components/ui/Button.jsx';
import Card from '../components/ui/Card.jsx';

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
    setDrag({ id: d.id, offsetX: e.clientX - d.x, offsetY: e.clientY - d.y, moved: false });
  }

  function onMouseMove(e) {
    if (!drag) return;
    setDesks(ds => ds.map(d => d.id === drag.id ? { ...d, x: e.clientX - drag.offsetX, y: e.clientY - drag.offsetY } : d));
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
    <div onMouseMove={onMouseMove} onMouseUp={endDrag} onMouseLeave={endDrag}>
      <Button onClick={() => setShowAdd(true)}>Add Desk</Button>
      <div className="mt-4 relative w-full h-96 border">
        {desks.map(d => (
          <div
            key={d.id}
            onMouseDown={(e) => startDrag(d, e)}
            className="absolute bg-gray-100 border flex items-center justify-center cursor-move select-none"
            style={{ left: d.x * SCALE, top: d.y * SCALE, width: d.width * SCALE, height: d.height * SCALE }}
          >
            Desk {d.id}
          </div>
        ))}
      </div>
      <Modal open={showAdd} onClose={() => setShowAdd(false)}>
        <h2 className="text-lg font-semibold mb-2">Add Desk</h2>
        <Button onClick={addDesk}>Create</Button>
      </Modal>
      <Modal open={!!bookingDesk} onClose={() => setBookingDesk(null)}>
        <h2 className="text-lg font-semibold mb-2">
          Book Desk {bookingDesk?.id}
        </h2>
        <form onSubmit={submitBooking} className="space-y-2">
          <input
            type="datetime-local"
            className="w-full border p-2 rounded"
            value={booking.start}
            onChange={e => setBooking({ ...booking, start: e.target.value })}
          />
          <input
            type="datetime-local"
            className="w-full border p-2 rounded"
            value={booking.end}
            onChange={e => setBooking({ ...booking, end: e.target.value })}
          />
          <Button type="submit">Book</Button>
        </form>
      </Modal>
    </div>
  );
}
