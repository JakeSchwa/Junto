import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUserState } from '../context/user-context';

const PrivateRoute = ({ children }) => {
  const { user } = useUserState();
  return user.isLoggedIn ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;
