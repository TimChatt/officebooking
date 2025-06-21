const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const {
  pool,
  init,
  logEvent,
  getUsers,
  updateUserRole,
  updateBooking,
  deleteBooking,
  deleteDesk,
} = require('./db');
const { checkJwt } = require('./auth');

function createApp() {
  const app = express();
  const api = express.Router();

  // at the very top, before any auth middleware:
  // serve the built frontend from packages/web/dist
  const webRoot = path.join(__dirname, '../web/dist');

  // serve all built assets as static files
  app.use(express.static(webRoot));

  const sendgridKey = process.env.SENDGRID_API_KEY;
  const alertEmail = process.env.ALERT_EMAIL;
  const twilioSid = process.env.TWILIO_ACCOUNT_SID;
  const twilioToken = process.env.TWILIO_AUTH_TOKEN;
  const twilioFrom = process.env.TWILIO_FROM;
  const alertPhone = process.env.ALERT_PHONE;
  const forecastUrl = process.env.FORECAST_URL || 'http://localhost:8000';

  // Middleware
  app.use(express.json());
  app.use(cors());

  // Admin check middleware
  function requireAdmin(req, res, next) {
    if (req.headers['x-user-role'] !== 'admin') {
      return res.status(403).json({ error: 'admin only' });
    }
    next();
  }

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Require auth for all following routes
app.use(checkJwt);

// Desks
api.get('/desks', async (req, res) => {
  const { rows } = await pool.query('SELECT * FROM desks ORDER BY id');
  res.json(rows);
});

api.post('/desks', async (req, res) => {
  const { x, y, width, height, status = 'available' } = req.body;
  if ([x, y, width, height].some((v) => typeof v !== 'number')) {
    return res.status(400).json({ error: 'invalid desk fields' });
  }
  const { rows } = await pool.query(
    `INSERT INTO desks (x, y, width, height, status)
     VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [x, y, width, height, status]
  );
  res.status(201).json(rows[0]);
});

api.put('/desks/:id', async (req, res) => {
  const id = Number(req.params.id);
  const { x, y, width, height, status = 'available' } = req.body;
  if ([x, y, width, height].some((v) => typeof v !== 'number')) {
    return res.status(400).json({ error: 'invalid desk fields' });
  }
  const { rows } = await pool.query(
    `UPDATE desks SET x=$1, y=$2, width=$3, height=$4, status=$5
     WHERE id=$6 RETURNING *`,
    [x, y, width, height, status, id]
  );
  if (!rows.length) return res.status(404).json({ error: 'desk not found' });
  await pool.query(`INSERT INTO analytics (desk_id, event_type) VALUES ($1, 'desk_moved')`, [id]);
  res.json(rows[0]);
});

api.delete('/desks/:id', async (req, res) => {
  const id = Number(req.params.id);
  const desk = await deleteDesk(id);
  if (!desk) return res.status(404).json({ error: 'desk not found' });
  res.json(desk);
});

api.get('/desks/:id/blocks', async (req, res) => {
  const deskId = Number(req.params.id);
  const { rows } = await pool.query(
    'SELECT * FROM desk_blocks WHERE desk_id=$1 ORDER BY start_time',
    [deskId]
  );
  res.json(rows);
});

api.post('/desks/:id/blocks', async (req, res) => {
  const deskId = Number(req.params.id);
  const { start_time, end_time } = req.body;
  if (!start_time || !end_time) return res.status(400).json({ error: 'missing fields' });
  const { rows } = await pool.query(
    `INSERT INTO desk_blocks (desk_id, start_time, end_time)
     VALUES ($1, $2, $3) RETURNING *`,
    [deskId, start_time, end_time]
  );
  res.status(201).json(rows[0]);
});

api.delete('/desks/:deskId/blocks/:blockId', async (req, res) => {
  const { deskId, blockId } = req.params;
  const { rows } = await pool.query(
    'DELETE FROM desk_blocks WHERE id=$1 AND desk_id=$2 RETURNING *',
    [blockId, deskId]
  );
  if (!rows.length) return res.status(404).json({ error: 'block not found' });
  res.json(rows[0]);
});

// Objects
api.get('/objects', async (req, res) => {
  const { rows } = await pool.query('SELECT * FROM objects ORDER BY id');
  res.json(rows);
});

api.post('/objects', async (req, res) => {
  const { label, type, x, y, width, height } = req.body;
  if (!label || !type || [x, y, width, height].some((v) => typeof v !== 'number')) {
    return res.status(400).json({ error: 'invalid object fields' });
  }
  const { rows } = await pool.query(
    `INSERT INTO objects (label, type, x, y, width, height)
     VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
    [label, type, x, y, width, height]
  );
  res.status(201).json(rows[0]);
});

api.put('/objects/:id', async (req, res) => {
  const id = Number(req.params.id);
  const { label, type, x, y, width, height } = req.body;
  if (!label || !type || [x, y, width, height].some((v) => typeof v !== 'number')) {
    return res.status(400).json({ error: 'invalid object fields' });
  }
  const { rows } = await pool.query(
    `UPDATE objects SET label=$1, type=$2, x=$3, y=$4, width=$5, height=$6
     WHERE id=$7 RETURNING *`,
    [label, type, x, y, width, height, id]
  );
  if (!rows.length) return res.status(404).json({ error: 'object not found' });
  res.json(rows[0]);
});

api.delete('/objects/:id', async (req, res) => {
  const id = Number(req.params.id);
  const { rows } = await pool.query(
    'DELETE FROM objects WHERE id=$1 RETURNING *',
    [id]
  );
  if (!rows.length) return res.status(404).json({ error: 'object not found' });
  res.json(rows[0]);
});

// Bookings
api.get('/bookings', async (req, res) => {
  const { start, end, user, team } = req.query;
  const conditions = [];
  const values = [];
  let idx = 1;
  if (start && end) {
    conditions.push(`NOT ($${idx + 1} <= start_time OR $${idx} >= end_time)`);
    values.push(start, end);
    idx += 2;
  }
  if (user) {
    conditions.push(`user_id = $${idx}`);
    values.push(user);
    idx++;
  }
  if (team) {
    conditions.push(`team ILIKE $${idx}`);
    values.push(team);
    idx++;
  }
  let query = 'SELECT * FROM bookings';
  if (conditions.length) query += ' WHERE ' + conditions.join(' AND ');
  query += ' ORDER BY start_time DESC';
  const { rows } = await pool.query(query, values);
  res.json(rows);
});

api.post('/bookings', async (req, res) => {
  const {
    user_id,
    desk_id,
    start_time,
    end_time,
    name = null,
    team = null,
    company = null,
    repeat = null,
  } = req.body;

  if (!user_id || !desk_id || !start_time || !end_time) {
    return res.status(400).json({ error: 'missing fields' });
  }

  if (new Date(start_time) >= new Date(end_time)) {
    return res.status(400).json({ error: 'invalid time range' });
  }

  const bookingLimit = parseInt(process.env.BOOKING_LIMIT || '0', 10);
  const created = [];
  const repeatCount = repeat === 'weekly' ? 4 : 1;
  let s = new Date(start_time);
  let e = new Date(end_time);
  const recurringId = repeat ? require('crypto').randomUUID() : null;

  for (let i = 0; i < repeatCount; i++) {
    const [blockConflicts, conflicts] = await Promise.all([
      pool.query(
        `SELECT 1 FROM desk_blocks WHERE desk_id=$1 AND NOT ($3 <= start_time OR $2 >= end_time)`,
        [desk_id, s.toISOString(), e.toISOString()]
      ),
      pool.query(
        `SELECT 1 FROM bookings WHERE desk_id=$1 AND NOT ($3 <= start_time OR $2 >= end_time)`,
        [desk_id, s.toISOString(), e.toISOString()]
      ),
    ]);

    if (blockConflicts.rows.length)
      return res.status(409).json({ error: 'desk blocked for that time' });
    if (conflicts.rows.length)
      return res.status(409).json({ error: 'desk already booked' });

    if (bookingLimit) {
      const { rows: cntRows } = await pool.query(
        `SELECT COUNT(*) FROM bookings WHERE user_id=$1 AND start_time >= date_trunc('week', $2::timestamptz) AND start_time < date_trunc('week', $2::timestamptz) + interval '1 week'`,
        [user_id, s.toISOString()]
      );
      if (Number(cntRows[0].count) >= bookingLimit)
        return res.status(409).json({ error: 'booking limit reached' });
    }

    const { rows } = await pool.query(
      `INSERT INTO bookings (user_id, desk_id, start_time, end_time, name, team, company, recurring_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [user_id, desk_id, s.toISOString(), e.toISOString(), name, team, company, recurringId]
    );
    await logEvent('booking_created', { user_id, desk_id, start_time: s, end_time: e });
    created.push(rows[0]);
    s = new Date(s.getTime() + 7 * 24 * 3600 * 1000);
    e = new Date(e.getTime() + 7 * 24 * 3600 * 1000);
  }

  res.status(201).json(repeatCount === 1 ? created[0] : created);
});

api.put('/bookings/:id', async (req, res) => {
  const id = Number(req.params.id);
  const { desk_id, start_time, end_time, name, team, company } = req.body;
  if (!desk_id && !start_time && !end_time && !name && !team && !company) {
    return res.status(400).json({ error: 'no fields to update' });
  }

  const start = start_time ??
    (await pool.query('SELECT start_time FROM bookings WHERE id=$1', [id])).rows[0]?.start_time;
  const end = end_time ??
    (await pool.query('SELECT end_time FROM bookings WHERE id=$1', [id])).rows[0]?.end_time;
  const desk = desk_id ??
    (await pool.query('SELECT desk_id FROM bookings WHERE id=$1', [id])).rows[0]?.desk_id;

  if (!start || !end || !desk) return res.status(404).json({ error: 'booking not found' });

  if (new Date(start) >= new Date(end)) {
    return res.status(400).json({ error: 'invalid time range' });
  }

  const [blockConflicts, conflicts] = await Promise.all([
    pool.query(
      `SELECT 1 FROM desk_blocks WHERE desk_id=$1 AND NOT ($3 <= start_time OR $2 >= end_time)`,
      [desk, start, end]
    ),
    pool.query(
      `SELECT 1 FROM bookings WHERE desk_id=$1 AND id<>$4 AND NOT ($3 <= start_time OR $2 >= end_time)`,
      [desk, start, end, id]
    ),
  ]);

  if (blockConflicts.rows.length)
    return res.status(409).json({ error: 'desk blocked for that time' });
  if (conflicts.rows.length)
    return res.status(409).json({ error: 'desk already booked' });

  const booking = await updateBooking(id, { desk_id, start_time, end_time, name, team, company });
  res.json(booking);
});

api.delete('/bookings/:id', async (req, res) => {
  const id = Number(req.params.id);
  const future = req.query.future === 'true';
  const { rows } = await pool.query('SELECT * FROM bookings WHERE id=$1', [id]);
  if (!rows.length) return res.status(404).json({ error: 'booking not found' });
  const booking = rows[0];
  if (future && booking.recurring_id) {
    const { rows: del } = await pool.query(
      'DELETE FROM bookings WHERE recurring_id=$1 AND start_time >= $2 RETURNING *',
      [booking.recurring_id, booking.start_time]
    );
    return res.json(del);
  }
  const deleted = await deleteBooking(id);
  res.json(deleted);
});

// Events
api.get('/events', async (req, res) => {
  const { rows } = await pool.query('SELECT * FROM events ORDER BY event_time');
  res.json(rows);
});

api.get('/events/:id', async (req, res) => {
  const { id } = req.params;
  const { rows } = await pool.query('SELECT * FROM events WHERE id=$1', [id]);
  if (!rows.length) return res.status(404).json({ error: 'event not found' });
  res.json(rows[0]);
});

api.post('/events', async (req, res) => {
  const { title, description = null, event_time, visibility = 'public' } = req.body;
  if (!title || !event_time) {
    return res.status(400).json({ error: 'missing fields' });
  }
  const { rows } = await pool.query(
    `INSERT INTO events (title, description, event_time, visibility)
     VALUES ($1, $2, $3, $4) RETURNING *`,
    [title, description, event_time, visibility]
  );
  res.status(201).json(rows[0]);
});

api.put('/events/:id', async (req, res) => {
  const { id } = req.params;
  const fields = { title: req.body.title, description: req.body.description, event_time: req.body.event_time, visibility: req.body.visibility };
  const keys = Object.keys(fields).filter((k) => fields[k] !== undefined);
  if (!keys.length) return res.status(400).json({ error: 'no fields to update' });
  const set = keys.map((k, i) => `${k}=$${i + 1}`).join(', ');
  const values = keys.map((k) => fields[k]);
  values.push(id);
  const { rows } = await pool.query(
    `UPDATE events SET ${set} WHERE id=$${keys.length + 1} RETURNING *`,
    values
  );
  if (!rows.length) return res.status(404).json({ error: 'event not found' });
  res.json(rows[0]);
});

api.delete('/events/:id', async (req, res) => {
  const { id } = req.params;
  const { rows } = await pool.query('DELETE FROM events WHERE id=$1 RETURNING *', [id]);
  if (!rows.length) return res.status(404).json({ error: 'event not found' });
  res.json(rows[0]);
});

api.post('/events/:id/rsvp', async (req, res) => {
  const eventId = req.params.id;
  const { user_id, status } = req.body;
  if (!user_id || !status) return res.status(400).json({ error: 'missing fields' });
  const { rows } = await pool.query(
    `INSERT INTO rsvps (event_id, user_id, status)
     VALUES ($1, $2, $3) RETURNING *`,
    [eventId, user_id, status]
  );
  res.status(201).json(rows[0]);
});

// User
api.post('/users/me', async (req, res) => {
  res.json({ id: 'anon', email: 'test@example.com', role: 'user' });
});

api.get('/users', requireAdmin, async (req, res) => {
  const users = await getUsers();
  res.json(users);
});

api.put('/users/:id/role', requireAdmin, async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;
  if (!role) return res.status(400).json({ error: 'missing role' });
  const user = await updateUserRole(id, role);
  res.json(user);
});

// Analytics
api.get('/analytics', async (req, res) => {
  const { rows } = await pool.query(
    'SELECT desk_id, event_type, timestamp FROM analytics ORDER BY timestamp DESC'
  );
  res.json(rows);
});

api.get('/analytics/daily', async (req, res) => {
  const { rows } = await pool.query('SELECT * FROM daily_utilization');
  res.json(rows);
});

api.get('/analytics/weekly', async (req, res) => {
  const { rows } = await pool.query('SELECT * FROM weekly_utilization');
  res.json(rows);
});

// Daily heatmap counts for the past N days (default 90)
api.get('/analytics/heatmap', async (req, res) => {
  const days = Number(req.query.days || 90);
  const { rows } = await pool.query(
    `SELECT date_trunc('day', start_time) AS day, COUNT(*) AS bookings
     FROM bookings
     WHERE start_time >= NOW() - $1 * INTERVAL '1 day'
     GROUP BY day
     ORDER BY day`,
    [days]
  );
  res.json(rows);
});

// Aggregate bookings by team and company
api.get('/analytics/team', async (req, res) => {
  const { start, end } = req.query;
  const conditions = [];
  const values = [];
  let idx = 1;
  if (start && end) {
    conditions.push(`start_time >= $${idx} AND start_time < $${idx + 1}`);
    values.push(start, end);
    idx += 2;
  }
  let query =
    'SELECT team, company, COUNT(*) AS bookings FROM bookings';
  if (conditions.length) query += ' WHERE ' + conditions.join(' AND ');
  query += ' GROUP BY team, company ORDER BY bookings DESC';
  const { rows } = await pool.query(query, values);
  res.json(rows);
});

// Desk usage counts for floorplan heatmap
api.get('/analytics/floorplan', async (req, res) => {
  const days = Number(req.query.days || 30);
  const { rows } = await pool.query(
    `SELECT desk_id, COUNT(*) AS bookings
     FROM bookings
     WHERE start_time >= NOW() - $1 * INTERVAL '1 day'
     GROUP BY desk_id`,
    [days]
  );
  res.json(rows);
});

// Peak booking times by day of week and hour
api.get('/analytics/peaks', async (req, res) => {
  const days = Number(req.query.days || 30);
  const { rows } = await pool.query(
    `SELECT extract(dow from start_time) AS dow,
            extract(hour from start_time) AS hour,
            COUNT(*) AS bookings
     FROM bookings
     WHERE start_time >= NOW() - $1 * INTERVAL '1 day'
     GROUP BY dow, hour
     ORDER BY dow, hour`,
    [days]
  );
  res.json(rows);
});

api.get('/recommendation', async (req, res) => {
  const { rows } = await pool.query(
    `SELECT d.* FROM desks d
     LEFT JOIN (
       SELECT desk_id, COUNT(*) AS cnt
       FROM bookings
       WHERE start_time >= NOW() - INTERVAL '30 days'
       GROUP BY desk_id
     ) b ON d.id = b.desk_id
     WHERE d.status = 'available'
     ORDER BY COALESCE(b.cnt, 0) ASC, d.id
     LIMIT 1`
  );
  if (!rows.length) return res.status(404).json({ error: 'no desks available' });
  res.json(rows[0]);
});

// Alerts
async function sendAlertEmail(alerts) {
  if (!sendgridKey || !alertEmail || !alerts.length) return;
  const content = alerts.map(a => `${new Date(a.day).toLocaleDateString()}: ${a.bookings} bookings`).join('\n');
  try {
    await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${sendgridKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        personalizations: [{ to: [{ email: alertEmail }] }],
        from: { email: 'noreply@officebooking.com' },
        subject: 'Office Booking Alerts',
        content: [{ type: 'text/plain', value: content }],
      }),
    });
    console.log('Sent alert email');
  } catch (err) {
    console.error('failed to send alert email', err);
  }
}

async function sendAlertSms(alerts) {
  if (!twilioSid || !twilioToken || !twilioFrom || !alertPhone || !alerts.length) return;
  const content = alerts.map(a => `${new Date(a.day).toLocaleDateString()}: ${a.bookings} bookings`).join('\n');
  const url = `https://api.twilio.com/2010-04-01/Accounts/${twilioSid}/Messages.json`;
  const body = new URLSearchParams({ From: twilioFrom, To: alertPhone, Body: content });
  try {
    await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: 'Basic ' + Buffer.from(`${twilioSid}:${twilioToken}`).toString('base64'),
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body,
    });
    console.log('Sent alert SMS');
  } catch (err) {
    console.error('failed to send alert sms', err);
  }
}

api.get('/alerts', async (req, res) => {
  try {
    const fRes = await fetch(`${forecastUrl}/forecast`);
    const fData = await fRes.json();
    const { rows } = await pool.query('SELECT COUNT(*) FROM desks');
    const totalDesks = Number(rows[0].count);
    const threshold = totalDesks * 0.8;
    const alerts = fData.forecast.filter(d => d.bookings >= threshold);
    await sendAlertEmail(alerts);
    await sendAlertSms(alerts);
    res.json({ alerts });
  } catch (err) {
    console.error('failed to fetch alerts', err);
    res.status(500).json({ error: 'failed to fetch alerts' });
  }
});

// Proxy forecast data from the Python service
api.get('/forecast', async (req, res) => {
  try {
    const fRes = await fetch(`${forecastUrl}/forecast`);
    const data = await fRes.json();
    res.json(data);
  } catch (err) {
    console.error('failed to fetch forecast', err);
    res.status(500).json({ error: 'failed to fetch forecast' });
  }
});

// Chatbot
api.post('/chatbot', async (req, res) => {
  const apiKey = process.env.OPENAI_API_KEY;
  const { message } = req.body;
  if (!message) return res.status(400).json({ error: 'missing message' });

  // Basic lookup for bookings by team or person before hitting OpenAI
  const teamMatch = message.match(/team\s+([\w-]+)/i);
  const personMatch = message.match(/(?:user|person|name)\s+([\w-]+)/i);
  const lookupValue = teamMatch?.[1] || personMatch?.[1];
  const lookupField = teamMatch ? 'team' : personMatch ? 'name' : null;
  if (lookupField && lookupValue) {
    try {
      const { rows } = await pool.query(
        `SELECT start_time FROM bookings WHERE ${lookupField} ILIKE $1 ORDER BY start_time`,
        [lookupValue]
      );
      if (!rows.length) {
        return res.json({ reply: `No bookings found for ${lookupValue}.` });
      }
      const dates = [...new Set(rows.map(r => new Date(r.start_time).toLocaleDateString()))];
      return res.json({ reply: `${lookupValue} has bookings on: ${dates.join(', ')}` });
    } catch (err) {
      console.error('lookup failed', err);
      return res.status(500).json({ error: 'lookup failed' });
    }
  }

  if (!apiKey) return res.status(501).json({ error: 'chatbot not configured' });

  try {
    const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: message }],
        max_tokens: 100,
      }),
    });
    const data = await openaiRes.json();
    const reply = data?.choices?.[0]?.message?.content;
    res.json({ reply });
  } catch (err) {
    console.error('chatbot failed', err);
    res.status(500).json({ error: 'chatbot failed' });
  }
});

  // Mount API router
  app.use('/api', api);

  // Fallback for SPA routes
  app.get('*', (req, res) => {
    res.sendFile(path.join(webRoot, 'index.html'));
  });

  return app;
}

module.exports = { createApp };

// Server
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  init()
    .then(() => {
      createApp().listen(PORT, () => {
        console.log(`API server listening on port ${PORT}`);
      });
    })
    .catch((err) => {
      console.error('Failed to initialize DB', err);
      process.exit(1);
    });
}
