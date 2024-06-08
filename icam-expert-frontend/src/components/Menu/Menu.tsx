import React from 'react';
import {
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
} from '@mui/material';
import { Link } from 'react-router-dom';

const Menu: React.FC = () => {
  return (
    <div>
      <Typography variant="h6" style={{ padding: '16px' }}>
        ICAM
      </Typography>
      <List>
        <ListItemButton component={Link} to="/">
          <ListItemText primary="Home" />
        </ListItemButton>
        <ListItem button component={Link} to="/expert">
          <ListItemText primary="Expert" />
        </ListItem>
      </List>
    </div>
  );
};

export default Menu;
