import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import Button from '../components/ui/Button.jsx';
import {
  Box,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
} from '@mui/material';

export default function AlertsPage() {
  const [alerts, setAlerts] = useState([]);

  async function load() {
    const res = await fetch('/alerts');
    if (res.ok) {
      const data = await res.json();
      setAlerts(data.alerts || []);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const resendEmail = () => load();
  const resendSms = () => load();

  return (
    <Layout>
      <Box>
        <Typography variant="h5" gutterBottom>
          Alerts
        </Typography>

        <Paper>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Bookings</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {alerts.map((a, idx) => (
                <TableRow key={idx} hover>
                  <TableCell>{new Date(a.day).toLocaleDateString()}</TableCell>
                  <TableCell>{a.bookings}</TableCell>
                  <TableCell>
                    <Button onClick={resendEmail}>Resend Email</Button>
                    <Button onClick={resendSms} sx={{ ml: 1 }}>
                      Resend SMS
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      </Box>
    </Layout>
  );
}
