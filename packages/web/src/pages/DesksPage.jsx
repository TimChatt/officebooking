import React, { useEffect, useState } from 'react';
import Layout from '../components/layout';
import Modal from '../components/ui/Modal.jsx';
import Button from '../components/ui/Button.jsx';

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
      <div onMouseMove={onMouseMove} onMouseUp={endDrag} onMouseLeave={endDrag}>
        <h1 className="text-2xl font-semibold mb-6">Floor Plan</h1>

        <div className="mb-4">
          <Button onClick={() => setShowAdd(true)}>Add New Desk</Button>
        </div>

        <div className="relative w-full h-[500px] border rounded-lg bg-slate-50 overflow-hidden">
          {desks.map(d => (
            <div
              key={d.id}
              onMouseDown={e => startDrag(d, e)}
              className="absolute bg-white border border-slate-300 text-xs font-medium shadow-sm hover:shadow-md transition cursor-move flex items-center justify-center rounded select-none"
              style={{
                left: d.x * SCALE,
                top: d.y * SCALE,
                width: d.width * SCALE,
                height: d.height * SCALE
              }}
            >
              Desk {d.id}
            </div>
          ))}
        </div>

        {/* Modal: Add Desk */}
        <Modal open={showAdd} onClose={() => setShowAdd(false)}>
          <h2 className="text-lg font-semibold mb-4">Add a New Desk</h2>
          <Button onClick={addDesk}>Create Desk</Button>
        </Modal>

        {/* Modal: Book Desk */}
        <Modal open={!!bookingDesk} onClose={() => setBookingDesk(null)}>
          <h2 className="text-lg font-semibold mb-4">Book Desk {bookingDesk?.id}</h2>
          <form onSubmit={submitBooking} className="space-y-3">
            <div>
              <label className="block text-sm mb-1 text-slate-600">Start Time</label>
              <input
                type="datetime-local"
                value={booking.start}
                onChange={e => setBooking({ ...booking, start: e.target.value })}
                className="w-full border px-3 py-2 rounded text-sm"
              />
            </div>
            <div>
              <label className="block text-sm mb-1 text-slate-600">End Time</label>
              <input
                type="datetime-local"
                value={booking.end}
                onChange={e => setBooking({ ...booking, end: e.target.value })}
                className="w-full border px-3 py-2 rounded text-sm"
              />
            </div>
            <Button type="submit" className="w-full">
              Book Desk
            </Button>
          </form>
        </Modal>
      </div>
    </Layout>
  );
}
