import React from 'react';
import {
  List,
  ListItemButton,
  ListItemText,
  Typography,
  useTheme,
  Box,
} from '@mui/material';
import {
  Link as RouterLink,
  LinkProps as RouterLinkProps,
} from 'react-router-dom';
import { styled } from '@mui/system';
import { forwardRef } from 'react';

// Define a custom link component that forwards refs and passes the `to` prop.
const CustomRouterLink = forwardRef<HTMLAnchorElement, RouterLinkProps>(
  function CustomLink(props, ref) {
    const { to, ...other } = props;
    return <RouterLink ref={ref} to={to} {...other} />;
  }
);

const StyledListItemButton = styled((props: RouterLinkProps) => (
  <ListItemButton component={CustomRouterLink} {...props} />
))(({ theme }) => ({
  borderBottom: `1px solid ${theme.palette.divider}`,
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
}));

interface MenuProps {
  onMenuItemClick: () => void;
}

const Menu: React.FC<MenuProps> = ({ onMenuItemClick }) => {
  const theme = useTheme();

  const menuItemCss = {
    fontFamily: 'Roboto, sans-serif',
    fontSize: '0.9rem',
    fontWeight: 500,
    color: '#666666',
  };

  const menuItems = [
    { path: '/', title: 'Home' },
    { path: '/event', title: 'Event Description' },
    { path: '/peepo', title: 'PEEPO Builder' },
    { path: '/timeline', title: 'Timeline Builder' },
    { path: '/icam', title: 'ICAM Analysis' },
    { path: '/contributing', title: 'Contributing Factors' },
    { path: '/rca', title: 'Root Cause Analysis' },
    { path: '/interview', title: 'Follow-up Interview' },
    { path: '/learnings', title: 'Organisational Learnings' },
  ];

  return (
    <Box
      sx={{
        width: 240,
        boxShadow: theme.shadows[3],
        bgcolor: 'background.paper',
        minHeight: '100vh',
        padding: theme.spacing(2),
      }}
    >
      <Typography
        variant="h6"
        sx={{
          padding: theme.spacing(2, 0),
          fontFamily: 'Roboto, sans-serif',
          fontSize: '1.25rem',
          fontWeight: 700,
        }}
      >
        ICAM Expert
      </Typography>
      <List>
        {menuItems.map(item => (
          <StyledListItemButton
            key={item.path}
            to={item.path}
            onClick={onMenuItemClick}
          >
            <ListItemText
              primary={item.title}
              primaryTypographyProps={menuItemCss}
            />
          </StyledListItemButton>
        ))}
      </List>
    </Box>
  );
};

export default Menu;
