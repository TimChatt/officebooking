import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import DesksPage from './pages/DesksPage.jsx';
import BookingsPage from './pages/BookingsPage.jsx';
import AnalyticsPage from './pages/AnalyticsPage.jsx';
import AlertsPage from './pages/AlertsPage.jsx';
import Layout from './components/Layout.jsx';

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/desks" />} />
          <Route path="/desks" element={<DesksPage />} />
          <Route path="/bookings" element={<BookingsPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/alerts" element={<AlertsPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
