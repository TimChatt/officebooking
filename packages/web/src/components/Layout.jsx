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
                  px: 2.5,
                  py: 1.5,
                  fontWeight: 500,
                  fontSize: '15px',
                  color: '#1f1f1f',
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    bgcolor: '#eef2ff',
                  },
                }}
              >
                <ListItemIcon sx={{ color: '#4f46e5', minWidth: '36px' }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.name} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f8f9fc' }}>
      <AppBar
        position="fixed"
        elevation={1}
        sx={{
          zIndex: (t) => t.zIndex.drawer + 1,
          bgcolor: '#ffffff',
          color: '#1f1f1f',
          borderBottom: '1px solid #e0e0e0',
          boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
          px: 3,
        }}
      >
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton
              color="inherit"
              edge="start"
              onClick={() => setOpen(true)}
              sx={{ mr: 2, display: { md: 'none' } }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" fontWeight={700}>
              Office Booking
            </Typography>
          </Box>
          <Box>
            {/* You can add avatar, settings, or a search input here later */}
          </Box>
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
          mt: 2,
          p: 4,
          ml: { md: `${drawerWidth}px` },
          borderRadius: '16px',
          background: '#ffffff',
          minHeight: 'calc(100vh - 64px)',
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
