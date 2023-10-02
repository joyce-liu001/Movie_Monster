import React from 'react';
import { Box, IconButton, InputAdornment, Tooltip, Typography } from '@mui/material';
import { InputField } from './FormComponents';
import { Group, Slideshow } from '@mui/icons-material';
import UploadIcon from '@mui/icons-material/Upload';
import Users from './Users';
import { useAppDispatch } from '../../app/hooks';
import { addMovie } from '../slices/MovieSlice';
import { UserType } from '../types/UserTypes';

const UserAdminTab = ({ user }: { user: UserType }) => {
  const dispatch = useAppDispatch();
  const [imdbUrl, setImdbUrl] = React.useState('');

  const handleKeyDown = async (e: any) => {
    if (e.key === 'Enter') handleUpload();
  };

  const handleUpload = async () => await dispatch(addMovie({ imdbId: imdbUrl }));

  return (
    <Box display='flex' flexDirection='column' alignItems='center' maxWidth='md' width='100%'>
      <Box display='flex' alignSelf='flex-start' mt={3}>
        <Slideshow />
        <Typography variant='h5' ml={1} component='span'>
          Add a new movie
        </Typography>
      </Box>
      <InputField
        name='IMDb movie url suffix, e.g. tt2953050'
        value={imdbUrl}
        onChange={(e: any) => setImdbUrl(e.target.value)}
        onKeyDown={handleKeyDown}
        error={imdbUrl !== '' && !/^tt\d{7}$/i.test(imdbUrl)}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Tooltip title='Add a new movie'>
                <IconButton
                  tabIndex={-1}
                  edge="end"
                  onClick={handleUpload}
                >
                  <UploadIcon />
                </IconButton>
              </Tooltip>
            </InputAdornment>
          ),
        }}
      />

      <Box display='flex' flexDirection='column' alignSelf='flex-start' mt={3} width='100%'>
        <Box display='flex' width='100%' mb={2}>
          <Group />
          <Typography variant='h5' ml={1} component='span'>
            Manage Users
          </Typography>
        </Box>
        <Users />
      </Box>
    </Box>
  );
};

export default UserAdminTab;
