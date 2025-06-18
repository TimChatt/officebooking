const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });
const express = require('express');
const cors = require('cors');
const { pool, init } = require('./db');
const app = express();

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

app.get('/bookings', async (req, res) => {
  const { rows } = await pool.query(
    'SELECT * FROM bookings ORDER BY start_time DESC'
  );
  res.json(rows);
});

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

const PORT = process.env.PORT || 3000;
init().then(() => {
  app.listen(PORT, () => {
    console.log(`API server listening on port ${PORT}`);
  });
}).catch((err) => {
  console.error('Failed to initialize DB', err);
  process.exit(1);
});
