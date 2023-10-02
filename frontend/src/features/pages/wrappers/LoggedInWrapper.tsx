import React from 'react';
import { AuthUserStatus } from '../../types/AuthUserTypes';
import WrapperTemplate from './WrapperTemplate';

const LoggedInWrapper = () => {
  return <WrapperTemplate message="You need to be logged in to view this page!" status={AuthUserStatus.LOGIN} />;
};

export default LoggedInWrapper;
