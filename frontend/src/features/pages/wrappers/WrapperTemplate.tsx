import React from 'react';
import { useSelector } from 'react-redux';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../../app/hooks';
import PageRoutes from '../../../utils/PageRoutes';
import { getAuthUserStatus } from '../../slices/AuthUserSlice';
import { showNotification } from '../../slices/NotificationSlice';
import { AuthUserStatus } from '../../types/AuthUserTypes';
import { NotificationStatus } from '../../types/NotificationType';

const WrapperTemplate = ({ message, status }: { message: string, status: AuthUserStatus }) => {
  const currAuthUserStatus = useSelector(getAuthUserStatus);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  React.useEffect(() => {
    if (currAuthUserStatus !== status) {
      dispatch(showNotification({
        message,
        httpStatus: 0,
        type: 'info',
        status: NotificationStatus.SHOWING,
      }));

      if (window.history.state && window.history.state.idx > 0) {
        navigate(-1);
      } else {
        navigate(PageRoutes.HOME, { replace: true });
      }
    }
  }, []);

  return <Outlet />;
};

export default WrapperTemplate;
