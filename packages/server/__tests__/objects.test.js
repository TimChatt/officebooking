const request = require('supertest');
jest.mock('../auth', () => ({ checkJwt: (req, res, next) => next() }));
const { createApp } = require('../index');
const db = require('../db');

jest.mock('../db', () => {
  const mockPool = { query: jest.fn() };
  return { pool: mockPool, init: jest.fn(), logEvent: jest.fn() };
});

beforeEach(() => {
  db.pool.query.mockReset();
});

test('GET /objects returns rows', async () => {
  db.pool.query.mockResolvedValue({ rows: [{ id: 1 }] });
  const app = createApp();
  const res = await request(app).get('/api/objects');
  expect(res.statusCode).toBe(200);
  expect(res.body).toEqual([{ id: 1 }]);
  expect(db.pool.query).toHaveBeenCalledWith('SELECT * FROM objects ORDER BY id');
});

test('POST /objects validates fields', async () => {
  const app = createApp();
  const res = await request(app).post('/api/objects').send({ label: 'x' });
  expect(res.statusCode).toBe(400);
});

test('POST /objects creates object', async () => {
  db.pool.query.mockResolvedValue({ rows: [{ id: 1 }] });
  const app = createApp();
  const payload = { label: 'Kitchen', type: 'Kitchen', x: 1, y: 2, width: 3, height: 4 };
  const res = await request(app).post('/api/objects').send(payload);
  expect(res.statusCode).toBe(201);
  expect(res.body).toEqual({ id: 1 });
  expect(db.pool.query).toHaveBeenCalledWith(
    expect.stringContaining('INSERT INTO objects'),
    ['Kitchen', 'Kitchen', 1, 2, 3, 4]
  );
});
