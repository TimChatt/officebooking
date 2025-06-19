const request = require('supertest');
const express = require('express');

// create app with only /health route for testing
function createApp() {
  const app = express();
  app.get('/health', (req, res) => res.json({ status: 'ok' }));
  return app;
}

describe('GET /health', () => {
  it('returns status ok', async () => {
    const app = createApp();
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: 'ok' });
  });
});
