import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
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

  useEffect(() => {
    load();
  }, []);

  const total = daily.reduce((a, b) => a + b.bookings, 0);

  return (
    <Layout>
      <div>
        <h1 className="text-2xl font-semibold mb-6">Analytics</h1>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <p className="text-sm text-slate-500">Total Bookings</p>
            <p className="text-lg font-medium">{total}</p>
          </Card>
          <Card>
            <p className="text-sm text-slate-500">Weeks Tracked</p>
            <p className="text-lg font-medium">{weekly.length}</p>
          </Card>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white p-4 rounded-lg border shadow-sm">
            <h2 className="text-lg font-semibold mb-2">Daily Bookings</h2>
            <LineChart
              width={450}
              height={200}
              data={daily.map(d => ({
                day: new Date(d.day).toLocaleDateString(),
                bookings: d.bookings
              }))}
            >
              <CartesianGrid stroke="#e2e8f0" />
              <XAxis dataKey="day" fontSize={12} />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="bookings" stroke="#2563eb" strokeWidth={2} />
            </LineChart>
          </div>

          <div className="bg-white p-4 rounded-lg border shadow-sm">
            <h2 className="text-lg font-semibold mb-2">Weekly Bookings</h2>
            <BarChart
              width={450}
              height={200}
              data={weekly.map(w => ({
                week: new Date(w.week).toLocaleDateString(),
                bookings: w.bookings
              }))}
            >
              <CartesianGrid stroke="#e2e8f0" />
              <XAxis dataKey="week" fontSize={12} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="bookings" fill="#16a34a" />
            </BarChart>
          </div>
        </div>
      </div>
    </Layout>
  );
}
