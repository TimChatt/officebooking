# Server

Basic Express server exposing a `/health` endpoint.

## Environment

Set `DATABASE_URL` in a `.env` file to a Postgres connection string. The server
uses [dotenv](https://github.com/motdotla/dotenv) to load environment
variables and will create the required tables on startup.

## Endpoints

- `GET /health` – health check
- `GET /desks` – list all desks
- `POST /bookings` – create a booking
