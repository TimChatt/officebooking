import { createTheme } from '@mui/material/styles';

const accent = '#a6b1e1';

const theme = createTheme({
  palette: {
    background: {
      default: '#f1f3f6',
      paper: '#e4e9f2',
    },
    primary: {
      main: accent,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 'var(--radius)',
          boxShadow: 'var(--shadow-light), var(--shadow-dark)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 'var(--radius)',
          boxShadow: 'var(--shadow-light), var(--shadow-dark)',
          textTransform: 'none',
          '&:hover': {
            boxShadow: '0 0 0 2px var(--accent) inset',
          },
        },
      },
    },
  },
});

export default theme;
