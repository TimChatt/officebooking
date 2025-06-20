import React from 'react';
import clsx from 'clsx';

/**
 * Simple card container using shadcn styles.
 */
export default function Card({ className, children, ...props }) {
  return (
    <div
      className={clsx(
        'rounded-lg border bg-white p-4 shadow-sm',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
