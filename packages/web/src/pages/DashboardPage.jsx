import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import Card from '../components/ui/Card.jsx';
import Button from '../components/ui/Button.jsx';
import UtilizationChart from '../UtilizationChart.jsx';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import {
  Box,
  Typography,
  Grid,
  List,
  ListItem,
  ListItemText,
  Divider,
  Chip,
} from '@mui/material';
import { CalendarMonth, Cancel } from '@mui/icons-material';

export default function DashboardPage() {
  const [bookings, setBookings] = useState([]);
  const [recommend, setRecommend] = useState(null);
  const [calendarDate, setCalendarDate] = useState(dayjs());

  const today = dayjs().format('YYYY-MM-DD');

  useEffect(() => {
    const loadBookingsForMonth = async (date) => {
      const startOfMonth = dayjs(date).startOf('month').toISOString();
      const endOfMonth = dayjs(date).endOf('month').toISOString();
      const res = await fetch(`/api/bookings?user=anon&start=${startOfMonth}&end=${endOfMonth}`);
      if (res.ok) {
        const data = await res.json();
        const upcoming = data.filter((b) => new Date(b.start_time) > new Date());
        setBookings(upcoming);
      }
    };

    loadBookingsForMonth(calendarDate);

    (async () => {
      const rRes = await fetch('/api/recommendation');
      if (rRes.ok) setRecommend(await rRes.json());
    })();
  }, [calendarDate]);

  const cancel = async (id) => {
    await fetch(`/api/bookings/${id}`, { method: 'DELETE' });
    const newDate = dayjs();
    const startOfMonth = newDate.startOf('month').toISOString();
    const endOfMonth = newDate.endOf('month').toISOString();
    const res = await fetch(`/api/bookings?user=anon&start=${startOfMonth}&end=${endOfMonth}`);
    if (res.ok) {
      const data = await res.json();
      const upcoming = data.filter((b) => new Date(b.start_time) > new Date());
      setBookings(upcoming);
    }
  };

  const calendarEvents = bookings.map((b) => ({
    title: `Desk ${b.desk_id}`,
    start: b.start_time,
    end: b.end_time,
  }));

  const formattedMonth = calendarDate.format('MMMM YYYY');

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
        My Dashboard
      </Typography>

      <Typography variant="body2" sx={{ color: 'gray', mb: 3 }}>
        Today is <strong>{dayjs().format('dddd, D MMMM YYYY')}</strong>
      </Typography>

      <Grid container spacing={3}>
        {/* Upcoming Bookings */}
        <Grid item xs={12} md={4}>
          <Card sx={{ boxShadow: 3 }}>
            <Typography variant="h6" gutterBottom>
              <CalendarMonth fontSize="small" sx={{ mr: 1, verticalAlign: 'middle' }} />
              Upcoming Bookings
            </Typography>
            <Divider sx={{ mb: 1 }} />
            <List dense>
              {bookings.slice(0, 5).map((b) => (
                <ListItem
                  key={b.id}
                  sx={{
                    borderBottom: '1px solid #f0f0f0',
                    py: 1,
                    px: 0,
                  }}
                  secondaryAction={
                    <Button
                      size="small"
                      variant="outlined"
                      color="error"
                      startIcon={<Cancel />}
                      onClick={() => cancel(b.id)}
                    >
                      Cancel
                    </Button>
                  }
                >
                  <ListItemText
                    primary={`Desk ${b.desk_id}`}
                    secondary={dayjs(b.start_time).format('ddd D MMM, HH:mm')}
                  />
                </ListItem>
              ))}
              {!bookings.length && (
                <ListItem>
                  <ListItemText primary="No upcoming bookings" />
                </ListItem>
              )}
            </List>
          </Card>
        </Grid>

        {/* Calendar */}
        <Grid item xs={12} md={8}>
          <Card sx={{ boxShadow: 3 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="h6" gutterBottom>
                Calendar
              </Typography>
              <Chip
                label={formattedMonth}
                size="small"
                sx={{ backgroundColor: '#eef2ff', color: '#4f46e5' }}
              />
            </Box>
            <Divider sx={{ mb: 2 }} />
            <FullCalendar
              plugins={[dayGridPlugin]}
              initialView="dayGridMonth"
              height={280}
              events={calendarEvents}
              headerToolbar={false}
              fixedWeekCount={false}
              dateClick={(info) => {
                const selectedDate = dayjs(info.date).format('YYYY-MM-DD');
                window.location.href = `/desks?date=${selectedDate}`;
              }}
              datesSet={(arg) => {
                const newDate = dayjs(arg.start);
                setCalendarDate(newDate);
              }}
              dayCellDidMount={(arg) => {
                if (arg.dateStr === today) {
                  arg.el.style.backgroundColor = '#f0f4ff';
                  arg.el.style.border = '1px solid #4f46e5';
                  arg.el.style.borderRadius = '6px';
                }
              }}
            />
          </Card>
        </Grid>

        {/* Usage Chart */}
        <Grid item xs={12} md={6}>
          <Card sx={{ boxShadow: 3 }}>
            <Typography variant="h6" gutterBottom>
              Usage Stats
            </Typography>
            <UtilizationChart />
          </Card>
        </Grid>

        {/* Suggested Desk */}
        <Grid item xs={12} md={6}>
          <Card sx={{ boxShadow: 3 }}>
            <Typography variant="h6" gutterBottom>
              Suggested Desk
            </Typography>
            {recommend ? (
              <Typography variant="body1">
                Based on usage: <strong>Desk {recommend.id}</strong>
              </Typography>
            ) : (
              <Typography variant="body2" sx={{ color: 'gray' }}>
                No recommendation available
              </Typography>
            )}
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
