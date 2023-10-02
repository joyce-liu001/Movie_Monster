import React from 'react';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import PageRoutes from '../../utils/PageRoutes';
import { useNavigate } from 'react-router-dom';
import { UsersType } from '../types/UsersType';

const UserItem = ({ user }: { user: UsersType }) => {
  const navigate = useNavigate();

  const handleClick = (_: any) => {
    navigate(`${PageRoutes.USERS}/${user.uId}`);
  };

  // const addFriend = (e: any) => {
  //   e.stopPropagation();
  //   console.log(e);
  // };

  return (
    <ListItem
      sx={{ width: '100%' }}
      disableGutters
      button
      onClick={handleClick}
      alignItems="flex-start"
      disableRipple
      // secondaryAction
        // <Tooltip title={`${user.isFriend ? 'Remove' : 'Add'} ${user.username} as a friend`}>
        //   <IconButton onClick={addFriend}>
        //     { user.isFriend ? <PersonRemove /> : <PersonAdd /> }
        //   </IconButton>
        // </Tooltip>
    >
      <ListItemAvatar>
        <Avatar alt={user.username} src={`data:image/jpeg;base64,${user.image}`} />
      </ListItemAvatar>
      <ListItemText
        primary={user.username}
        secondary={
          <React.Fragment>
            <Typography
              sx={{ display: 'inline' }}
              component="span"
              variant="body2"
              color="text.secondary"
            >
              {user.isAdmin ? 'admin' : 'user'}
            </Typography>
          </React.Fragment>
        }
      />
    </ListItem>
  );
};

export default UserItem;
