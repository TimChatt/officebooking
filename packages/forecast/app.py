import os
from datetime import datetime, timedelta
from fastapi import FastAPI
import psycopg2

app = FastAPI()

DATABASE_URL = os.getenv("DATABASE_URL")


def get_connection():
    return psycopg2.connect(DATABASE_URL)


def fetch_daily_counts(days=30):
    with get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(
                """
                SELECT date_trunc('day', start_time) AS day, COUNT(*)
                FROM bookings
                WHERE start_time >= NOW() - INTERVAL '%s days'
                GROUP BY day
                ORDER BY day
                """,
                (days,),
            )
            return cur.fetchall()


def compute_forecast(counts, horizon=7):
    if not counts:
        return [0] * horizon
    avg = sum(c[1] for c in counts) / len(counts)
    return [round(avg) for _ in range(horizon)]


@app.get("/forecast")
def forecast():
    counts = fetch_daily_counts()
    next_days = [datetime.utcnow().date() + timedelta(days=i) for i in range(1, 8)]
    preds = compute_forecast(counts)
    return {
        "forecast": [
            {"day": day.isoformat(), "bookings": pred}
            for day, pred in zip(next_days, preds)
        ]
    }
