import React from 'react';
import Card from '../components/ui/Card.jsx';
import UtilizationChart from '../UtilizationChart.jsx';

export default function DashboardPage() {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <UtilizationChart />
        </Card>
        <Card>Upcoming bookings</Card>
        <Card>Desk status overview</Card>
        <Card>Recent alerts</Card>
      </div>
    </div>
  );
}
