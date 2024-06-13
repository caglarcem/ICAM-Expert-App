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
  useLocation,
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

interface StyledListItemButtonProps extends RouterLinkProps {
  selected?: boolean;
}

const StyledListItemButton = styled((props: StyledListItemButtonProps) => (
  <ListItemButton component={CustomRouterLink} {...props} />
))<{ selected?: boolean }>(({ theme, selected }) => ({
  borderBottom: `1px solid ${theme.palette.divider}`,
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
  backgroundColor: selected ? theme.palette.action.selected : 'inherit',
}));

const Menu: React.FC = () => {
  const theme = useTheme();
  const location = useLocation();

  const menuItemCss = {
    fontFamily: 'Roboto, sans-serif',
    fontSize: '0.9rem',
    fontWeight: 500,
    color: '#666666',
  };

  const menuItems = [
    { path: '/', title: 'Home' },
    { path: '/interview', title: 'Generate Interview' },
    { path: '/event', title: 'Event Description' },
    { path: '/peepo', title: 'PEEPO Builder' },
    { path: '/timeline', title: 'Timeline Builder' },
    { path: '/icam', title: 'ICAM Analysis' },
    { path: '/contributing', title: 'Contributing Factors' },
    { path: '/rca', title: 'Root Cause Analysis' },
    { path: '/learnings', title: 'Key Learnings' },
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
            selected={location.pathname === item.path}
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
