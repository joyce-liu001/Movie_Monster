import React from 'react';
import { AuthUserStatus } from '../../types/AuthUserTypes';
import WrapperTemplate from './WrapperTemplate';

const LoggedOutWrapper = () => {
  return <WrapperTemplate message="You need to be logged out to view this page!" status={AuthUserStatus.LOGOUT} />;
};

export default LoggedOutWrapper;
