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

## Deployment

GitHub Actions can build and test each package. Deployment to Railway can be configured from workflows under .github/workflows.
