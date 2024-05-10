import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from '../../services/store';
import { Preloader } from '../ui/preloader';
import { getIsAuthChecked } from '../../services/slices/userSlice';

type PrivateRouteProps = {
  onlyUnAuth?: boolean;
  children: React.ReactElement;
};

export const PrivateRoute = ({ onlyUnAuth, children }: PrivateRouteProps) => {
  const location = useLocation();
  const checkAuthenticated = useSelector(getIsAuthChecked);
  const user = useSelector((state) => state.user.data);

  console.log(`checkAuthenticated: ${checkAuthenticated} user: ${user}`);

  if (!checkAuthenticated) {
    return <Preloader />;
  }

  if (!onlyUnAuth && !user) {
    return <Navigate replace to='/login' state={{ from: location }} />;
  }

  if (onlyUnAuth && user) {
    const from = location.state?.from || { pathname: '/' };
    const backgroundLocation = location.state?.from?.state || null;
    return <Navigate replace to={from} state={{ backgroundLocation }} />;
  }

  return children;
};
