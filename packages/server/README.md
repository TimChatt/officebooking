# Server

Express server exposing health and booking endpoints. It reads environment variables from `.env` using `dotenv` and allows CORS for the web app.

## Environment

Set `DATABASE_URL` to a Postgres connection string. The server will create the
required tables on startup.

## Endpoints

- `GET /health` – health check
- `GET /desks` – list all desks
- `POST /desks` – create a desk
- `PUT /desks/:id` – update desk coordinates or status
- `GET /bookings` – list bookings
- `POST /bookings` – create a booking
