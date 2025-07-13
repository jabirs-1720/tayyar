import { useState } from 'react';
import {
  AppBar, Toolbar, Typography, IconButton, Drawer, List, ListItemButton,
  ListItemIcon, ListItemText, BottomNavigation, BottomNavigationAction,
  Box, useMediaQuery, CssBaseline, Paper, Collapse
} from '@mui/material';
import {
  Visibility, AttachFile, Settings, ExpandMore, ExpandLess,
  Search as SearchIcon, DarkMode, LightMode
} from '@mui/icons-material';
import { useTheme, alpha } from '@mui/material/styles';
import { useDispatch } from 'react-redux';
import { Outlet, useNavigate } from 'react-router-dom';

const AppLayout = () => {
  // Callable variables
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Values
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [navIndex, setNavIndex] = useState(0);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const mixedBg = alpha(theme.palette.primary.main, 0.1);
  const toggleTheme = () =>
    dispatch({ type: 'SET_MODE', payload: theme.palette.mode === 'dark' ? 'light' : 'dark' });

  const handleNavClick = (index, path) => {
    setNavIndex(index);
    if (path) navigate(path);
  };

  const drawerItems = [
    { label: 'لمحة', icon: <Visibility />, path: '/dashboard/' },
    { label: 'المقايسات', icon: <AttachFile />, path: '/dashboard/assays' },
  ];

  const DrawerContent = (
    <>
      <Toolbar />
      <List>
        {drawerItems.map((item, i) => (
          <ListItemButton sx={{
            mx: 1,
            my: 0.5,
            borderRadius: 10,
            '&.Mui-selected': {
              bgcolor: theme.palette.action.selected,
              '&:hover': { bgcolor: theme.palette.action.selected },
            },
          }} key={item.label} selected={navIndex === i} onClick={() => handleNavClick(i, item.path)}>
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItemButton>
        ))}
        <ListItemButton sx={{
            mx: 1,
            my: 0.5,
            borderRadius: 10,
            '&.Mui-selected': {
              bgcolor: theme.palette.action.selected,
              '&:hover': { bgcolor: theme.palette.action.selected },
            },
          }} onClick={() => setSettingsOpen(!settingsOpen)}>
          <ListItemIcon><Settings /></ListItemIcon>
          <ListItemText primary="الإعدادات" />
          {settingsOpen ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={settingsOpen} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {['عام', 'الحساب', 'الإشعارات'].map((text, i) => (
              <ListItemButton key={text}  sx={{
                pl: 4,
                mx: 1,
                my: 0.5,
                borderRadius: 10,
                '&.Mui-selected': {
                  bgcolor: theme.palette.action.selected,
                  '&:hover': { bgcolor: theme.palette.action.selected },
                },
              }} onClick={() => console.log(`${text} clicked`)}>
                <ListItemText primary={text} />
              </ListItemButton>
            ))}
          </List>
        </Collapse>
      </List>
    </>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />

      <AppBar position="fixed" elevation={0} color="transparent" sx={{ zIndex: theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <Typography variant="h6" noWrap flexGrow={1}>الصفحة الرئيسية</Typography>
          <IconButton size='large' sx={{ marginInlineEnd: 1 }}><SearchIcon /></IconButton>
          <IconButton size='large' edge="end" onClick={toggleTheme}>
            {theme.palette.mode === 'dark' ? <LightMode /> : <DarkMode />}
          </IconButton>
        </Toolbar>
      </AppBar>

      {!isMobile && (
        <Drawer variant="permanent" sx={{
          width: 250,
          flexShrink: 0,
          '& .MuiDrawer-paper': { width: 250, boxSizing: 'border-box', border: 'none' }
        }}>
          {DrawerContent}
        </Drawer>
      )}

      <Box component="main" sx={{ flexGrow: 1, p: 0, mt: 8, mb: isMobile ? 7 : 0 }}>
        <Outlet />
      </Box>

      {isMobile && (
        <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
          <BottomNavigation
            value={navIndex}
            onChange={(_, newValue) => handleNavClick(newValue, drawerItems[newValue]?.path)}
            sx={{ bgcolor: mixedBg }}
          >
            {drawerItems.map(item => (
              <BottomNavigationAction key={item.label} label={item.label} icon={item.icon} />
            ))}
            <BottomNavigationAction label="الإعدادات" icon={<Settings />} onClick={() => {
              if(isMobile) {
                navigate('/dashboard/settings');
              } else {
                setSettingsOpen(!settingsOpen);
              }
            }} />
            <BottomNavigationAction
              label="حسابي"
              icon={
                <img
                  src="https://img.freepik.com/free-vector/man-profile-account-picture_24908-81754.jpg"
                  alt="Profile"
                  style={{ width: 24, height: 24, borderRadius: '50%' }} // customize as needed
                />
              }
              onClick={() => navigate("/dashboard/profile")}
            />
          </BottomNavigation>
        </Paper>
      )}
    </Box>
  );
};

export default AppLayout;
