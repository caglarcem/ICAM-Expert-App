import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import {
  Box,
  Collapse,
  List,
  ListItemButton,
  ListItemText,
  Typography,
  useTheme,
} from '@mui/material';
import { styled } from '@mui/system';
import React, { forwardRef, useState } from 'react';
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

  const [openEvidenceCollection, setOpenEvidenceCollection] = useState(false);
  const [openICAMAnalysis, setOpenICAMAnalysis] = useState(false);

  const handleClickEvidenceCollection = () => {
    setOpenEvidenceCollection(!openEvidenceCollection);
  };

  const handleClickICAMAnalysis = () => {
    setOpenICAMAnalysis(!openICAMAnalysis);
  };

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
    { path: '/event', title: 'Event Description', group: 'ICAM Analysis' },
    {
      path: '/interview',
      title: 'Follow-up Interview',
      group: 'Evidence Collection',
    },
    { path: '/peepo', title: 'PEEPO Builder', group: 'Evidence Collection' },
    { path: '/timeline', title: 'Timeline Builder', group: 'ICAM Analysis' },
    { path: '/icam', title: 'ICAM Table', group: 'ICAM Analysis' },
    {
      path: '/contributing',
      title: 'Contributing Factors',
      group: 'ICAM Analysis',
    },
    { path: '/rca', title: 'Root Cause Analysis', group: 'ICAM Analysis' },
    {
      path: '/learnings',
      title: 'Organisational Learnings',
      group: 'ICAM Analysis',
    },
  ];

  const renderMenuItems = (group: string) => {
    return menuItems
      .filter(item => item.group === group)
      .map(item => (
        <StyledListItemButton
          key={item.path}
          to={item.path}
          onClick={onMenuItemClick}
          sx={{
            backgroundColor:
              location.pathname === item.path
                ? theme.palette.action.hover
                : 'inherit',
            borderBottom:
              location.pathname === item.path
                ? '1px solid rgb(156, 39, 176)'
                : '1px solid #f0f0f0',
            pl: 4, // Indent submenu items
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
              height: '1px',
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
      ));
  };

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
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <img
          src="icam_expert_logo.svg"
          alt="ICAM Expert Logo"
          style={{ width: 40, height: 40, marginRight: theme.spacing(1) }}
        />
        <Typography
          variant="h6"
          sx={{
            fontFamily: 'Roboto, sans-serif',
            fontSize: '1.25rem',
            fontWeight: 700,
          }}
        >
          ICAM Expert
        </Typography>
      </Box>
      <List sx={{ marginTop: '20px' }}>
        {menuItems
          .filter(item => !item.group)
          .map(item => (
            <StyledListItemButton
              key={item.path}
              to={item.path}
              onClick={onMenuItemClick}
              sx={{
                backgroundColor:
                  location.pathname === item.path
                    ? theme.palette.action.hover
                    : 'inherit',
                borderBottom:
                  location.pathname === item.path
                    ? '1px solid rgb(156, 39, 176)'
                    : '1px solid #f0f0f0',
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
                  height: '1px',
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
        <ListItemButton
          onClick={handleClickEvidenceCollection}
          sx={{
            '& .MuiTypography-root': {
              fontSize: '14.4px',
              fontWeight: 'bold',
            },
          }}
        >
          <ListItemText primary="Evidence Collection" />
          {openEvidenceCollection ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={openEvidenceCollection} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {renderMenuItems('Evidence Collection')}
          </List>
        </Collapse>
        <ListItemButton
          onClick={handleClickICAMAnalysis}
          sx={{
            '& .MuiTypography-root': {
              fontSize: '14.4px',
              fontWeight: 'bold',
            },
          }}
        >
          <ListItemText primary="ICAM Analysis" />
          {openICAMAnalysis ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={openICAMAnalysis} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {renderMenuItems('ICAM Analysis')}
          </List>
        </Collapse>
      </List>
    </Box>
  );
};

export default Menu;
