import React, { useEffect, useState } from 'react';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, BarChart, Bar } from 'recharts';
import Card from '../components/ui/Card.jsx';

export default function AnalyticsPage() {
  const [daily, setDaily] = useState([]);
  const [weekly, setWeekly] = useState([]);

  async function load() {
    const dRes = await fetch('/analytics/daily');
    if (dRes.ok) setDaily(await dRes.json());
    const wRes = await fetch('/analytics/weekly');
    if (wRes.ok) setWeekly(await wRes.json());
  }

  useEffect(() => { load(); }, []);

  const total = daily.reduce((a, b) => a + b.bookings, 0);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>Total bookings: {total}</Card>
        <Card>Weeks tracked: {weekly.length}</Card>
      </div>
      <LineChart width={500} height={200} data={daily.map(d => ({ day: new Date(d.day).toLocaleDateString(), bookings: d.bookings }))}>
        <CartesianGrid stroke="#ccc" />
        <XAxis dataKey="day" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="bookings" stroke="#8884d8" />
      </LineChart>
      <BarChart width={500} height={200} data={weekly.map(w => ({ week: new Date(w.week).toLocaleDateString(), bookings: w.bookings }))}>
        <CartesianGrid stroke="#ccc" />
        <XAxis dataKey="week" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="bookings" fill="#82ca9d" />
      </BarChart>
    </div>
  );
}
