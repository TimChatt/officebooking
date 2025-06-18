const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });
const express = require('express');
const cors = require('cors');
const {
  pool,
  init,
  logEvent,
  ensureUser,
  getUserRole,
  getUsers,
  updateUserRole,
  updateBooking,
  deleteBooking,
  deleteDesk,
} = require('./db');
const { checkJwt } = require('./auth');
const app = express();
const sendgridKey = process.env.SENDGRID_API_KEY;
const alertEmail = process.env.ALERT_EMAIL;
const twilioSid = process.env.TWILIO_ACCOUNT_SID;
const twilioToken = process.env.TWILIO_AUTH_TOKEN;
const twilioFrom = process.env.TWILIO_FROM;
const alertPhone = process.env.ALERT_PHONE;

async function sendAlertEmail(alerts) {
  if (!sendgridKey || !alertEmail || !alerts.length) return;
  const content = alerts
    .map((a) => `${new Date(a.day).toLocaleDateString()}: ${a.bookings} bookings`)
    .join('\n');
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
  const content = alerts
    .map((a) => `${new Date(a.day).toLocaleDateString()}: ${a.bookings} bookings`)
    .join('\n');
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

app.use(express.json());
app.use(cors());

async function requireAdmin(req, res, next) {
  const role = await getUserRole(req.auth.sub);
  if (role !== 'admin') {
=======
const { pool, init, logEvent } = require('./db');
const { checkJwt } = require('./auth');
const app = express();

app.use(express.json());
app.use(cors());

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});


const express = require('express');
const cors = require('cors');
const { auth } = require('express-oauth2-jwt-bearer');

const { pool, init } = require('./db');

function createApp() {
  const app = express();

const { pool, init } = require('./db');

app.put('/desks/:id', async (req, res) => {
  const id = Number(req.params.id);
  const { x, y, width, height, status = 'available' } = req.body;
  if (
    typeof x !== 'number' ||
    typeof y !== 'number' ||
    typeof width !== 'number' ||
    typeof height !== 'number'
  ) {
    return res.status(400).json({ error: 'invalid desk fields' });
  }
  const { rows } = await pool.query(
    `UPDATE desks SET x=$1, y=$2, width=$3, height=$4, status=$5
     WHERE id=$6 RETURNING *`,
    [x, y, width, height, status, id]
  );
  if (!rows.length) {
    return res.status(404).json({ error: 'desk not found' });
  }
  res.json(rows[0]);
});

const app = express();
app.use(express.json());
app.use(cors());

function requireAdmin(req, res, next) {
  if (req.headers['x-user-role'] !== 'admin') {
    return res.status(403).json({ error: 'admin only' });
  }
  next();
}

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

=======
  app.use(express.json());
  app.use(cors());

  app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
  });

  app.get('/desks', async (req, res) => {
    const { rows } = await pool.query('SELECT * FROM desks ORDER BY id');
    res.json(rows);
  });

  app.post('/desks', async (req, res) => {
    const { x, y, width, height, status = 'available' } = req.body;
    if (
      typeof x !== 'number' ||
      typeof y !== 'number' ||
      typeof width !== 'number' ||
      typeof height !== 'number'
    ) {
      return res.status(400).json({ error: 'invalid desk fields' });
    }
    const { rows } = await pool.query(
      `INSERT INTO desks (x, y, width, height, status)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [x, y, width, height, status]
    );
    res.status(201).json(rows[0]);
  });

  app.get('/bookings', async (req, res) => {
    const { rows } = await pool.query(
      'SELECT * FROM bookings ORDER BY start_time DESC'
    );
    res.json(rows);
  });
const jwtCheck = auth({
  audience: process.env.AUTH0_AUDIENCE,
  issuerBaseURL: `https://${process.env.AUTH0_DOMAIN}/`,
  tokenSigningAlg: 'RS256',
});

app.use(jwtCheck);

app.get('/desks', async (req, res) => {
  const { rows } = await pool.query('SELECT * FROM desks ORDER BY id');
  res.json(rows);
});

app.post('/desks', checkJwt, async (req, res) => {

app.post('/desks', async (req, res) => {

  const { x, y, width, height, status = 'available' } = req.body;
  if (
    typeof x !== 'number' ||
    typeof y !== 'number' ||
    typeof width !== 'number' ||
    typeof height !== 'number'
  ) {
    return res.status(400).json({ error: 'invalid desk fields' });
  }
  const { rows } = await pool.query(
    `INSERT INTO desks (x, y, width, height, status)
     VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [x, y, width, height, status]
  );
  res.status(201).json(rows[0]);
});

app.put('/bookings/:id', checkJwt, async (req, res) => {
  const id = Number(req.params.id);
  const { desk_id, start_time, end_time } = req.body;
  if (!desk_id && !start_time && !end_time) {
    return res.status(400).json({ error: 'no fields to update' });
  }
  const fields = {};
  if (desk_id) fields.desk_id = desk_id;
  if (start_time) fields.start_time = start_time;
  if (end_time) fields.end_time = end_time;
  const start = start_time ?? (await pool.query('SELECT start_time FROM bookings WHERE id=$1', [id])).rows[0]?.start_time;
  const end = end_time ?? (await pool.query('SELECT end_time FROM bookings WHERE id=$1', [id])).rows[0]?.end_time;
  const desk = desk_id ?? (await pool.query('SELECT desk_id FROM bookings WHERE id=$1', [id])).rows[0]?.desk_id;
  if (!start || !end || !desk) return res.status(404).json({ error: 'booking not found' });
  const { rows: blockConflicts } = await pool.query(
    `SELECT 1 FROM desk_blocks WHERE desk_id=$1 AND NOT ($3 <= start_time OR $2 >= end_time)`,
    [desk, start, end]
  );
  if (blockConflicts.length) {
    return res.status(409).json({ error: 'desk blocked for that time' });
  }
  const { rows: conflicts } = await pool.query(
    `SELECT 1 FROM bookings WHERE desk_id=$1 AND id<>$4 AND NOT ($3 <= start_time OR $2 >= end_time)`,
    [desk, start, end, id]
  );
  if (conflicts.length) {
    return res.status(409).json({ error: 'desk already booked' });
  }
  const booking = await updateBooking(id, fields);
  res.json(booking);
});

app.delete('/bookings/:id', checkJwt, async (req, res) => {
  const id = Number(req.params.id);
  const booking = await deleteBooking(id);
  if (!booking) return res.status(404).json({ error: 'booking not found' });
  res.json(booking);
});

app.put('/desks/:id', checkJwt, async (req, res) => {

app.put('/desks/:id', async (req, res) => {


  const id = Number(req.params.id);
  const { x, y, width, height, status = 'available' } = req.body;
  if (
    typeof x !== 'number' ||
    typeof y !== 'number' ||
    typeof width !== 'number' ||
    typeof height !== 'number'
  ) {
    return res.status(400).json({ error: 'invalid desk fields' });

  const id = parseInt(req.params.id, 10);
  const { x, y, width, height, status } = req.body;
  if (!id || isNaN(id)) {
    return res.status(400).json({ error: 'invalid id' });

  }
  const { rows } = await pool.query(
    `UPDATE desks SET x=$1, y=$2, width=$3, height=$4, status=$5
     WHERE id=$6 RETURNING *`,
    [x, y, width, height, status, id]
  );
  if (!rows.length) {
    return res.status(404).json({ error: 'desk not found' });
  }
  res.json(rows[0]);
});

app.delete('/desks/:id', checkJwt, async (req, res) => {
  const id = Number(req.params.id);
  const desk = await deleteDesk(id);
  if (!desk) return res.status(404).json({ error: 'desk not found' });
  res.json(desk);
});

app.post('/users/me', checkJwt, async (req, res) => {
  const user = await ensureUser(req.auth.sub, req.auth.email || '');
  res.json(user);
});

app.get('/users', checkJwt, requireAdmin, async (req, res) => {
  const users = await getUsers();
  res.json(users);
});

app.put('/users/:id/role', checkJwt, requireAdmin, async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;
  if (!role) return res.status(400).json({ error: 'missing role' });
  const user = await updateUserRole(id, role);
  res.json(user);
});

app.get('/desks/:id/blocks', checkJwt, async (req, res) => {
  const deskId = Number(req.params.id);
  const { rows } = await pool.query(
    'SELECT * FROM desk_blocks WHERE desk_id=$1 ORDER BY start_time',
    [deskId]
  );
  res.json(rows);
});

app.post('/desks/:id/blocks', checkJwt, async (req, res) => {
  const deskId = Number(req.params.id);
  const { start_time, end_time } = req.body;
  if (!start_time || !end_time) {
    return res.status(400).json({ error: 'missing fields' });
  }
  const { rows } = await pool.query(
    `INSERT INTO desk_blocks (desk_id, start_time, end_time)
     VALUES ($1, $2, $3) RETURNING *`,
    [deskId, start_time, end_time]
  );
  res.status(201).json(rows[0]);
});

app.delete('/desks/:deskId/blocks/:blockId', checkJwt, async (req, res) => {
  const { deskId, blockId } = req.params;
  const { rows } = await pool.query(
    'DELETE FROM desk_blocks WHERE id=$1 AND desk_id=$2 RETURNING *',
    [blockId, deskId]
  );
  if (!rows.length) {
    return res.status(404).json({ error: 'block not found' });
  }


  await pool.query(
    `INSERT INTO analytics (desk_id, event_type) VALUES ($1, 'desk_moved')`,
    [id]
  );

  res.json(rows[0]);
});

app.get('/bookings', async (req, res) => {
  const { rows } = await pool.query(
    'SELECT * FROM bookings ORDER BY start_time DESC'
  );
  res.json(rows);
});

app.post('/bookings', checkJwt, async (req, res) => {

app.post('/bookings', async (req, res) => {

  const { user_id, desk_id, start_time, end_time } = req.body;
  if (!user_id || !desk_id || !start_time || !end_time) {
    return res.status(400).json({ error: 'missing fields' });
  }

  await ensureUser(req.auth.sub, req.auth.email || '');

  const { rows: blockConflicts } = await pool.query(
    `SELECT 1 FROM desk_blocks
     WHERE desk_id=$1 AND NOT ($3 <= start_time OR $2 >= end_time)`,
    [desk_id, start_time, end_time]
  );
  if (blockConflicts.length) {
    return res.status(409).json({ error: 'desk blocked for that time' });
  }

  const { rows: conflicts } = await pool.query(
    `SELECT 1 FROM bookings
     WHERE desk_id=$1 AND NOT ($3 <= start_time OR $2 >= end_time)`,
    [desk_id, start_time, end_time]
  );
  if (conflicts.length) {
    return res.status(409).json({ error: 'desk already booked' });
  }

    const { rows } = await pool.query(
      `INSERT INTO bookings (user_id, desk_id, start_time, end_time)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [user_id, desk_id, start_time, end_time]
    );
    res.status(201).json(rows[0]);
  });

  return app;
}

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

module.exports = { createApp };

  const { rows } = await pool.query(
    `INSERT INTO bookings (user_id, desk_id, start_time, end_time)
     VALUES ($1, $2, $3, $4) RETURNING *`,
    [user_id, desk_id, start_time, end_time]
  );
  await logEvent('booking_created', { user_id, desk_id, start_time, end_time });
  res.status(201).json(rows[0]);
});

