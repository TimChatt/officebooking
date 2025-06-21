import React from 'react';
import { createRoot } from 'react-dom/client';
import { CssBaseline } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import App from './App.jsx';
import { ChatProvider } from './context/ChatContext.jsx';

const root = createRoot(document.getElementById('root'));
root.render(
  <React.Fragment>
    <CssBaseline />
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <ChatProvider>
        <App />
      </ChatProvider>
    </LocalizationProvider>
  </React.Fragment>
);
