import React from 'react';
import { createRoot } from 'react-dom/client';
import { CssBaseline } from '@mui/material';
import App from './App.jsx';

const root = createRoot(document.getElementById('root'));
root.render(
  <React.Fragment>
    <CssBaseline />
    <App />
  </React.Fragment>
);
