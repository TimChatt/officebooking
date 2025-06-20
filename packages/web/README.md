# Web

React frontend built with Vite. It talks to the API running on `http://localhost:3000`.

## Development
From the repo root use `npm run dev:web` or run inside this directory:
```bash
npm run dev
```
This starts Vite on http://localhost:3001.

## Build
```bash
npm run build
npm start
```
`build` outputs to `dist/` and `start` serves that folder.

## Features
- Drag‑and‑drop desk layout editor
- Booking form and calendar view
- Utilization charts and heatmap with forecast data
- Recommended desk and busy day alerts
- Admin panel and optional chatbot widget

## Tests
- Unit tests: `npm test`
- Cypress end‑to‑end tests: `npm run test:e2e`
