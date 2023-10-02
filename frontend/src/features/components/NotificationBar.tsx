import { useAppDispatch } from '../../app/hooks';
import { useSelector } from 'react-redux';
import { getNotification, hideNotification } from '../slices/NotificationSlice';
import React from 'react';
import { NotificationStatus } from '../types/NotificationType';
import { Alert, Snackbar } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import PageRoutes from '../../utils/PageRoutes';
import { getAuthUserUId } from '../slices/AuthUserSlice';

const NotificationBar = () => {
  const dispatch = useAppDispatch();
  const notification = useSelector(getNotification);
  return (
    <React.Fragment>
      {
        notification.status === NotificationStatus.SHOWING && (
          <Snackbar open anchorOrigin={{ vertical: 'top', horizontal: 'center' }} sx={{ mt: 12 }} autoHideDuration={4000} onClose={() => dispatch(hideNotification())}>
            <Alert severity={notification.type}
                   onClose={() => dispatch(hideNotification())}>
              {
                notification.httpStatus !== 0
                  ? notification.httpStatus + ': '
                  : ''
              }
               {notification.message}
            </Alert>
          </Snackbar>
        )
      }
    </React.Fragment>
  );
};

export default NotificationBar;
