import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import clsx from 'clsx';

export default function AppShell({ children }) {
  const [open, setOpen] = useState(false);

  const links = [
    { to: '/desks', label: 'Desks' },
    { to: '/bookings', label: 'Bookings' },
    { to: '/analytics', label: 'Analytics' },
    { to: '/alerts', label: 'Alerts' },
  ];

  const linkClass = ({ isActive }) =>
    clsx(
      'block px-4 py-2 border-l-4',
      isActive
        ? 'border-primary bg-primary/10 text-primary font-semibold'
        : 'border-transparent'
    );

  return (
    <div className="min-h-screen flex">
      {/* Mobile drawer */}
      <div
        className={clsx(
          'fixed inset-0 z-40 lg:hidden',
          open ? '' : 'pointer-events-none'
        )}
      >
        <div
          className="absolute inset-0 bg-black/50"
          aria-hidden="true"
          onClick={() => setOpen(false)}
        />
        <div className="relative w-64 max-w-full h-full bg-white shadow">
          <nav className="pt-4 space-y-1">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                className={linkClass}
                onClick={() => setOpen(false)}
              >
                {l.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </div>

      {/* Sidebar for desktop */}
      <aside className="hidden lg:block w-64 bg-white shadow flex-shrink-0">
        <nav className="pt-4 space-y-1">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} className={linkClass}>
              {l.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className="flex-1 flex flex-col">
        <header className="bg-white shadow p-4 flex items-center justify-between">
          <h1 className="text-xl font-bold">Office Booking</h1>
          <button
            className="lg:hidden"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
          >
            ☰
          </button>
          <div className="hidden lg:block">User Menu</div>
        </header>
        <main className="flex-1 p-4">{children}</main>
      </div>
    </div>
  );
}
