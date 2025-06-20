import React from 'react';

export default function Layout({ children }) {
  return (
    <>
      <header className="fixed inset-x-0 top-0 bg-white shadow z-10">
        <div className="mx-auto max-w-4xl flex items-center justify-between p-4">
          <h1 className="text-xl font-bold">Office Booking</h1>
          <div>User Menu</div>
        </div>
      </header>
      <main className="pt-16 p-4 max-w-4xl mx-auto">{children}</main>
    </>
  );
}
