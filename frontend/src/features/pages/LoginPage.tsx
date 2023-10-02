import React, { useEffect } from 'react';

import { Avatar, Box, Button, Container } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { LockOutlined } from '@mui/icons-material';
import { useAppDispatch } from '../../app/hooks';
import { getAuthUserInfo, getAuthUserUId, getLoginAuthUser } from '../slices/AuthUserSlice';
import { InputField, PasswordField } from '../components/FormComponents';
import PageRoutes from '../../utils/PageRoutes';
import { showNotification } from '../slices/NotificationSlice';
import { NotificationStatus } from '../types/NotificationType';
import { useSelector } from 'react-redux';

const LoginPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const currUserUId = useSelector(getAuthUserUId);
  const [password, setPassword] = React.useState('');
  const [email, setEmail] = React.useState('');
  useEffect(() => {
    async function fetchData() {
      await dispatch(getAuthUserInfo({ uId: currUserUId }));
    }
    if (currUserUId !== '') {
      fetchData().then(() => {
        dispatch(showNotification({ message: 'Login successful!', httpStatus: 0, type: 'success', status: NotificationStatus.SHOWING }));
        navigate(-1);
      }
      ).catch();
    }
  }, [currUserUId]);

  const handleSubmit = async () => {
    await dispatch(getLoginAuthUser({ email, password }));
    // await dispatch(getAuthUserInfo({}));
  };

  const handleKeyDown = async (e: any) => {
    if (e.key === 'Enter') await handleSubmit();
  };

  return (
    <Container component="main" maxWidth="sm">
      <Box border={2} borderColor="primary.main" p={4} display='flex' alignItems='center' flexDirection='column'>
        <Avatar className="mb-4">
          <LockOutlined />
        </Avatar>
        <InputField name="email" value={email} onChange={(e: any) => setEmail(e.target.value)} />
        <PasswordField name="password" onChange={(e: any) => setPassword(e.target.value)} onKeyDown={handleKeyDown}/>
        <Button className='mt-3' variant="outlined" color="primary" onClick={handleSubmit} fullWidth>Login</Button>
        <Box display='flex' textAlign='center' mt={4} justifyContent='center'>
          <Link to={PageRoutes.REGISTER} className='text-decoration-none'>
            Register a new account!
          </Link>
        </Box>
        <Box display='flex' textAlign='center' mt={1} justifyContent='center'>
          <Link to={PageRoutes.PASSWORD_RESET} className='text-decoration-none'>
            Forgot password?
          </Link>
        </Box>
      </Box>
    </Container>
  );
};

export default LoginPage;