app.get('/analytics/daily', async (req, res) => {
  const { rows } = await pool.query('SELECT * FROM daily_utilization');
  res.json(rows);
});

app.get('/analytics/weekly', async (req, res) => {
  const { rows } = await pool.query('SELECT * FROM weekly_utilization');
  res.json(rows);
});

app.get('/recommendation', async (req, res) => {
  const { rows } = await pool.query(
    `SELECT d.*
       FROM desks d
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
  if (!rows.length) {
    return res.status(404).json({ error: 'no desks available' });
  }
  res.json(rows[0]);
});

app.get('/alerts', async (req, res) => {
  try {
    const fRes = await fetch('http://localhost:8000/forecast');
    const fData = await fRes.json();
    const { rows } = await pool.query('SELECT COUNT(*) FROM desks');
    const totalDesks = Number(rows[0].count);
    const threshold = totalDesks * 0.8;
    const alerts = fData.forecast.filter((d) => d.bookings >= threshold);
    await sendAlertEmail(alerts);
    await sendAlertSms(alerts);
    res.json({ alerts });
  } catch (err) {
    console.error('failed to fetch alerts', err);
    res.status(500).json({ error: 'failed to fetch alerts' });
  }
});

const PORT = process.env.PORT || 3000;
init().then(() => {
  app.listen(PORT, () => {
    console.log(`API server listening on port ${PORT}`);
  });
=======
const PORT = process.env.PORT || 3000;
init().then(() => {
  app.listen(PORT, () => {
    console.log(`API server listening on port ${PORT}`);
  });
}).catch((err) => {
  console.error('Failed to initialize DB', err);
  process.exit(1);
});

  res.status(201).json(rows[0]);
});

const PORT = process.env.PORT || 3000;
init()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`API server listening on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to initialize DB', err);
    process.exit(1);
  });


}).catch((err) => {
  console.error('Failed to initialize DB', err);
  process.exit(1);
});

