import React from 'react';
import {
  Avatar, Backdrop,
  Box, Button, CircularProgress, Container
} from '@mui/material';
import { InputField } from '../components/FormComponents';
import { LockResetOutlined, MailLockOutlined } from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import PageRoutes from '../../utils/PageRoutes';
import { useAppDispatch } from '../../app/hooks';
import { passwordReset, passwordResetRequest } from '../slices/AuthUserSlice';
import { showNotification } from '../slices/NotificationSlice';
import { NotificationStatus } from '../types/NotificationType';

const PasswordResetPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = React.useState('');
  const [resetCode, setResetCode] = React.useState('');
  const [newPassword, setNewPassword] = React.useState('');
  const [confirmNewPassword, setConfirmNewPassword] = React.useState('');
  const [hasRequested, setHasRequested] = React.useState(false);
  const [open, setOpen] = React.useState(false);

  const handleRequestCode = async () => {
    try {
      setOpen(true);
      await dispatch(passwordResetRequest({ email })).unwrap();
      setOpen(false);
      dispatch(showNotification({ message: 'Password reset code has been sent to your email!', httpStatus: 0, type: 'success', status: NotificationStatus.SHOWING }));
      setHasRequested(true);
    } catch (e) {
      setOpen(false);
      navigate(PageRoutes.LOGIN);
    }
  };

  const handlePasswordReset = async () => {
    if (newPassword !== confirmNewPassword) {
      dispatch(showNotification({ message: 'Error: Password mismatch confirm password!', httpStatus: 0, type: 'error', status: NotificationStatus.SHOWING }));
    } else {
      try {
        await dispatch(passwordReset({ resetCode, newPassword })).unwrap();
        dispatch(showNotification({ message: 'Password has been reset!', httpStatus: 0, type: 'success', status: NotificationStatus.SHOWING }));
        setHasRequested(false);
        navigate(PageRoutes.LOGIN);
      } catch {}
      // No need, can remove
      navigate(PageRoutes.LOGIN);
      setHasRequested(false);
      console.log(JSON.stringify({ resetCode, newPassword }, null, 2));
      // Maybe navigate back to the login page
    }
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
          { !hasRequested ? <MailLockOutlined /> : <LockResetOutlined /> }
        </Avatar>
        { !hasRequested
          ? <Box width='100%'>
            <InputField name="email" type="email" value={email} onChange={(e: any) => setEmail(e.target.value)}/>
            <Button className='mt-1' variant="outlined" color="primary" onClick={handleRequestCode} fullWidth>Get Reset Code</Button>
          </Box>
          : <Box width='100%'>
            <InputField name="reset code" value={resetCode} onChange={(e: any) => setResetCode(e.target.value)}/>
            <InputField name="new password" value={newPassword} onChange={(e: any) => setNewPassword(e.target.value)}/>
            <InputField error={confirmNewPassword && newPassword !== confirmNewPassword} name="confirm new password" value={confirmNewPassword} onChange={(e: any) => setConfirmNewPassword(e.target.value)}/>
            <Button className='mt-1' variant="outlined" color="primary" onClick={handlePasswordReset} fullWidth>Enter Reset Code</Button>
          </Box>
        }
        <Box display='flex' textAlign='center' mt={4} justifyContent='center'>
          <Link to={PageRoutes.LOGIN} className='text-decoration-none'>
            Remember Login?
          </Link>
        </Box>
      </Box>
    </Container>
  );
};

export default PasswordResetPage;
