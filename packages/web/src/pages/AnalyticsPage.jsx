import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, BarChart, Bar } from 'recharts';
import Card from '../components/ui/Card.jsx';
import { Box, Typography, Grid, Paper } from '@mui/material';

export default function AnalyticsPage() {
  const [daily, setDaily] = useState([]);
  const [weekly, setWeekly] = useState([]);

  async function load() {
    const dRes = await fetch('/api/analytics/daily');
    if (dRes.ok) setDaily(await dRes.json());
    const wRes = await fetch('/api/analytics/weekly');
    if (wRes.ok) setWeekly(await wRes.json());
  }

  useEffect(() => {
    load();
  }, []);

  const total = daily.reduce((a, b) => a + b.bookings, 0);

  return (
    <Layout>
      <Box>
        <Typography variant="h5" gutterBottom>
          Analytics
        </Typography>

        <Grid container spacing={2} mb={3}>
          <Grid item xs={6} md={3}>
            <Card>
              <Typography variant="body2" color="text.secondary">
                Total Bookings
              </Typography>
              <Typography variant="h6">{total}</Typography>
            </Card>
          </Grid>
          <Grid item xs={6} md={3}>
            <Card>
              <Typography variant="body2" color="text.secondary">
                Weeks Tracked
              </Typography>
              <Typography variant="h6">{weekly.length}</Typography>
            </Card>
          </Grid>
        </Grid>

        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Daily Bookings
              </Typography>
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
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Weekly Bookings
              </Typography>
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
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Layout>
  );
}
