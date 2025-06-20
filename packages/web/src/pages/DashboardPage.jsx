import React from 'react';
import Card from '../components/ui/Card.jsx';
import UtilizationChart from '../UtilizationChart.jsx';
import { Box, Typography, Grid } from '@mui/material';

export default function DashboardPage() {
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Dashboard
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Card>
            <UtilizationChart />
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>Upcoming bookings</Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>Desk status overview</Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>Recent alerts</Card>
        </Grid>
      </Grid>
    </Box>
  );
}
