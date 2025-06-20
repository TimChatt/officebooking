import React from 'react';
import MuiButton from '@mui/material/Button';

/**
 * Basic button component styled with shadcn styles and Tailwind.
 */
export default function Button({ children, ...props }) {
  return (
    <MuiButton variant="contained" {...props}>
      {children}
    </MuiButton>
  );
}
