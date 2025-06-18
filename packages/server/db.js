const { Pool } = require('pg');


    CREATE TABLE IF NOT EXISTS desk_blocks (
      id SERIAL PRIMARY KEY,
      desk_id INTEGER REFERENCES desks(id),
      start_time TIMESTAMPTZ NOT NULL,
      end_time TIMESTAMPTZ NOT NULL
    );
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
    CREATE TABLE IF NOT EXISTS bookings (
      id SERIAL PRIMARY KEY,
      user_id VARCHAR(255) NOT NULL,

    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      auth0_id VARCHAR(255) UNIQUE NOT NULL,
      email VARCHAR(255) NOT NULL
    );
    CREATE TABLE IF NOT EXISTS bookings (
      id SERIAL PRIMARY KEY,
      user_id VARCHAR(255) NOT NULL,

    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      role VARCHAR(20) DEFAULT 'user'
    );
    CREATE TABLE IF NOT EXISTS bookings (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id),

      desk_id INTEGER REFERENCES desks(id),
      start_time TIMESTAMPTZ NOT NULL,
      end_time TIMESTAMPTZ NOT NULL
    );
    CREATE TABLE IF NOT EXISTS analytics (
      id SERIAL PRIMARY KEY,
      event_type VARCHAR(50) NOT NULL,
      user_id VARCHAR(255),
      desk_id INTEGER,
      timestamp TIMESTAMPTZ DEFAULT NOW(),
      payload JSONB
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

module.exports = { pool, init, logEvent };

    CREATE TABLE IF NOT EXISTS analytics (
      id SERIAL PRIMARY KEY,
      desk_id INTEGER REFERENCES desks(id),
      event_type VARCHAR(50) NOT NULL,
      timestamp TIMESTAMPTZ DEFAULT NOW()
    );

  `);
}

module.exports = { pool, init };
