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
  db.logEvent.mockReset();
});

test('chatbot creates a booking from command', async () => {
  db.pool.query
    .mockResolvedValueOnce({ rows: [] })
    .mockResolvedValueOnce({ rows: [] })
    .mockResolvedValueOnce({ rows: [] });
  const app = createApp();
  const res = await request(app)
    .post('/api/chatbot')
    .send({ message: 'book desk 5 on 2023-01-01' });
  expect(res.statusCode).toBe(200);
  expect(res.body.reply).toMatch(/Booked desk 5/);
});

test('chatbot notifies when desk already booked', async () => {
  db.pool.query
    .mockResolvedValueOnce({ rows: [] })
    .mockResolvedValueOnce({ rows: [{ id: 1 }] });
  const app = createApp();
  const res = await request(app)
    .post('/api/chatbot')
    .send({ message: 'book desk 5 on 2023-01-01' });
  expect(res.statusCode).toBe(200);
  expect(res.body.reply).toMatch(/already booked/);
});
