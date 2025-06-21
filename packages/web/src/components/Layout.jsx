import { useState } from 'react';
import { Home, Calendar, BarChart2, CalendarDays } from 'lucide-react';
import {
  AppBar,
  Toolbar,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Box,
  useTheme,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ChatButton from './ChatButton.jsx';
import ChatOverlay from './ChatOverlay.jsx';

const navItems = [
  { name: 'Dashboard', icon: <Home size={18} />, href: '/dashboard' },
  { name: 'Book a Desk', icon: <Calendar size={18} />, href: '/desks' },
  { name: 'Manage Bookings', icon: <Calendar size={18} />, href: '/bookings' },
  { name: 'Forecast', icon: <BarChart2 size={18} />, href: '/analytics' },
  { name: 'Events', icon: <CalendarDays size={18} />, href: '/events' },
];

export default function Layout({ children }) {
  const [open, setOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const drawerWidth = 240;

  const drawer = (
    <Box
      sx={{
        width: drawerWidth,
        height: '100%',
        bgcolor: '#f9f9fb',
        borderRight: '1px solid #e0e0e0',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        p: 2,
      }}
    >
      <Box>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            textAlign: 'center',
            mb: 4,
            color: '#4f46e5',
          }}
        >
          Office Booking
        </Typography>
        <List>
          {navItems.map((item) => (
            <ListItem key={item.name} disablePadding sx={{ mb: 1 }}>
              <ListItemButton
                component="a"
                href={item.href}
                sx={{
                  borderRadius: '12px',
                  color: '#333',
                  '&:hover': {
                    bgcolor: '#e8eaf6',
                  },
                }}
              >
                <ListItemIcon sx={{ color: '#4f46e5' }}>{item.icon}</ListItemIcon>
                <ListItemText primary={item.name} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f0f2f5' }}>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          zIndex: (t) => t.zIndex.drawer + 1,
          bgcolor: '#ffffff',
          color: '#333',
          borderBottom: '1px solid #e0e0e0',
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={() => setOpen(true)}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Office Booking
          </Typography>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="temporary"
        open={open}
        onClose={() => setOpen(false)}
        ModalProps={{ keepMounted: true }}
        sx={{ display: { xs: 'block', md: 'none' } }}
      >
        {drawer}
      </Drawer>

      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            bgcolor: '#f9f9fb',
          },
        }}
        open
      >
        {drawer}
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 4,
          ml: { md: `${drawerWidth}px` },
          transition: 'all 0.3s ease-in-out',
        }}
      >
        <Toolbar />
        {children}
      </Box>

      <ChatButton onClick={() => setChatOpen(true)} />
      <ChatOverlay open={chatOpen} onClose={() => setChatOpen(false)} />
    </Box>
  );
}
