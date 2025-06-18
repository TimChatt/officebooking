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

Copy `.env.example` to `.env` and update the Postgres connection string.
The file also contains Auth0 settings used for authentication:

- `AUTH0_DOMAIN` – your Auth0 domain
- `AUTH0_AUDIENCE` – the audience for the API
- `AUTH0_CLIENT_ID` – the client ID for the SPA
- `VITE_AUTH0_DOMAIN`, `VITE_AUTH0_AUDIENCE` and `VITE_AUTH0_CLIENT_ID` are
  consumed by the React app and should match the server values.


### Start the Development Servers

In separate terminals, run:

```
npm run dev:server
```

and

```
npm run dev:web
```

This will start the API server on http://localhost:3000 and the React app on http://localhost:3001.

The API exposes `/health`, `/desks`, `/bookings`, and analytics endpoints.
Desks can also be updated via `PUT /desks/:id`.
Creating or updating data requires a valid Auth0 access token.
Booking creation logs an event in an analytics table which can be queried via `/analytics/daily` and `/analytics/weekly`.
The frontend lists desks and bookings, includes a form to create new bookings,
and an edit mode that lets admins drag desks to new positions. It also displays
daily and weekly booking counts fetched from the analytics endpoints.

The API exposes `/health`, `/desks`, and `/bookings` for listing and creating records.

Desks can also be updated via `PUT /desks/:id`.
The frontend lists desks and bookings, includes a form to create new bookings,
and an edit mode that lets admins drag desks to new positions.

The frontend fetches desks from the API and lists them on the page.



## Deployment

GitHub Actions can build and test each package. Deployment to Railway can be configured from workflows under .github/workflows.
