import React, { useEffect, useState } from 'react';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';

export default function UtilizationChart() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch('/analytics')
      .then((res) => res.json())
      .then((rows) => {
        const counts = {};
        rows.forEach((r) => {
          const day = r.timestamp.slice(0, 10);
          if (r.event_type === 'booking_created') {
            counts[day] = (counts[day] || 0) + 1;
          }
        });
        const arr = Object.keys(counts)
          .sort()
          .map((d) => ({ date: d, bookings: counts[d] }));
        setData(arr);
      })
      .catch(console.error);
  }, []);

  return (
    <LineChart width={400} height={300} data={data}>
      <CartesianGrid stroke="#ccc" />
      <XAxis dataKey="date" />
      <YAxis allowDecimals={false} />
      <Tooltip />
      <Line type="monotone" dataKey="bookings" stroke="#8884d8" />
    </LineChart>
  );
}
