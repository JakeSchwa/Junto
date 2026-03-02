import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUserState } from '../context/user-context';

const PublicRoute = ({ children, restricted }) => {
  const { user } = useUserState();
  return user.isLoggedIn && restricted ? <Navigate to="/" replace /> : children;
};

export default PublicRoute;
