import React from 'react';
import clsx from 'clsx';

/**
 * Basic modal component styled with shadcn styles.
 */
export default function Modal({ open, onClose, className, children }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        role="dialog"
        className={clsx(
          'relative z-10 w-full max-w-md rounded-lg bg-white p-6 shadow-lg',
          className
        )}
      >
        {children}
      </div>
    </div>
  );
}
