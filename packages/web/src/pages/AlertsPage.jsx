import React, { useEffect, useState } from 'react';
import Layout from '../components/layout';
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

  useEffect(() => {
    load();
  }, []);

  const resendEmail = () => load();
  const resendSms = () => load();

  return (
    <Layout>
      <div>
        <h1 className="text-2xl font-semibold mb-6">Alerts</h1>

        <table className="table-auto w-full text-left bg-white border border-slate-200 rounded-md shadow-sm">
          <thead className="bg-slate-100 text-slate-700 text-sm">
            <tr>
              <th className="px-4 py-2 border-b">Date</th>
              <th className="px-4 py-2 border-b">Bookings</th>
              <th className="px-4 py-2 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {alerts.map((a, idx) => (
              <tr key={idx} className="border-b last:border-b-0 hover:bg-slate-50">
                <td className="px-4 py-2">{new Date(a.day).toLocaleDateString()}</td>
                <td className="px-4 py-2">{a.bookings}</td>
                <td className="px-4 py-2 space-x-2">
                  <Button onClick={resendEmail}>Resend Email</Button>
                  <Button onClick={resendSms}>Resend SMS</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}
