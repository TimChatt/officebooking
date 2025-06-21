# Office Booking

A monorepo containing an Express API, a React frontend and a small forecasting service.

## Packages
- `packages/server` – Node.js API
- `packages/web` – React application
- `packages/forecast` – FastAPI service

## Setup
1. Install dependencies:
   ```bash
   npm install
   pip install -r packages/forecast/requirements.txt
   ```
2. Copy `.env.example` to `.env` and update `DATABASE_URL`. Optional variables enable alerts and the chatbot.

## Seed Example Data
Populate the database with a starting floor plan:
```bash
npm --workspace packages/server run seed
```

## Development
Run each service in its own terminal:
```bash
npm run dev:server
npm run dev:web
npm run dev:forecast
```
The API is available at http://localhost:3000 and the web app at http://localhost:3001.

## Production
Build the frontend then start the API and forecast service:
```bash
npm --workspace packages/web run build
npm start
```

## Tests
- API unit tests: `npm --workspace packages/server test`
- Frontend tests: `npm --workspace packages/web test`
- Cypress end‑to‑end tests: `npm --workspace packages/web run test:e2e`

## Features
- Manage desks and bookings with authentication
- Rich analytics including heatmaps, team reports and peak time graphs
- Desk recommendation and forecast-based alerts
- Optional email/SMS notifications and chatbot support

Deployment is handled via GitHub Actions and Railway.
