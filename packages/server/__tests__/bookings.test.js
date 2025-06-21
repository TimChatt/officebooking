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
  const payload = {
    user_id: 'u1',
    desk_id: 1,
    start_time: '2023-01-01T10:00:00Z',
    end_time: '2023-01-01T11:00:00Z',
    name: 'A',
    team: 'T',
    company: 'Hawk-Eye'
  };
  const res = await request(app).post('/bookings').send(payload);
  expect(res.statusCode).toBe(409);
});

test('POST /bookings creates booking', async () => {
  db.pool.query
    .mockResolvedValueOnce({ rows: [] })
    .mockResolvedValueOnce({ rows: [] })
    .mockResolvedValueOnce({ rows: [{ id: 1 }] });
  const app = createApp();
  const payload = {
    user_id: 'u1',
    desk_id: 1,
    start_time: '2023-01-01T10:00:00Z',
    end_time: '2023-01-01T11:00:00Z',
    name: 'A',
    team: 'T',
    company: 'Hawk-Eye'
  };
  const res = await request(app).post('/bookings').send(payload);
  expect(res.statusCode).toBe(201);
  expect(res.body).toEqual({ id: 1 });
});

test('POST /bookings rejects invalid time range', async () => {
  const app = createApp();
  const payload = {
    user_id: 'u1',
    desk_id: 1,
    start_time: '2023-01-02T10:00:00Z',
    end_time: '2023-01-02T09:00:00Z',
    name: 'A',
    team: 'T',
    company: 'Hawk-Eye'
  };
  const res = await request(app).post('/bookings').send(payload);
  expect(res.statusCode).toBe(400);
});

test('PUT /bookings rejects invalid time range', async () => {
  db.pool.query.mockResolvedValue({ rows: [{ desk_id: 1 }] });
  const app = createApp();
  const payload = {
    start_time: '2023-01-02T10:00:00Z',
    end_time: '2023-01-02T09:00:00Z'
  };
  const res = await request(app).put('/bookings/1').send(payload);
  expect(res.statusCode).toBe(400);
});

test('POST /bookings enforces weekly cap', async () => {
  process.env.BOOKING_LIMIT = '1';
  db.pool.query
    .mockResolvedValueOnce({ rows: [] }) // block check
    .mockResolvedValueOnce({ rows: [] }) // conflict check
    .mockResolvedValueOnce({ rows: [{ count: '1' }] });
  const app = createApp();
  const payload = {
    user_id: 'u1',
    desk_id: 1,
    start_time: '2023-01-03T10:00:00Z',
    end_time: '2023-01-03T11:00:00Z',
    name: 'A',
    team: 'T',
    company: 'Hawk-Eye'
  };
  const res = await request(app).post('/bookings').send(payload);
  expect(res.statusCode).toBe(409);
  delete process.env.BOOKING_LIMIT;
});
