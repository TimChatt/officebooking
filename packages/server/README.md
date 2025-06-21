# Server

Express API for the Office Booking app. It reads configuration from `.env` in the repository root and allows CORS for the web app.

## Environment
- `DATABASE_URL` – Postgres connection string
- `SENDGRID_API_KEY` and `ALERT_EMAIL` – optional email alerts
- `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_FROM`, `ALERT_PHONE` – optional SMS alerts
- `FORECAST_URL` – base URL for the forecast service (defaults to `http://localhost:8000`)
- `OPENAI_API_KEY` – enables the `/chatbot` endpoint

## Development
From the repo root run `npm run dev:server` or inside this directory run:
```bash
npm run dev
```

## Seeding Example Desks
```bash
npm run seed
```
This creates a basic floor plan in the database.

## Endpoints
- `GET /health`
- CRUD operations for `/api/desks` and `/api/bookings`
- `POST /api/desks/:id/blocks` and `DELETE /api/desks/:deskId/blocks/:blockId`
- `GET /api/analytics/daily` and `GET /api/analytics/weekly`
- `/api/forecast`, `/api/recommendation`, `/api/alerts`
- `/api/chatbot`
- `/api/users` management routes

## Tests
Run unit tests with:
```bash
npm test
```
