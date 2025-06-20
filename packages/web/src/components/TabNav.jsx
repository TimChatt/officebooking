import React from 'react';
import { NavLink } from 'react-router-dom';
import clsx from 'clsx';

export default function TabNav() {
  const linkClass = ({ isActive }) =>
    clsx(
      'px-3 py-2 -mb-px border-b-2',
      isActive ? 'border-primary text-primary font-semibold' : 'border-transparent'
    );

  return (
    <nav className="mb-4 border-b flex space-x-4">
      <NavLink to="/desks" className={linkClass}>Desks</NavLink>
      <NavLink to="/bookings" className={linkClass}>Bookings</NavLink>
      <NavLink to="/analytics" className={linkClass}>Analytics</NavLink>
      <NavLink to="/alerts" className={linkClass}>Alerts</NavLink>
    </nav>
  );
}
