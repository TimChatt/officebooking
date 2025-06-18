# Server

Express server exposing health and booking endpoints. It reads environment variables from `.env` using `dotenv` and allows CORS for the web app.

## Environment

Set `DATABASE_URL` to a Postgres connection string. The server will create the
required tables on startup.
The following Auth0 variables must also be configured:

- `AUTH0_DOMAIN`
- `AUTH0_AUDIENCE`

## Endpoints

- `GET /health` – health check
- `GET /desks` – list all desks
- `POST /desks` – create a desk (auth required)
- `PUT /desks/:id` – update desk coordinates or status (auth required)
- `POST /desks/:id/blocks` – block a desk for a time range (auth required)
- `DELETE /desks/:deskId/blocks/:blockId` – remove a block (auth required)
- `GET /bookings` – list bookings
- `POST /bookings` – create a booking (auth required)
- `GET /analytics/daily` – daily booking counts
- `GET /analytics/weekly` – weekly booking counts
