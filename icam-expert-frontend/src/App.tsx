import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { Box, CssBaseline, Drawer } from '@mui/material';
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
  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <Menu />
      </Drawer>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: 'background.default',
          padding: '50px',
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
    </Box>
  );
};

export default App;
