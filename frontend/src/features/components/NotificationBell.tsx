import * as React from 'react';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Grow from '@mui/material/Grow';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import Stack from '@mui/material/Stack';
import { Link } from 'react-router-dom';
import PageRoutes from '../../utils/PageRoutes';
import { Badge, Box, Divider, IconButton, Tooltip, Typography } from '@mui/material';
import { Notifications } from '@mui/icons-material';

export default function NotificationBell() {
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef(null);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event: any) => {
    setOpen(false);
  };

  function handleListKeyDown(event: any) {
    if (event.key === 'Tab') {
      event.preventDefault();
      setOpen(false);
    } else if (event.key === 'Escape') {
      setOpen(false);
    }
  }

  // return focus to the button when we transitioned from !open -> open
  const prevOpen = React.useRef(open);
  React.useEffect(() => {
    prevOpen.current = open;
  }, [open]);

  const notifications = [
    {
      title: 'Friend Request',
      date: '08:20 pm',
      message: 'Damon has sent you a friend request!',
    },
    {
      title: 'Review Liked',
      date: '08:10 pm',
      message: 'Matt has liked your review of the movie "Encanto"!',
    },
    {
      title: 'Review Liked',
      date: '07:50 pm',
      message: 'Joyce has liked your review of the movie "Encanto"!',
    },
    {
      title: 'Movie Share',
      date: '07:35 pm',
      message: 'Owen has shared the movie "Encanto" with you!',
    },
  ];

  return (
    <Stack direction="row">
      <Tooltip title='Notifications'>
        <IconButton
          ref={anchorRef}
          id="composition-button"
          onClick={handleToggle}
          color='inherit'
        >
          <Badge
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
            badgeContent={notifications.length}
            showZero
            color='secondary'
          >
            <Notifications sx={{ fontSize: '28px' }} />
          </Badge>
        </IconButton>
      </Tooltip>
      <Popper
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        placement="top-start"
        transition
        disablePortal
      >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin:
                placement === 'top-start' ? 'left top' : 'right top',
            }}
          >
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList
                  autoFocusItem={open}
                  id="composition-menu"
                  aria-labelledby="composition-button"
                  onKeyDown={handleListKeyDown}
                >
                  {
                    notifications.map((notif, i) => {
                      return (
                        <Box key={notif.message + i} onClick={handleClose}>
                          { i > 0 && <Divider sx={{ width: '100%' }}/> }
                          <MenuItem component={Link} to={`${PageRoutes.USERS}/${999999}`}>
                            <Box my={1}>
                              <Typography color='primary'>
                                {notif.title} {`(${notif.date})`}
                              </Typography>
                              <Typography>
                                {notif.message}
                              </Typography>
                            </Box>
                          </MenuItem>
                        </Box>
                      );
                    })
                  }
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </Stack>
  );
}
