# Web

Simple React frontend served with the `serve` package.
It fetches desks and bookings from the API and provides a small form to create new bookings. A FullCalendar view displays current bookings and lets you select a time range.
The API base URL is `http://localhost:3000` during development.
Toggle the "Edit" button to drag desks around and the new positions will be saved via the API.
While editing, you can also click "Add Desk" to create a new desk, or remove a desk with the small "x" button shown on each desk box.
The page also displays daily and weekly booking counts from the analytics endpoints
and shows them in simple charts powered by Recharts. A small heatmap illustrates
which days were busiest over the last month.
Desk blocks created by admins will prevent bookings during the blocked time.
The app fetches predictions from the `/forecast` service and lists the expected
number of bookings for the next seven days below the utilization charts.
Click "Get Recommended Desk" to prefill the booking form with a suggested desk.
An "Alerts" list warns admins when forecasted bookings are likely to exceed 80%
 of capacity.
If the server has SendGrid credentials, these alerts are also emailed to the ad
dress configured in `ALERT_EMAIL`.
If Twilio settings are provided, the same alerts are sent via SMS to `ALERT_PHONE`.
Admins can open an admin panel to manage user roles when logged in.

A small chatbot box lets users ask questions. Messages are sent to the `/chatbot`
endpoint, which responds using the OpenAI API if configured.

### End-to-End Tests

Run Cypress tests against the local dev servers:

```bash
npm run test:e2e
```
