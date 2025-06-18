# Forecast Service

Simple FastAPI service that predicts bookings for the next week.
It connects to the same Postgres database used by the server.

## Endpoints

- `GET /forecast` – returns predicted bookings for the next 7 days.

The forecast is currently a naive average of the last 30 days of bookings.
