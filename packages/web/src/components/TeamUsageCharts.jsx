import React from 'react';
import { PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';
import { Grid } from '@mui/material';

const COLORS = ['#2563eb', '#16a34a', '#dc2626', '#eab308', '#9333ea'];

export default function TeamUsageCharts({ data }) {
  const teamData = data.filter(d => d.team).map(d => ({ name: d.team, value: Number(d.bookings) }));
  const companyData = data.filter(d => d.company).map(d => ({ name: d.company, value: Number(d.bookings) }));
  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={6}>
        <PieChart width={300} height={220}>
          <Pie data={teamData} dataKey="value" nameKey="name" outerRadius={80} label>
            {teamData.map((entry, idx) => (
              <Cell key={`c-${idx}`} fill={COLORS[idx % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </Grid>
      <Grid item xs={12} md={6}>
        <BarChart width={320} height={220} data={companyData}>
          <CartesianGrid stroke="#e2e8f0" />
          <XAxis dataKey="name" fontSize={12} />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="value" fill="#2563eb" />
        </BarChart>
      </Grid>
    </Grid>
  );
}
