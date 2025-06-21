import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    background: {
      default: 'var(--bg)',
      paper: 'var(--card-bg)',
    },
    primary: {
      main: 'var(--accent)',
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
