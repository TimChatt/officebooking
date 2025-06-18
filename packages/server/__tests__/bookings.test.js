const request = require('supertest');
const { createApp } = require('..');
const db = require('../db');

jest.mock('../db', () => {
  const mockPool = { query: jest.fn() };
  return { pool: mockPool, init: jest.fn() };
});

beforeEach(() => {
  db.pool.query.mockReset();
});

test('GET /bookings returns rows', async () => {
  db.pool.query.mockResolvedValue({ rows: [{ id: 1 }] });
  const app = createApp();
  const res = await request(app).get('/bookings');
  expect(res.statusCode).toBe(200);
  expect(res.body).toEqual([{ id: 1 }]);
});

test('POST /bookings validates fields', async () => {
  const app = createApp();
  const res = await request(app).post('/bookings').send({});
  expect(res.statusCode).toBe(400);
});

test('POST /bookings detects conflict', async () => {
  db.pool.query.mockResolvedValueOnce({ rows: [{ id: 1 }] });
  const app = createApp();
  const payload = { user_id: 'u1', desk_id: 1, start_time: 's', end_time: 'e' };
  const res = await request(app).post('/bookings').send(payload);
  expect(res.statusCode).toBe(409);
});

test('POST /bookings creates booking', async () => {
  db.pool.query
    .mockResolvedValueOnce({ rows: [] })
    .mockResolvedValueOnce({ rows: [{ id: 1 }] });
  const app = createApp();
  const payload = { user_id: 'u1', desk_id: 1, start_time: 's', end_time: 'e' };
  const res = await request(app).post('/bookings').send(payload);
  expect(res.statusCode).toBe(201);
  expect(res.body).toEqual({ id: 1 });
});
