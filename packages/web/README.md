# Web


Simple React frontend served with the `serve` package.
It fetches desks and bookings from the API and provides a small form to create new bookings.
The API base URL is `http://localhost:3000` during development.
Toggle the "Edit" button to drag desks around and the new positions will be saved via the API.
=======

Simple React frontend served with the `serve` package.
On load it fetches desks from the API at `http://localhost:3000/desks` and displays them.

React frontend built with [Vite](https://vitejs.dev/).

## Development

From this directory run:

```bash
npm run dev
```

This starts the Vite development server on http://localhost:3001.

## Build

```bash
npm run build
```

The optimized output will be placed in the `dist/` folder. You can preview the
production build with:

```bash
npm start
```

which serves the contents of `dist/` on the same port.

