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

Copy `.env.example` to `.env` and update the Postgres connection string.

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

The API exposes `/health`, `/desks`, and `/bookings` for listing and creating records.

Desks can also be updated via `PUT /desks/:id`.
The frontend lists desks and bookings, includes a form to create new bookings,
and an edit mode that lets admins drag desks to new positions.

The frontend fetches desks from the API and lists them on the page.



## Deployment

GitHub Actions can build and test each package. Deployment to Railway can be configured from workflows under .github/workflows.
