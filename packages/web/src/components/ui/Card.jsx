import React from 'react';
import Paper from '@mui/material/Paper';

/**
 * Simple card container using shadcn styles.
 */
export default function Card({ children, sx, ...props }) {
  return (
    <Paper elevation={1} sx={{ p: 2, ...(sx || {}) }} {...props}>
      {children}
    </Paper>
  );
}
