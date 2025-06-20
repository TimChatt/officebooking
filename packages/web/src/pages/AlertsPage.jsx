import React, { useEffect, useState } from 'react';
import Button from '../components/ui/Button.jsx';

export default function AlertsPage() {
  const [alerts, setAlerts] = useState([]);

  async function load() {
    const res = await fetch('/alerts');
    if (res.ok) {
      const data = await res.json();
      setAlerts(data.alerts || []);
    }
  }

  useEffect(() => { load(); }, []);

  const resendEmail = () => load();
  const resendSms = () => load();

  return (
    <div>
      <table className="table-auto w-full text-left mb-4">
        <thead>
          <tr>
            <th>Date</th>
            <th>Bookings</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {alerts.map((a, idx) => (
            <tr key={idx}>
              <td>{new Date(a.day).toLocaleDateString()}</td>
              <td>{a.bookings}</td>
              <td className="space-x-2">
                <Button onClick={resendEmail}>Resend Email</Button>
                <Button onClick={resendSms}>Resend SMS</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
