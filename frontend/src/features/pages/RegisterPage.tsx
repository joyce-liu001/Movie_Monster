import React from 'react';
import {
  Avatar, Backdrop, Box, Button, CircularProgress, Container
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { DeveloperModeOutlined } from '@mui/icons-material';
import { InputField, OptionPicker, PasswordField } from '../components/FormComponents';
import PageRoutes from '../../utils/PageRoutes';
import { useAppDispatch } from '../../app/hooks';
import { getRegisterAuthUser } from '../slices/AuthUserSlice';
import { showNotification } from '../slices/NotificationSlice';
import { NotificationStatus } from '../types/NotificationType';

const genderOptions = [
  '',
  'male',
  'female',
  'other',
];

const RegisterPage = () => {
  const [username, setUsername] = React.useState('');
  const [age, setAge] = React.useState(20);
  const [gender, setGender] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [open, setOpen] = React.useState(false);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (password !== confirmPassword) {
      dispatch(showNotification({ message: 'Error: Password mismatch confirm password!', httpStatus: 0, type: 'error', status: NotificationStatus.SHOWING }));
    } else {
      try {
        setOpen(true);
        await dispatch(getRegisterAuthUser({ username, email, password, age, gender })).unwrap();
        setOpen(false);
        dispatch(showNotification({ message: 'Register success, please come to your mail box to click the link for validation', httpStatus: 0, type: 'info', status: NotificationStatus.SHOWING }));
        navigate(PageRoutes.LOGIN);
      } catch {
        setOpen(false);
      }
    }
  };

  const handleKeyDown = async (e: any) => {
    if (e.key === 'Enter') await handleSubmit();
  };

  return (
    <Container component="main" maxWidth="sm">
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={open}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <Box border={2} borderColor="primary.main" p={4} display='flex' alignItems='center' flexDirection='column'>
        <Avatar className="mb-4">
          <DeveloperModeOutlined />
        </Avatar>
        <InputField name="username" value={username} onChange={(e: any) => setUsername(e.target.value)}/>
        <Box display='flex' flexDirection='row' alignItems='space-between' width='100%'>
          <OptionPicker name='age' value={age} options={[...Array(120).keys()]} setValue={(e: any) => setAge(e.target.value)} />
          <OptionPicker name='gender' value={gender} options={genderOptions} setValue={(e: any) => setGender(e.target.value)} />
        </Box>
        <InputField type='email' name="email" value={email} onChange={(e: any) => setEmail(e.target.value)}/>
        <PasswordField name="password" value={password} onChange={(e: any) => setPassword(e.target.value)}/>
        <PasswordField
          name="confirm password"
          value={confirmPassword}
          error={confirmPassword !== password}
          onChange={(e: any) => setConfirmPassword(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <Button className='mt-3' variant="outlined" color="primary" onClick={handleSubmit} fullWidth>Register</Button>
        <Box display='flex' mt={3} justifyContent='center'>
          <Link to={PageRoutes.LOGIN} className='text-decoration-none'>
            Already have an account? Login!
          </Link>
        </Box>
      </Box>
    </Container>
  );
};

export default RegisterPage;
