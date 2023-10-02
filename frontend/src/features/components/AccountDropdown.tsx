import * as React from 'react';
import { Avatar, IconButton, Tooltip } from '@mui/material';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Grow from '@mui/material/Grow';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import Stack from '@mui/material/Stack';
import { useNavigate } from 'react-router-dom';
import PageRoutes from '../../utils/PageRoutes';
import { useSelector } from 'react-redux';
import {
  getAuthUserImage,
  getAuthUserUId,
  getAuthUserUsername,
  getLogoutAllAuthUser,
  getLogoutAuthUser
} from '../slices/AuthUserSlice';
import { useAppDispatch } from '../../app/hooks';

export default function MenuListComposition() {
  const image = useSelector(getAuthUserImage);
  const username = useSelector(getAuthUserUsername);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const currUserUId = useSelector(getAuthUserUId);
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef(null);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (_: any) => {
    setOpen(false);
  };

  const handleLogoutClick = async () => {
    await dispatch(getLogoutAuthUser({}));
    navigate(PageRoutes.LOGIN);
  };

  const handleProfileClick = () => {
    navigate(PageRoutes.USERS + '/' + currUserUId);
  };

  const handleLogoutAllClick = async () => {
    await dispatch(getLogoutAllAuthUser({}));
    navigate(PageRoutes.LOGIN);
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

  return (
    <Stack direction="row">
      <Tooltip title={username}>
        <IconButton
          ref={anchorRef}
          id="composition-button"
          onClick={handleToggle}
        >
          <Avatar
            src={`data:image/jpeg;base64,${image}`}
          />
        </IconButton>
      </Tooltip>
      <Popper
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        placement="bottom-start"
        transition
        disablePortal
      >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin:
                placement === 'bottom-start' ? 'left top' : 'left bottom',
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
                  <MenuItem onClick={handleProfileClick}>Profile</MenuItem>
                  <MenuItem onClick={handleLogoutClick}>Logout</MenuItem>
                  <MenuItem onClick={handleLogoutAllClick}>Logout all</MenuItem>
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </Stack>
  );
}
