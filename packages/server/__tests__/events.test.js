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

test('GET /events returns rows', async () => {
  db.pool.query.mockResolvedValue({ rows: [{ id: 1 }] });
  const app = createApp();
  const res = await request(app).get('/events');
  expect(res.statusCode).toBe(200);
  expect(res.body).toEqual([{ id: 1 }]);
  expect(db.pool.query).toHaveBeenCalledWith('SELECT * FROM events ORDER BY event_time');
});

test('POST /events validates fields', async () => {
  const app = createApp();
  const res = await request(app).post('/events').send({});
  expect(res.statusCode).toBe(400);
});

test('POST /events creates event', async () => {
  db.pool.query.mockResolvedValue({ rows: [{ id: 1 }] });
  const app = createApp();
  const payload = { title: 't', event_time: 'now' };
  const res = await request(app).post('/events').send(payload);
  expect(res.statusCode).toBe(201);
  expect(res.body).toEqual({ id: 1 });
  expect(db.pool.query).toHaveBeenCalledWith(
    expect.stringContaining('INSERT INTO events'),
    ['t', null, 'now', 'public']
  );
});

test('POST /events/:id/rsvp creates rsvp', async () => {
  db.pool.query.mockResolvedValue({ rows: [{ id: 1 }] });
  const app = createApp();
  const res = await request(app).post('/events/1/rsvp').send({ user_id: 'u1', status: 'yes' });
  expect(res.statusCode).toBe(201);
  expect(res.body).toEqual({ id: 1 });
  expect(db.pool.query).toHaveBeenCalledWith(
    expect.stringContaining('INSERT INTO rsvps'),
    ['1', 'u1', 'yes']
  );
});
