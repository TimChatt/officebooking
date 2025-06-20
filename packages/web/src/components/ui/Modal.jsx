import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';

/**
 * Basic modal component styled with shadcn styles.
 */
export default function Modal({ open, onClose, children }) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogContent>{children}</DialogContent>
    </Dialog>
  );
}
