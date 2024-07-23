import MenuIcon from '@mui/icons-material/Menu';
import {
  Box,
  CssBaseline,
  Drawer,
  IconButton,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import React, { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import Contributing from './components/Pages/Contributing';
import Event from './components/Pages/Event';
import Home from './components/Pages/Home';
import Icam from './components/Pages/Icam';
import Interview from './components/Pages/Interview';
import Learnings from './components/Pages/Learnings';
import Peepo from './components/Pages/Peepo';
import Rca from './components/Pages/Rca';
import Timeline from './components/Pages/Timeline';
import Menu from './components/Sections/Menu';
import UploadPanel from './components/Sections/UploadPanel';

const drawerWidth = 240;
const rightPanelWidth = 300;

const App: React.FC = () => {
  const theme = useTheme();
  const isLargeScreen = useMediaQuery(theme.breakpoints.down('lg'));
  const [mobileOpen, setMobileOpen] = useState(false);

  const [settings, setSettings] = useState({
    state: 'Queensland',
    mineType: 'open cut',
    commodity: 'coal',
  });

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenuItemClick = () => {
    if (isLargeScreen) {
      setMobileOpen(false);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <CssBaseline />
      {isLargeScreen && (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: theme.spacing(1),
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{
                padding: theme.spacing(2),
                marginBottom: theme.spacing(3),
                fontSize: '2rem',
              }}
            >
              <MenuIcon sx={{ fontSize: 'inherit' }} />
            </IconButton>
            <Box sx={{ ml: 2 }}>
              <UploadPanel settings={settings} setSettings={setSettings} />
            </Box>
          </Box>
        </Box>
      )}
      <Drawer
        variant={isLargeScreen ? 'temporary' : 'permanent'}
        open={isLargeScreen ? mobileOpen : true}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: 'block', md: 'block' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
        }}
      >
        <Menu onMenuItemClick={handleMenuItemClick} />
      </Drawer>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: 'background.default',
          padding: '50px',
          marginLeft: { md: `${drawerWidth}px` },
          marginRight: { md: `${rightPanelWidth}px` },
          marginTop: { xs: '56px', md: '0' },
          width: { md: `calc(100% - ${drawerWidth}px - ${rightPanelWidth}px)` },
        }}
      >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/interview"
            element={<Interview settings={settings} />}
          />
          <Route path="/event" element={<Event settings={settings} />} />
          <Route path="/peepo" element={<Peepo settings={settings} />} />
          <Route path="/timeline" element={<Timeline settings={settings} />} />
          <Route path="/icam" element={<Icam settings={settings} />} />
          <Route
            path="/contributing"
            element={<Contributing settings={settings} />}
          />
          <Route path="/rca" element={<Rca settings={settings} />} />
          <Route
            path="/learnings"
            element={<Learnings settings={settings} />}
          />
        </Routes>
      </Box>
      {!isLargeScreen && (
        <Drawer
          sx={{
            width: rightPanelWidth,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: rightPanelWidth,
              boxSizing: 'border-box',
              padding: theme.spacing(2),
            },
          }}
          variant="permanent"
          anchor="right"
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'flex-start',
              padding: 2,
            }}
          >
            <UploadPanel settings={settings} setSettings={setSettings} />
          </Box>
        </Drawer>
      )}
    </Box>
  );
};

export default App;
