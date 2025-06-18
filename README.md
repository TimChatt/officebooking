# Office Booking

This monorepo contains both the backend server and the frontend web application for the Office Seat Booking App.

## Packages

- packages/server - Node.js Express API
- packages/web - React frontend

## Getting Started

### Install Dependencies

From the repository root run:

```
npm install
```

Copy `.env.example` to `.env` and update the Postgres connection string and
Auth0 settings (domain, audience, client ID).

### Start the Development Servers

In separate terminals, run:

```
npm run dev:server
```

and

```
npm run dev:web
```

To run the forecast service:

```
npm run dev:forecast
```

This will start the API server on http://localhost:3000 and the React app on http://localhost:3001.

The API exposes `/health`, `/desks`, `/bookings`, analytics, and recommendation endpoints.
Bookings can also be updated via `PUT /bookings/:id` or removed with `DELETE /bookings/:id`.
Desks can be created via `POST /desks`, updated via `PUT /desks/:id`, removed with `DELETE /desks/:id`, and blocked for date ranges using
`POST /desks/:id/blocks`.
Blocks can be removed with `DELETE /desks/:deskId/blocks/:blockId`.
Creating or updating data requires a valid Auth0 access token.
Bookings will fail if the selected desk is blocked for the requested time.
Booking creation logs an event in an analytics table which can be queried via `/analytics/daily` and `/analytics/weekly`.
You can fetch the least-used available desk from `/recommendation` and the
server provides `/alerts` which lists upcoming days where forecasted demand is
above 80% of desk capacity.
If you configure `SENDGRID_API_KEY` and `ALERT_EMAIL`, the server will
automatically email this list of busy days once per day. You can also
optionally set Twilio credentials (`TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`,
`TWILIO_FROM`, and `ALERT_PHONE`) to receive the same alerts via SMS.
Authenticated users are stored in a `users` table. Admins can manage roles via
the `/users` endpoints and access an admin panel in the frontend.
The frontend lists desks and bookings, includes a form to create new bookings,
and an edit mode that lets admins drag desks to new positions. While editing,
admins can add new desks or remove existing ones. A calendar view
shows existing bookings and lets you choose start and end times. It also displays
daily and weekly booking counts fetched from the analytics endpoints and graphs
them using Recharts. A small heatmap highlights busy days over the last month.
Predictions from the forecast service are shown as a list of expected bookings
for the next seven days.

## Forecast Service

A separate FastAPI microservice provides booking demand forecasts. It queries recent bookings from the database and returns predicted counts for the next 7 days from the `/forecast` endpoint.


## Deployment

GitHub Actions can build and test each package. Deployment to Railway can be configured from workflows under .github/workflows.
