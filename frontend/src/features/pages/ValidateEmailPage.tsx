import { Box, CircularProgress, Typography } from '@mui/material';
import React from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import PageRoutes from '../../utils/PageRoutes';
import { useAppDispatch } from '../../app/hooks';
import { getAuthUserValidate } from '../slices/AuthUserSlice';
import { showNotification } from '../slices/NotificationSlice';
import { NotificationStatus } from '../types/NotificationType';

const ValidateEmailPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { validationCode } = useParams();

  const [isValidating, setValidating] = React.useState(true);

  React.useEffect(() => {
    dispatch(getAuthUserValidate({ validationCode })).unwrap().then(() => {
      dispatch(showNotification({ message: 'Email validated successfully!', httpStatus: 0, type: 'success', status: NotificationStatus.SHOWING }));
      setValidating(false);
      navigate(PageRoutes.HOME);
    }).catch(() => {
      navigate(PageRoutes.LOGIN);
    });
  }, []);

  return (
    <Box display='flex' p={2} flexDirection='column' alignItems='center'>
      <Typography variant='h3'>Email Validation</Typography>
      { isValidating
        ? <Box display='flex' flexDirection='column' alignItems='center'>
          <CircularProgress size={50} sx={{ my: 4 }} />
          <Typography variant='h6' textAlign='center'>
            Your email is being validated.
          </Typography>
        </Box>
        : <Box mt={4} display='flex' flexDirection='column' alignItems='center'>
          <Typography variant='h6' textAlign='center'>
            Your email has been validated. Click <Link className='text-decoration-none' to={PageRoutes.HOME}>here</Link> to go back home.
          </Typography>
        </Box>
      }
    </Box>
  );
};

export default ValidateEmailPage;
