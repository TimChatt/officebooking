import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import Button from '../components/ui/Button.jsx';

export default function BookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [desks, setDesks] = useState([]);
  const [form, setForm] = useState({ id: null, desk_id: '', start: '', end: '' });

  async function load() {
    const bRes = await fetch('/bookings');
    if (bRes.ok) setBookings(await bRes.json());

    const dRes = await fetch('/desks');
    if (dRes.ok) setDesks(await dRes.json());
  }

  useEffect(() => {
    load();
  }, []);

  async function submit(e) {
    e.preventDefault();
    const method = form.id ? 'PUT' : 'POST';
    const url = form.id ? `/bookings/${form.id}` : '/bookings';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        desk_id: Number(form.desk_id),
        start_time: form.start,
        end_time: form.end,
      })
    });

    if (res.ok) {
      setForm({ id: null, desk_id: '', start: '', end: '' });
      load();
    }
  }

  function edit(b) {
    setForm({
      id: b.id,
      desk_id: b.desk_id,
      start: b.start_time.slice(0, 16),
      end: b.end_time.slice(0, 16),
    });
  }

  return (
    <Layout>
      <div>
        <h1 className="text-2xl font-semibold mb-6">Manage Bookings</h1>

        <form onSubmit={submit} className="mb-6 space-y-4 bg-white p-4 rounded-lg border shadow-sm">
          <div className="grid md:grid-cols-4 gap-4 items-end">
            <div>
              <label className="block text-sm text-slate-600 mb-1">Desk</label>
              <select
                value={form.desk_id}
                onChange={e => setForm({ ...form, desk_id: e.target.value })}
                className="w-full border rounded-md px-3 py-2 text-sm"
              >
                <option value="">Select a desk</option>
                {desks.map(d => (
                  <option key={d.id} value={d.id}>
                    Desk {d.id}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm text-slate-600 mb-1">Start Time</label>
              <input
                type="datetime-local"
                value={form.start}
                onChange={e => setForm({ ...form, start: e.target.value })}
                className="w-full border rounded-md px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm text-slate-600 mb-1">End Time</label>
              <input
                type="datetime-local"
                value={form.end}
                onChange={e => setForm({ ...form, end: e.target.value })}
                className="w-full border rounded-md px-3 py-2 text-sm"
              />
            </div>

            <div>
              <Button type="submit" className="w-full">
                {form.id ? 'Update Booking' : 'Create Booking'}
              </Button>
            </div>
          </div>
        </form>

        <div className="bg-white rounded-lg border shadow-sm overflow-x-auto">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-slate-100 text-slate-700">
              <tr>
                <th className="px-4 py-2 border-b">Desk</th>
                <th className="px-4 py-2 border-b">Start</th>
                <th className="px-4 py-2 border-b">End</th>
                <th className="px-4 py-2 border-b"></th>
              </tr>
            </thead>
            <tbody>
              {bookings.map(b => (
                <tr key={b.id} className="hover:bg-slate-50 border-b last:border-none">
                  <td className="px-4 py-2">{b.desk_id}</td>
                  <td className="px-4 py-2">{new Date(b.start_time).toLocaleString()}</td>
                  <td className="px-4 py-2">{new Date(b.end_time).toLocaleString()}</td>
                  <td className="px-4 py-2">
                    <Button onClick={() => edit(b)} size="sm">
                      Edit
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}
