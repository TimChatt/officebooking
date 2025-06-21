# Forecast Service

Simple FastAPI service that predicts bookings for the next week.
The prediction is based on average bookings for each day of the week.
It connects to the same Postgres database used by the server.

Set `DATABASE_URL` in your environment and install the dependencies:

```bash
pip install -r requirements.txt
```

## Endpoints

- `GET /forecast` – returns predicted bookings for the next 7 days.

Run locally with:

```bash
uvicorn app:app --reload --port 8000
```

The forecast is currently a naive average of the last 30 days of bookings.
