import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import DesksPage from './pages/DesksPage.jsx';
import BookingsPage from './pages/BookingsPage.jsx';
import AnalyticsPage from './pages/AnalyticsPage.jsx';
import AlertsPage from './pages/AlertsPage.jsx';

export default function App() {
  return (
    <BrowserRouter>
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Office Booking</h1>
        <nav className="space-x-2 mb-4">
          <Link to="/desks">Desks</Link>
          <Link to="/bookings">Bookings</Link>
          <Link to="/analytics">Analytics</Link>
          <Link to="/alerts">Alerts</Link>
        </nav>
        <Routes>
          <Route path="/" element={<Navigate to="/desks" />} />
          <Route path="/desks" element={<DesksPage />} />
          <Route path="/bookings" element={<BookingsPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/alerts" element={<AlertsPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
