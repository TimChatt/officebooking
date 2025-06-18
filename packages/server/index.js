const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });
const express = require('express');
const cors = require('cors');
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

const app = express();
app.use(express.json());
app.use(cors());

function requireAdmin(req, res, next) {
  if (req.headers['x-user-role'] !== 'admin') {
    return res.status(403).json({ error: 'admin only' });
  }
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
  res.json(rows[0]);
});

  const { rows: blockConflicts } = await pool.query(
    `SELECT 1 FROM desk_blocks
     WHERE desk_id=$1 AND NOT ($3 <= start_time OR $2 >= end_time)`,
    [desk_id, start_time, end_time]
  );
  if (blockConflicts.length) {
    return res.status(409).json({ error: 'desk blocked for that time' });
  }
  next();
}

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
=======
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

app.put('/desks/:id', checkJwt, async (req, res) => {
=======
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
=======
app.post('/bookings', async (req, res) => {
  const { user_id, desk_id, start_time, end_time } = req.body;
  if (!user_id || !desk_id || !start_time || !end_time) {
    return res.status(400).json({ error: 'missing fields' });
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

const PORT = process.env.PORT || 3000;
init().then(() => {
  app.listen(PORT, () => {
    console.log(`API server listening on port ${PORT}`);
  });
}).catch((err) => {
  console.error('Failed to initialize DB', err);
  process.exit(1);
});
=======

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

