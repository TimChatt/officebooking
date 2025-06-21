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
  Avatar,
  Badge,
  Box,
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
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
      className="neumorphic"
      sx={{
        width: drawerWidth,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        p: 2,
      }}
    >
      <Box>
        <Typography
          variant="h6"
          component="div"
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
                  borderRadius: 'var(--radius)',
                  px: 2.5,
                  py: 1.5,
                  fontWeight: 500,
                  fontSize: '15px',
                  color: '#1f1f1f',
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    bgcolor: 'rgba(166,177,225,0.2)',
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    color: 'var(--accent)',
                    minWidth: '36px',
                    display: 'flex',
                    justifyContent: 'center',
                  }}
                >
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
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'var(--bg)' }}>
      <AppBar
        position="fixed"
        elevation={3}
        sx={{
          zIndex: (t) => t.zIndex.drawer + 1,
          background: 'linear-gradient(to bottom, var(--card-bg), #fff)',
          color: '#1f1f1f',
          borderBottom: '1px solid #e0e0e0',
          boxShadow: 'var(--shadow-light)',
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

            <Typography variant="h6" fontWeight={700} sx={{ mr: 2 }}>
              Office Booking
            </Typography>

            <img
              src="/sony-group.png"
              alt="Sony Group"
              style={{
                height: '38px', // slightly larger
                maxWidth: '180px',
                objectFit: 'contain',
              }}
            />
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton color="inherit">
              <Badge color="error" variant="dot" overlap="circular">
                <NotificationsIcon className="bell-ring" />
              </Badge>
            </IconButton>
            <Avatar sx={{ width: 32, height: 32, ml: 1 }}>U</Avatar>
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="temporary"
        open={open}
        onClose={() => setOpen(false)}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            bgcolor: 'var(--bg)',
            boxShadow: 'var(--shadow-light), var(--shadow-dark)',
          },
        }}
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
            bgcolor: 'var(--bg)',
            boxShadow: 'var(--shadow-light), var(--shadow-dark)',
          },
        }}
        open
      >
        {drawer}
      </Drawer>

      <Box
        component="main"
        className="neumorphic"
        sx={{
          flexGrow: 1,
          mt: 2,
          p: 4,
          ml: { md: `${drawerWidth}px` },
          borderRadius: '20px',
          background: 'var(--card-bg)',
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
