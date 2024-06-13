import React, { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import {
  Box,
  CssBaseline,
  Drawer,
  IconButton,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Menu from './components/Sections/Menu';
import Home from './components/Pages/Home';
import Interview from './components/Pages/Interview';
import Event from './components/Pages/Event';
import Peepo from './components/Pages/Peepo';
import Timeline from './components/Pages/Timeline';
import Icam from './components/Pages/Icam';
import Contributing from './components/Pages/Contributing';
import Rca from './components/Pages/Rca';
import Learnings from './components/Pages/Learnings';
import UploadPanel from './components/Sections/UploadPanel';

const drawerWidth = 240;
const rightPanelWidth = 300;

const App: React.FC = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <CssBaseline />
      {isSmallScreen && (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: theme.spacing(1),
          }}
        >
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
          <UploadPanel />
        </Box>
      )}
      <Drawer
        variant={isSmallScreen ? 'temporary' : 'permanent'}
        open={isSmallScreen ? mobileOpen : true}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: 'block', sm: 'block' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
        }}
      >
        <Menu />
      </Drawer>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: 'background.default',
          padding: '50px',
          marginLeft: { sm: `${drawerWidth}px` },
          marginRight: { sm: `${rightPanelWidth}px` },
          marginTop: { xs: '56px', sm: '0' },
          width: { sm: `calc(100% - ${drawerWidth}px - ${rightPanelWidth}px)` },
        }}
      >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/interview" element={<Interview />} />
          <Route path="/event" element={<Event />} />
          <Route path="/peepo" element={<Peepo />} />
          <Route path="/timeline" element={<Timeline />} />
          <Route path="/icam" element={<Icam />} />
          <Route path="/contributing" element={<Contributing />} />
          <Route path="/rca" element={<Rca />} />
          <Route path="/learnings" element={<Learnings />} />
        </Routes>
      </Box>
      {!isSmallScreen && (
        <Drawer
          sx={{
            width: rightPanelWidth,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: rightPanelWidth,
              boxSizing: 'border-box',
            },
          }}
          variant="permanent"
          anchor="right"
        >
          <UploadPanel />
        </Drawer>
      )}
    </Box>
  );
};

export default App;
