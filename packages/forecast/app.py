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
    """Return a 7 day forecast based on day-of-week averages."""
    if not counts:
        return [0] * horizon

    # group counts by day of week
    dow_totals = {i: [] for i in range(7)}
    for day, cnt in counts:
        dow_totals[day.weekday()].append(cnt)

    dow_avgs = {
        dow: (sum(vals) / len(vals)) if vals else 0
        for dow, vals in dow_totals.items()
    }

    start_date = datetime.utcnow().date() + timedelta(days=1)
    preds = []
    for i in range(horizon):
        dow = (start_date + timedelta(days=i)).weekday()
        preds.append(round(dow_avgs.get(dow, 0)))
    return preds


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
