import React from 'react';

import { Link, useLocation } from 'react-router-dom';

import {
  AppBar, Box, Toolbar, Typography, IconButton,
  MenuItem, Menu, Button, Avatar, Divider, Tooltip
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

import MovieMonsterLogo from '../../assets/movie-monster-logo-transparent.png';
import AccountDropdown from './AccountDropdown';
import PageRoutes from '../../utils/PageRoutes';
// import NotificationBell from './NotificationBell';
import { useSelector } from 'react-redux';
import { getAuthUserStatus } from '../slices/AuthUserSlice';
import { AuthUserStatus } from '../types/AuthUserTypes';

const PAGES = [
  {
    route: PageRoutes.HOME,
    navDisplay: 'Home',
    requireAuth: false,
  },
  {
    route: PageRoutes.MOVIES,
    navDisplay: 'Movies',
    requireAuth: false,
  },
  {
    route: PageRoutes.USERS,
    navDisplay: 'Users',
    requireAuth: true,
  },
  {
    route: PageRoutes.BLOGS,
    navDisplay: 'Blogs',
    requireAuth: true,
  },
];

const MyNavButton = ({ page, sx }: any) => {
  const { pathname: currLocation } = useLocation();

  const selected = currLocation.startsWith(page.route);
  if (selected) {
    sx.boxShadow = 4;
  } else {
    sx.boxShadow = 0;
  }

  const color = currLocation === page.route ? '#66ff00' : '#0096ff';
  return (
    <Link to={page.route} className='text-decoration-none m-0 p-0'>
      <Button
        sx={sx}
      >
        {page.navDisplay}
        {selected && <Divider orientation="horizontal" sx={{ borderBottomWidth: 5, borderColor: color, color }} flexItem/>}
      </Button>
    </Link>
  );
};

export default function NavBar({ mode, toggleMode }: {mode: string, toggleMode: () => void}) {
  const authUserStatus = useSelector(getAuthUserStatus);
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const handleOpenNavMenu = (event: any) => setAnchorElNav(event.currentTarget);
  const handleCloseNavMenu = () => setAnchorElNav(null);

  const pages = PAGES.filter(page => !page.requireAuth || authUserStatus === AuthUserStatus.LOGIN);

  return (
    <AppBar position="fixed">
      <Toolbar sx={{ bgcolor: 'black', height: 0 }} className='myNavBar'>
        <Link to={PageRoutes.ABOUT} className='text-decoration-none'>
          <Tooltip title='Go to About page'>
            <IconButton sx={{ display: { xs: 'none', md: 'flex' } }} >
              <Avatar
                alt="Home Page"
                src={MovieMonsterLogo}
              />
            </IconButton>
          </Tooltip>
        </Link>

        {/* Mobile Site */}
        <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
          <IconButton
            size="large"
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleOpenNavMenu}
            color="inherit"
          >
            <MenuIcon />
          </IconButton>
          <Menu
            id="menu-appbar"
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'left',
            }}
            anchorEl={anchorElNav}
            open={Boolean(anchorElNav)}
            onClose={handleCloseNavMenu}
            sx={{
              display: { xs: 'block', md: 'none' },
            }}
          >
            {
              pages.map((page) => {
                return (
                  <MenuItem onClick={handleCloseNavMenu} key={page.route} component={Link} to={page.route}>
                    <Typography textAlign="center" className='text-capitalize'>{page.navDisplay}</Typography>
                  </MenuItem>
                );
              })
            }
          </Menu>
        </Box>

        {/* Desktop Site */}
        <Box alignItems='center' sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
          {pages.map((page) => (
            <MyNavButton
              key={page.route}
              page={page}
              sx={{ my: 2, color: 'white', display: 'block' }}
            />
          ))}
        </Box>

        <Box className='d-flex flex-row' alignItems='center' sx={{ flexGrow: 0 }}>
          { authUserStatus === AuthUserStatus.LOGIN
            ? <AccountDropdown />
            : <>
              <Button component={Link} to={PageRoutes.LOGIN}>Login</Button>
              <Button component={Link} to={PageRoutes.REGISTER}>Register</Button>
            </>
          }
          {
            // <NotificationBell />
          }
          <IconButton onClick={toggleMode} color="inherit">
            {mode === 'dark' ? <Brightness4Icon /> : <Brightness7Icon />}
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
