# Server

Express server exposing health and booking endpoints. It reads environment variables from `.env` using `dotenv` and allows CORS for the web app.

## Environment

Set `DATABASE_URL` to a Postgres connection string. The server will create the
required tables on startup.
- `SENDGRID_API_KEY` (optional, for email alerts)
- `ALERT_EMAIL` (who should receive alert emails)
- `TWILIO_ACCOUNT_SID` (optional, for SMS alerts)
- `TWILIO_AUTH_TOKEN` (used with Twilio SID)
- `TWILIO_FROM` (the Twilio number sending texts)
- `ALERT_PHONE` (number that should receive SMS alerts)
- `OPENAI_API_KEY` (optional, enables the `/chatbot` endpoint)

## Seeding Example Desks

Run the seed script to populate a starting layout of two sets of ten rows of
eight desks:

```
npm run seed
```

## Tests

Run unit tests with:

```bash
npm test
```
=======
=======


- `PUT /desks/:id` – update desk coordinates or status
Basic Express server exposing a `/health` endpoint.

## Environment

Set `DATABASE_URL` in a `.env` file to a Postgres connection string. The server
uses [dotenv](https://github.com/motdotla/dotenv) to load environment
variables and will create the required tables on startup.

## Endpoints

- `GET /health` – health check
- `GET /desks` – list all desks
- `POST /desks` – create a desk (auth required)
- `PUT /desks/:id` – update desk coordinates or status (auth required)
- `DELETE /desks/:id` – remove a desk (auth required)
- `POST /desks/:id/blocks` – block a desk for a time range (auth required)
- `DELETE /desks/:deskId/blocks/:blockId` – remove a block (auth required)
- `GET /bookings` – list bookings
- `POST /bookings` – create a booking (auth required)
- `PUT /bookings/:id` – update a booking (auth required)
- `DELETE /bookings/:id` – delete a booking (auth required)
- `GET /analytics/daily` – daily booking counts
- `GET /analytics/weekly` – weekly booking counts
- `/forecast` (from the forecast service) – predicted bookings for the next 7 days
- `GET /recommendation` – returns the least-used available desk
 - `GET /alerts` – lists forecasted days where bookings may exceed 80% of desks
   (the server emails and texts this list daily if SendGrid or Twilio are configured)
- `POST /chatbot` – ask a question and get a response from the OpenAI API
- `POST /users/me` – ensure the current user exists in the DB
- `GET /users` – list all users (admin only)
- `PUT /users/:id/role` – change a user's role (admin only)
- `POST /users/me` – ensure the current user exists in the DB
- `GET /users` – list all users (admin only)
- `PUT /users/:id/role` – change a user's role (admin only)
- `POST /desks/:id/blocks` – block a desk for a time range (auth required)
- `DELETE /desks/:deskId/blocks/:blockId` – remove a block (auth required)

- `GET /bookings` – list bookings
- `POST /bookings` – create a booking (auth required)
- `GET /analytics/daily` – daily booking counts
- `GET /analytics/weekly` – weekly booking counts

- `POST /desks` – create a desk

- `PUT /desks/:id` – update desk coordinates or status

- `GET /bookings` – list bookings
- `POST /bookings` – create a booking

