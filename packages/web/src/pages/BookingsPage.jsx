import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import Button from '../components/ui/Button.jsx';
import {
  Box,
  Typography,
  Grid,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
} from '@mui/material';

export default function BookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [desks, setDesks] = useState([]);
  const [form, setForm] = useState({ id: null, desk_id: '', start: '', end: '' });

  async function load() {
    const bRes = await fetch('/bookings');
    if (bRes.ok) setBookings(await bRes.json());

    const dRes = await fetch('/desks');
    if (dRes.ok) setDesks(await dRes.json());
  }

  useEffect(() => {
    load();
  }, []);

  async function submit(e) {
    e.preventDefault();
    const method = form.id ? 'PUT' : 'POST';
    const url = form.id ? `/bookings/${form.id}` : '/bookings';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        desk_id: Number(form.desk_id),
        start_time: form.start,
        end_time: form.end,
      })
    });

    if (res.ok) {
      setForm({ id: null, desk_id: '', start: '', end: '' });
      load();
    }
  }

  function edit(b) {
    setForm({
      id: b.id,
      desk_id: b.desk_id,
      start: b.start_time.slice(0, 16),
      end: b.end_time.slice(0, 16),
    });
  }

  return (
    <Layout>
      <Box>
        <Typography variant="h5" gutterBottom>
          Manage Bookings
        </Typography>

        <Box component="form" onSubmit={submit} sx={{ mb: 3, p: 2, background: 'white', borderRadius: 1, boxShadow: 1 }}>
          <Grid container spacing={2} alignItems="flex-end">
            <Grid item xs={12} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel id="desk-select">Desk</InputLabel>
                <Select
                  labelId="desk-select"
                  value={form.desk_id}
                  label="Desk"
                  onChange={(e) => setForm({ ...form, desk_id: e.target.value })}
                >
                  <MenuItem value="">
                    <em>Select a desk</em>
                  </MenuItem>
                  {desks.map((d) => (
                    <MenuItem key={d.id} value={d.id}>
                      Desk {d.id}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                type="datetime-local"
                label="Start Time"
                size="small"
                fullWidth
                value={form.start}
                onChange={(e) => setForm({ ...form, start: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                type="datetime-local"
                label="End Time"
                size="small"
                fullWidth
                value={form.end}
                onChange={(e) => setForm({ ...form, end: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <Button type="submit" fullWidth>
                {form.id ? 'Update Booking' : 'Create Booking'}
              </Button>
            </Grid>
          </Grid>
        </Box>

        <Paper sx={{ overflowX: 'auto' }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Desk</TableCell>
                <TableCell>Start</TableCell>
                <TableCell>End</TableCell>
                <TableCell />
              </TableRow>
            </TableHead>
            <TableBody>
              {bookings.map((b) => (
                <TableRow key={b.id} hover>
                  <TableCell>{b.desk_id}</TableCell>
                  <TableCell>{new Date(b.start_time).toLocaleString()}</TableCell>
                  <TableCell>{new Date(b.end_time).toLocaleString()}</TableCell>
                  <TableCell>
                    <Button onClick={() => edit(b)} size="small">
                      Edit
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