async function checkAlertsDaily() {
  try {
    const res = await fetch('http://localhost:3000/alerts');
    if (res.ok) {
      const data = await res.json();
      await sendAlertEmail(data.alerts || []);
      await sendAlertSms(data.alerts || []);
    }
  } catch (err) {
    console.error('scheduled alert check failed', err);
  }
}

setInterval(checkAlertsDaily, 24 * 60 * 60 * 1000);
checkAlertsDaily();
=======
  await pool.query(
    `INSERT INTO analytics (desk_id, event_type) VALUES ($1, 'booking_created')`,
    [desk_id]
  );
  res.status(201).json(rows[0]);
});


app.get('/analytics', async (req, res) => {
  const { rows } = await pool.query(
    'SELECT desk_id, event_type, timestamp FROM analytics ORDER BY timestamp DESC'
  );
  res.json(rows);
});

const admin = express.Router();
admin.use(requireAdmin);

admin.post('/desks/:id/block', async (req, res) => {
  const { id } = req.params;
  await pool.query('UPDATE desks SET status=$1 WHERE id=$2', ['blocked', id]);
  res.json({ id, status: 'blocked' });
});

admin.post('/desks/:id/unblock', async (req, res) => {
  const { id } = req.params;
  await pool.query('UPDATE desks SET status=$1 WHERE id=$2', ['available', id]);
  res.json({ id, status: 'available' });
});

admin.get('/users', async (req, res) => {
  const { rows } = await pool.query('SELECT id, name, role FROM users ORDER BY id');
  res.json(rows);
});

admin.post('/users', async (req, res) => {
  const { name, role = 'user' } = req.body;
  if (!name) {
    return res.status(400).json({ error: 'missing name' });
  }
  const { rows } = await pool.query(
    'INSERT INTO users (name, role) VALUES ($1, $2) RETURNING id, name, role',
    [name, role]
  );
  res.status(201).json(rows[0]);
});

admin.patch('/users/:id', async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;
  if (!role) {
    return res.status(400).json({ error: 'missing role' });
  }
  const { rows } = await pool.query(
    'UPDATE users SET role=$1 WHERE id=$2 RETURNING id, name, role',
    [role, id]
  );
  if (!rows.length) {
    return res.status(404).json({ error: 'not found' });
  }
  res.json(rows[0]);
});

app.use('/admin', admin);

const PORT = process.env.PORT || 3000;
init()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`API server listening on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to initialize DB', err);
    process.exit(1);
  });

