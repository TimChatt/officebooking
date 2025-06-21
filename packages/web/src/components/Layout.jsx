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
    <Box sx={{ width: drawerWidth }} onClick={() => setOpen(false)} role="presentation">
      <Toolbar>
        <Typography variant="h6" noWrap component="div">
          Office Booking
        </Typography>
      </Toolbar>
      <List>
        {navItems.map((item) => (
          <ListItem key={item.name} disablePadding>
            <ListItemButton component="a" href={item.href}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.name} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <AppBar position="fixed" sx={{ zIndex: (t) => t.zIndex.drawer + 1 }}>
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
          '& .MuiDrawer-paper': { width: drawerWidth, boxSizing: 'border-box' },
        }}
        open
      >
        {drawer}
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3, ml: { md: `${drawerWidth}px` } }}>
        <Toolbar />
        {children}
      </Box>
      <ChatButton onClick={() => setChatOpen(true)} />
      <ChatOverlay open={chatOpen} onClose={() => setChatOpen(false)} />
    </Box>
  );
}
