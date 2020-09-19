import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useUserState } from '../context/user-context';

const PrivateRoute = ({component: Component, ...rest}) => {
  const { user } = useUserState();
  return (
    // Show the component only when the user is logged in
    // Otherwise, redirect the user to /login page
    <Route 
      {...rest} 
      render={props => (
        user.isLoggedIn ?
          <Component {...props} />
        : <Redirect to="/login" />
      )} 
    />
  );
};

export default PrivateRoute;