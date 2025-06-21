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
} from '@mui/material';

export default function DashboardPage() {
  const [bookings, setBookings] = useState([]);
  const [events, setEvents] = useState([]);
  const [recommend, setRecommend] = useState(null);
  const [calendarDate, setCalendarDate] = useState(dayjs());

  async function loadBookingsForMonth(date) {
    const startOfMonth = dayjs(date).startOf('month').toISOString();
    const endOfMonth = dayjs(date).endOf('month').toISOString();

    const res = await fetch(`/api/bookings?user=anon&start=${startOfMonth}&end=${endOfMonth}`);
    if (res.ok) {
      const data = await res.json();
      const upcoming = data.filter(
        (b) => new Date(b.start_time) > new Date()
      );
      setBookings(upcoming);
    }
  }

  useEffect(() => {
    loadBookingsForMonth(calendarDate);

    (async () => {
      const [eRes, rRes] = await Promise.all([
        fetch('/api/events'),
        fetch('/api/recommendation'),
      ]);
      if (eRes.ok) setEvents(await eRes.json());
      if (rRes.ok) setRecommend(await rRes.json());
    })();
  }, []);

  async function cancel(id) {
    await fetch(`/api/bookings/${id}`, { method: 'DELETE' });
    loadBookingsForMonth(calendarDate);
  }

  const calendarEvents = bookings.map((b) => ({
    title: `Desk ${b.desk_id}`,
    start: b.start_time,
    end: b.end_time,
  }));

  const formattedMonth = calendarDate.format('MMMM YYYY');

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
        My Dashboard
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card sx={{ maxHeight: 350, overflowY: 'auto' }}>
            <Typography variant="h6" gutterBottom>
              Upcoming Bookings
            </Typography>
            <Divider sx={{ mb: 1 }} />
            <List dense>
              {bookings.slice(0, 5).map((b) => (
                <ListItem
                  key={b.id}
                  secondaryAction={
                    <Button size="small" onClick={() => cancel(b.id)}>
                      Cancel
                    </Button>
                  }
                >
                  <ListItemText
                    primary={`Desk ${b.desk_id}`}
                    secondary={`${new Date(b.start_time).toLocaleString()} - ${new Date(b.end_time).toLocaleString()}`}
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

        <Grid item xs={12} md={8}>
          <Card sx={{ minHeight: 350 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="h6" gutterBottom>
                Calendar
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 500, color: 'gray' }}>
                {formattedMonth}
              </Typography>
            </Box>
            <Divider sx={{ mb: 2 }} />
            <FullCalendar
              plugins={[dayGridPlugin]}
              initialView="dayGridMonth"
              height={250}
              events={calendarEvents}
              headerToolbar={false}
              fixedWeekCount={false}
              showNonCurrentDates={false}
              dateClick={(info) => {
                const clickedDate = dayjs(info.dateStr).format('YYYY-MM-DD');
                window.location.href = `/desks?date=${clickedDate}`;
              }}
              datesSet={() => {
                const currentMonthStart = dayjs().startOf('month');
                setCalendarDate(currentMonthStart);
                loadBookingsForMonth(currentMonthStart);
              }}
            />
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ minHeight: 250 }}>
            <Typography variant="h6" gutterBottom>
              Events
            </Typography>
            <List dense>
              {events.slice(0, 5).map((ev) => (
                <ListItem key={ev.id}>
                  <ListItemText
                    primary={ev.title}
                    secondary={new Date(ev.event_time).toLocaleString()}
                  />
                  <Button
                    size="small"
                    onClick={() =>
                      fetch(`/api/events/${ev.id}/rsvp`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ user_id: 'anon', status: 'yes' }),
                      })
                    }
                  >
                    RSVP
                  </Button>
                </ListItem>
              ))}
              {!events.length && (
                <ListItem>
                  <ListItemText primary="No upcoming events" />
                </ListItem>
              )}
            </List>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ minHeight: 250 }}>
            <Typography variant="h6" gutterBottom>
              Usage Stats
            </Typography>
            <UtilizationChart />
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <Typography variant="h6" gutterBottom>
              Suggested Desk
            </Typography>
            {recommend ? (
              <Typography variant="body1">Desk {recommend.id}</Typography>
            ) : (
              <Typography variant="body2">No recommendation available</Typography>
            )}
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
