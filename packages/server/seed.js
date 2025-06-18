const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });
const { pool } = require('./db');

async function seed() {
  // clear existing desks
  await pool.query('DELETE FROM desks');

  const deskWidth = 1;
  const deskHeight = 1;
  const aisle = 2; // spacing between the two sets
  const rowsPerSet = 10;
  const desksPerRow = 8;
  const desks = [];

  for (let set = 0; set < 2; set++) {
    const offsetX = set * (desksPerRow * deskWidth + aisle);
    for (let row = 0; row < rowsPerSet; row++) {
      for (let col = 0; col < desksPerRow; col++) {
        desks.push({
          x: offsetX + col * deskWidth,
          y: row * deskHeight,
          width: deskWidth,
          height: deskHeight,
        });
      }
    }
  }

  for (const d of desks) {
    await pool.query(
      'INSERT INTO desks (x, y, width, height) VALUES ($1, $2, $3, $4)',
      [d.x, d.y, d.width, d.height]
    );
  }

  console.log(`Seeded ${desks.length} desks`);
  await pool.end();
}

seed().catch((err) => {
  console.error('seed failed', err);
  pool.end();
});
