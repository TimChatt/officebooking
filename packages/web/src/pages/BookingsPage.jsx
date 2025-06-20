import React, { useEffect, useState } from 'react';
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

  useEffect(() => { load(); }, []);

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
      start: b.start_time.slice(0,16),
      end: b.end_time.slice(0,16)
    });
  }

  return (
    <div>
      <form onSubmit={submit} className="space-x-2 mb-4">
        <select value={form.desk_id} onChange={e => setForm({ ...form, desk_id: e.target.value })}>
          <option value="">Desk</option>
          {desks.map(d => <option key={d.id} value={d.id}>Desk {d.id}</option>)}
        </select>
        <input type="datetime-local" value={form.start} onChange={e => setForm({ ...form, start: e.target.value })} />
        <input type="datetime-local" value={form.end} onChange={e => setForm({ ...form, end: e.target.value })} />
        <Button type="submit">{form.id ? 'Update' : 'Create'}</Button>
      </form>
      <table className="table-auto w-full text-left">
        <thead>
          <tr>
            <th>Desk</th>
            <th>Start</th>
            <th>End</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {bookings.map(b => (
            <tr key={b.id}>
              <td>{b.desk_id}</td>
              <td>{new Date(b.start_time).toLocaleString()}</td>
              <td>{new Date(b.end_time).toLocaleString()}</td>
              <td><Button onClick={() => edit(b)}>Edit</Button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
