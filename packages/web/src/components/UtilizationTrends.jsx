import React from 'react';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function UtilizationTrends({ data }) {
  const ma = [];
  for (let i = 0; i < data.length; i++) {
    const slice = data.slice(Math.max(0, i - 6), i + 1);
    const avg = slice.reduce((a, b) => a + b.bookings, 0) / slice.length;
    ma.push({ ...data[i], ma: Math.round(avg * 10) / 10 });
  }
  return (
    <ResponsiveContainer width="100%" height={200}>
      <LineChart data={ma} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
        <CartesianGrid stroke="#e2e8f0" />
        <XAxis dataKey="day" fontSize={12} />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="bookings" stroke="#2563eb" strokeWidth={2} />
        <Line type="monotone" dataKey="ma" stroke="#16a34a" strokeDasharray="5 3" />
      </LineChart>
    </ResponsiveContainer>
  );
}
