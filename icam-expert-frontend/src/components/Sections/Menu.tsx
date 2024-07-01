import {
  Box,
  List,
  ListItemButton,
  ListItemText,
  Typography,
  useTheme,
} from '@mui/material';
import { styled } from '@mui/system';
import React, { forwardRef } from 'react';
import {
  Link as RouterLink,
  LinkProps as RouterLinkProps,
  useLocation,
} from 'react-router-dom';

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
  const location = useLocation();

  const menuItemCss = {
    fontFamily: 'Roboto, sans-serif',
    fontSize: '0.9rem',
    fontWeight: 500,
    color: '#666666',
  };

  const selectedMenuItemCss = {
    ...menuItemCss,
    fontWeight: 'bold' as 'bold',
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
            sx={{
              backgroundColor:
                location.pathname === item.path ? 'white' : 'inherit',
              borderBottom:
                location.pathname === item.path
                  ? '1px solid rgb(156, 39, 176)'
                  : '1px solid #f0f0f0', // Very light line between items
              '&:hover': {
                backgroundColor: theme.palette.action.hover,
              },
              '&::after': {
                content: '""',
                display: location.pathname === item.path ? 'block' : 'none',
                position: 'absolute',
                bottom: 0,
                left: 0,
                width: '100%',
                height: '1px', // Thinner underline
                backgroundColor: 'rgb(156, 39, 176)',
              },
            }}
          >
            <ListItemText
              primary={item.title}
              primaryTypographyProps={
                location.pathname === item.path
                  ? selectedMenuItemCss
                  : menuItemCss
              }
            />
          </StyledListItemButton>
        ))}
      </List>
    </Box>
  );
};

export default Menu;
