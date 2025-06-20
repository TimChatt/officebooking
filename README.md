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

Install the Python dependencies for the forecast service:

```
pip install -r packages/forecast/requirements.txt
```

Copy `.env.example` to `.env` and update the Postgres connection string.
Optionally set `OPENAI_API_KEY` to enable the chatbot assistant.

### Seed the Default Floorplan

After configuring the environment, populate the database with a sample layout:

```
npm --workspace packages/server run seed
```

This creates two sets of ten rows of eight desks with an aisle between them.

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

### Start in Production

To run the API and forecast service together (as used in deployment) simply run:

```
npm start
```

Before starting, build the React frontend so Express can serve the compiled
files:

```
npm --workspace packages/web run build
```

This starts the Express server and the Python forecast service.

The API exposes `/health`, `/desks`, `/bookings`, analytics, and recommendation endpoints.
Bookings can also be updated via `PUT /bookings/:id` or removed with `DELETE /bookings/:id`.
Desks can be created via `POST /desks`, updated via `PUT /desks/:id`, removed with `DELETE /desks/:id`, and blocked for date ranges using

This will start the API server on http://localhost:3000 and the React app on http://localhost:3001.

The API exposes `/health`, `/desks`, `/bookings`, and analytics endpoints.

Desks can be updated via `PUT /desks/:id` and blocked for date ranges using

`POST /desks/:id/blocks`.
Blocks can be removed with `DELETE /desks/:deskId/blocks/:blockId`.
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

The frontend also includes a simple chatbot widget powered by the OpenAI API.
Admins can ask common questions like how to book a desk. The backend exposes a
`POST /chatbot` endpoint that proxies requests to OpenAI when
`OPENAI_API_KEY` is configured.

### Server Tests

Unit tests for the Express API can be run with:

```bash
npm --workspace packages/server test
```

### End-to-End Tests

With the servers running locally you can execute Cypress tests:

```bash
npm --workspace packages/web run test:e2e
```

This opens the site at `http://localhost:3001` and runs a small smoke test.

## Forecast Service

A separate FastAPI microservice provides booking demand forecasts. It queries recent bookings from the database and returns predicted counts for the next 7 days from the `/forecast` endpoint.

The frontend lists desks and bookings, includes a form to create new bookings,
and an edit mode that lets admins drag desks to new positions. It also displays
daily and weekly booking counts fetched from the analytics endpoints and graphs
them using Recharts.

Desks can also be updated via `PUT /desks/:id`.
Booking creation logs an event in an analytics table which can be queried via `/analytics/daily` and `/analytics/weekly`.
The frontend lists desks and bookings, includes a form to create new bookings,
and an edit mode that lets admins drag desks to new positions. It also displays
daily and weekly booking counts fetched from the analytics endpoints.

The API exposes `/health`, `/desks`, and `/bookings` for listing and creating records.
Desks can also be updated via `PUT /desks/:id`.
The frontend lists desks and bookings, includes a form to create new bookings,
and an edit mode that lets admins drag desks to new positions.
Desks can also be updated via `PUT /desks/:id`.
The frontend lists desks and bookings, includes a form to create new bookings,
and an edit mode that lets admins drag desks to new positions.

The frontend fetches desks from the API and lists them on the page.



## Deployment

GitHub Actions can build and test each package. Deployment to Railway can be configured from workflows under .github/workflows.
