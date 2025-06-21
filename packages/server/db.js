const { Pool } = require('pg');

if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL environment variable is not set.');
  process.exit(1);
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function init() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS desks (
      id SERIAL PRIMARY KEY,
      x INTEGER NOT NULL,
      y INTEGER NOT NULL,
      width INTEGER NOT NULL,
      height INTEGER NOT NULL,
      status VARCHAR(20) DEFAULT 'available'
    );
    CREATE TABLE IF NOT EXISTS objects (
      id SERIAL PRIMARY KEY,
      label VARCHAR(255) NOT NULL,
      type VARCHAR(50) NOT NULL,
      x INTEGER NOT NULL,
      y INTEGER NOT NULL,
      width INTEGER NOT NULL,
      height INTEGER NOT NULL
    );
    CREATE TABLE IF NOT EXISTS bookings (
      id SERIAL PRIMARY KEY,
      user_id VARCHAR(255) NOT NULL,
      desk_id INTEGER REFERENCES desks(id),
      start_time TIMESTAMPTZ NOT NULL,
      end_time TIMESTAMPTZ NOT NULL,
      name VARCHAR(255),
      team VARCHAR(255),
      company VARCHAR(100),
      recurring_id UUID
    );
    ALTER TABLE bookings ADD COLUMN IF NOT EXISTS name VARCHAR(255);
    ALTER TABLE bookings ADD COLUMN IF NOT EXISTS team VARCHAR(255);
    ALTER TABLE bookings ADD COLUMN IF NOT EXISTS company VARCHAR(100);
    ALTER TABLE bookings ADD COLUMN IF NOT EXISTS recurring_id UUID;
    CREATE TABLE IF NOT EXISTS desk_blocks (
      id SERIAL PRIMARY KEY,
      desk_id INTEGER REFERENCES desks(id),
      start_time TIMESTAMPTZ NOT NULL,
      end_time TIMESTAMPTZ NOT NULL
    );
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      auth0_id VARCHAR(255) UNIQUE NOT NULL,
      email VARCHAR(255) NOT NULL,
      role VARCHAR(20) DEFAULT 'user'
    );
    CREATE TABLE IF NOT EXISTS analytics (
      id SERIAL PRIMARY KEY,
      event_type VARCHAR(50) NOT NULL,
      user_id VARCHAR(255),
      desk_id INTEGER,
      timestamp TIMESTAMPTZ DEFAULT NOW(),
      payload JSONB
    );
    CREATE TABLE IF NOT EXISTS events (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      description TEXT,
      event_time TIMESTAMPTZ NOT NULL,
      visibility VARCHAR(20) DEFAULT 'public'
    );
    CREATE TABLE IF NOT EXISTS rsvps (
      id SERIAL PRIMARY KEY,
      event_id INTEGER REFERENCES events(id) ON DELETE CASCADE,
      user_id VARCHAR(255) NOT NULL,
      status VARCHAR(20)
    );
    CREATE OR REPLACE VIEW daily_utilization AS
      SELECT date_trunc('day', start_time) AS day, COUNT(*) AS bookings
      FROM bookings
      GROUP BY day
      ORDER BY day DESC;
    CREATE OR REPLACE VIEW weekly_utilization AS
      SELECT date_trunc('week', start_time) AS week, COUNT(*) AS bookings
      FROM bookings
      GROUP BY week
      ORDER BY week DESC;
  `);
}

async function logEvent(event_type, details = {}) {
  const { user_id = null, desk_id = null, ...payload } = details;
  await pool.query(
    `INSERT INTO analytics (event_type, user_id, desk_id, payload)
     VALUES ($1, $2, $3, $4)`,
    [event_type, user_id, desk_id, JSON.stringify(payload)]
  );
}

async function ensureUser(auth0_id, email) {
  const { rows } = await pool.query(
    'SELECT * FROM users WHERE auth0_id=$1',
    [auth0_id]
  );
  if (rows.length) return rows[0];
  const { rows: inserted } = await pool.query(
    'INSERT INTO users (auth0_id, email) VALUES ($1, $2) RETURNING *',
    [auth0_id, email]
  );
  return inserted[0];
}

async function getUserRole(auth0_id) {
  const { rows } = await pool.query(
    'SELECT role FROM users WHERE auth0_id=$1',
    [auth0_id]
  );
  return rows.length ? rows[0].role : null;
}

async function getUsers() {
  const { rows } = await pool.query('SELECT id, auth0_id, email, role FROM users ORDER BY id');
  return rows;
}

async function updateUserRole(id, role) {
  const { rows } = await pool.query(
    'UPDATE users SET role=$1 WHERE id=$2 RETURNING *',
    [role, id]
  );
  return rows[0];
}

async function updateBooking(id, fields) {
  const keys = [];
  const values = [];
  let idx = 1;
  for (const [k, v] of Object.entries(fields)) {
    keys.push(`${k}=$${idx++}`);
    values.push(v);
  }
  if (!keys.length) return null;
  values.push(id);
  const { rows } = await pool.query(
    `UPDATE bookings SET ${keys.join(', ')} WHERE id=$${idx} RETURNING *`,
    values
  );
  return rows[0];
}

async function deleteBooking(id) {
  const { rows } = await pool.query(
    'DELETE FROM bookings WHERE id=$1 RETURNING *',
    [id]
  );
  return rows[0];
}

async function deleteDesk(id) {
  const { rows } = await pool.query(
    'DELETE FROM desks WHERE id=$1 RETURNING *',
    [id]
  );
  return rows[0];
}

module.exports = {
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
};

