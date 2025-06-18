const express = require('express');
const { pool, init } = require('./db');
const app = express();

app.use(express.json());


const app = express();

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.get('/desks', async (req, res) => {
  const { rows } = await pool.query('SELECT * FROM desks ORDER BY id');
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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`API server listening on port ${PORT}`);

});
