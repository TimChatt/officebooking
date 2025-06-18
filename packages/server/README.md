# Server

Basic Express server exposing a `/health` endpoint.

## Environment

Set `DATABASE_URL` to a Postgres connection string. The server will create the
required tables on startup.

## Endpoints

- `GET /health` – health check
- `GET /desks` – list all desks
- `POST /bookings` – create a booking

