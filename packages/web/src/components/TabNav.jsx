import React from 'react';
import { useLocation, NavLink } from 'react-router-dom';
import { Tabs, Tab, Box } from '@mui/material';

export default function TabNav() {
  const location = useLocation();
  const value = ['/desks', '/bookings', '/analytics', '/alerts'].indexOf(location.pathname);

  return (
    <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
      <Tabs value={value} textColor="primary" indicatorColor="primary">
        <Tab label="Desks" component={NavLink} to="/desks" />
        <Tab label="Bookings" component={NavLink} to="/bookings" />
        <Tab label="Analytics" component={NavLink} to="/analytics" />
        <Tab label="Alerts" component={NavLink} to="/alerts" />
      </Tabs>
    </Box>
  );
}
