const request = require('supertest');
jest.mock('../auth', () => ({ checkJwt: (req, res, next) => next() }));
const { createApp } = require('../index');
const db = require('../db');

jest.mock('../db', () => {
  return {
    pool: { query: jest.fn() },
    init: jest.fn(),
    logEvent: jest.fn(),
    getUserSettings: jest.fn(),
    saveUserProfile: jest.fn(),
    saveUserIntegrations: jest.fn(),
  };
});

beforeEach(() => {
  db.getUserSettings.mockReset();
  db.saveUserProfile.mockReset();
  db.saveUserIntegrations.mockReset();
});

test('GET /settings returns data', async () => {
  db.getUserSettings.mockResolvedValue({ name: 'A', email: 'a', slack_webhook: 's', google_api_key: 'g' });
  const app = createApp();
  const res = await request(app).get('/api/settings');
  expect(res.statusCode).toBe(200);
  expect(res.body.profile.name).toBe('A');
  expect(db.getUserSettings).toHaveBeenCalled();
});

test('PUT /settings/profile saves data', async () => {
  db.saveUserProfile.mockResolvedValue({ name: 'B', email: 'b' });
  const app = createApp();
  const res = await request(app).put('/api/settings/profile').send({ name: 'B', email: 'b' });
  expect(res.statusCode).toBe(200);
  expect(db.saveUserProfile).toHaveBeenCalled();
});

