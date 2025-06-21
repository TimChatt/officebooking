import React from 'react';
import { PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer } from 'recharts';
import { Grid } from '@mui/material';

const COLORS = ['#2563eb', '#16a34a', '#dc2626', '#eab308', '#9333ea'];

export default function TeamUsageCharts({ data }) {
  const teamData = data.filter(d => d.team).map(d => ({ name: d.team, value: Number(d.bookings) }));
  const companyData = data.filter(d => d.company).map(d => ({ name: d.company, value: Number(d.bookings) }));
  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={6}>
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie data={teamData} dataKey="value" nameKey="name" outerRadius={80} label>
              {teamData.map((entry, idx) => (
                <Cell key={`c-${idx}`} fill={COLORS[idx % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </Grid>
      <Grid item xs={12} md={6}>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={companyData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
            <CartesianGrid stroke="#e2e8f0" />
            <XAxis dataKey="name" fontSize={12} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#2563eb" />
          </BarChart>
        </ResponsiveContainer>
      </Grid>
    </Grid>
  );
}
