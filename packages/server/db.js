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
    CREATE TABLE IF NOT EXISTS bookings (
      id SERIAL PRIMARY KEY,
      user_id VARCHAR(255) NOT NULL,
      desk_id INTEGER REFERENCES desks(id),
      start_time TIMESTAMPTZ NOT NULL,
      end_time TIMESTAMPTZ NOT NULL
    );
    CREATE TABLE IF NOT EXISTS analytics (
      id SERIAL PRIMARY KEY,
      desk_id INTEGER REFERENCES desks(id),
      event_type VARCHAR(50) NOT NULL,
      timestamp TIMESTAMPTZ DEFAULT NOW()
    );
  `);
}

module.exports = { pool, init };
