import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { Box, CssBaseline, Drawer } from '@mui/material';
import Menu from './components/Menu/Menu';
import Home from './components/Pages/Home';
import Expert from './components/Pages/Expert';

const drawerWidth = 240;

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
          p: 3,
          marginLeft: `${drawerWidth}px`,
        }}
      >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/expert" element={<Expert />} />
        </Routes>
      </Box>
    </Box>
  );
};

export default App;
