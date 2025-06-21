import React, { useEffect, useState } from 'react';
import { BarChart, Bar, ResponsiveContainer, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import Card from '../components/ui/Card.jsx';
import { Box, Typography, Grid, Paper } from '@mui/material';
import CalendarHeatmapChart from '../components/CalendarHeatmap.jsx';
import TeamUsageCharts from '../components/TeamUsageCharts.jsx';
import UtilizationTrends from '../components/UtilizationTrends.jsx';
import FloorplanAnalytics from '../components/FloorplanAnalytics.jsx';
import PeakTimesHeatmap from '../components/PeakTimesHeatmap.jsx';

export default function AnalyticsPage() {
  const [daily, setDaily] = useState([]);
  const [weekly, setWeekly] = useState([]);
  const [heatmap, setHeatmap] = useState([]);
  const [teamUsage, setTeamUsage] = useState([]);

  async function load() {
    const dRes = await fetch('/api/analytics/daily');
    if (dRes.ok) setDaily(await dRes.json());
    const wRes = await fetch('/api/analytics/weekly');
    if (wRes.ok) setWeekly(await wRes.json());
    const hRes = await fetch('/api/analytics/heatmap');
    if (hRes.ok) setHeatmap(await hRes.json());
    const tRes = await fetch('/api/analytics/team');
    if (tRes.ok) setTeamUsage(await tRes.json());
  }

  useEffect(() => {
    load();
  }, []);

  const total = daily.reduce((a, b) => a + b.bookings, 0);

  return (
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
            <UtilizationTrends
              data={daily.map(d => ({
                day: new Date(d.day).toLocaleDateString(),
                bookings: Number(d.bookings)
              }))}
            />
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Weekly Bookings
              </Typography>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={weekly.map(w => ({
                week: new Date(w.week).toLocaleDateString(),
                bookings: w.bookings
              }))}>
                <CartesianGrid stroke="#e2e8f0" />
                <XAxis dataKey="week" fontSize={12} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="bookings" fill="#16a34a" />
              </BarChart>
            </ResponsiveContainer>
            </Paper>
          </Grid>
          <Grid item xs={12} md={12}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Usage Heatmap
              </Typography>
              <CalendarHeatmapChart
                values={heatmap.map(h => ({ date: h.day.slice(0,10), count: Number(h.bookings) }))}
              />
            </Paper>
          </Grid>
          <Grid item xs={12} md={12}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Usage by Team & Company
              </Typography>
              <TeamUsageCharts data={teamUsage} />
            </Paper>
          </Grid>
          <Grid item xs={12} md={12}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Floorplan Utilization (30 days)
              </Typography>
              <FloorplanAnalytics />
            </Paper>
          </Grid>
          <Grid item xs={12} md={12}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Peak Times by Day
              </Typography>
              <PeakTimesHeatmap />
            </Paper>
          </Grid>
        </Grid>
      </Box>
  );
}
