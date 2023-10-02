import Autocomplete from '@mui/material/Autocomplete';
import { Box, Divider, List, TextField, Typography } from '@mui/material';
import React, { useEffect } from 'react';
import UserItem from '../components/UserItem';
import { getUsers, selectUsers } from '../slices/UsersSlice';
import { useDispatch, useSelector } from 'react-redux';
import { filterOptions } from '../../utils/Helper';

const Users = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    async function fetchData() {
      dispatch(getUsers({}));
    }
    fetchData().then();
  }, []);
  const users = useSelector((selectUsers));
  const [searchTerm, setSearchTerm] = React.useState('');

  const handleChange = (e: any, value: string | null) => {
    setSearchTerm(value || '');
  };

  return (
    <Box display='flex' flexDirection='column' alignItems='center' justifyContent='center' width='100%'>
      <Autocomplete
        sx={{ maxWidth: 'md' }}
        freeSolo
        autoHighlight
        disablePortal
        id="combo-box-demo"
        fullWidth
        options={users.map(u => u.username)}
        filterOptions={filterOptions}
        renderInput={(params) => <TextField {...params} label="Search users" />}
        onInputChange={handleChange}
      />

      {/* <Box mt={2} variant='h6' component={Typography} width='100%' maxWidth='md'> */}
      {/*   Friends */}
      {/*   <Divider sx={{ mt: 1 }} /> */}
      {/* </Box> */}

      {/* <List sx={{ width: '100%', maxWidth: 'md' }}> */}
      {/*   { */}
      {/*     users.filter(u => u.isFriend && u.username.toLowerCase().includes(searchTerm.toLowerCase())).map(u => { */}
      {/*       return <UserItem key={u.username} user={u} />; */}
      {/*     }) */}
      {/*   } */}
      {/* </List> */}

      <Box mt={1} variant='h6' component={Typography} width='100%' maxWidth='md'>
        All Users
        <Divider sx={{ mt: 1 }} />
      </Box>

      <List sx={{ width: '100%', maxWidth: 'md' }}>
        {
          users.filter(u => u.username.toLowerCase().includes(searchTerm.toLowerCase())).map(u => {
            return <UserItem key={u.username} user={u} />;
          })
        }
      </List>
    </Box>
  );
};

export default Users;
