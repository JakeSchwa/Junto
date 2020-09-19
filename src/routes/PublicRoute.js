import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useUserState } from '../context/user-context';

const PublicRoute = ({component: Component, restricted, ...rest}) => {
  const { user } = useUserState();
  console.log("Public route | user: ", user);
  return (
    // restricted = false meaning public route
    // restricted = true meaning restricted route
    <Route 
      {...rest} 
      render={props => (
        user.isLoggedIn && restricted ?
          <Redirect to="/" />
        : <Component {...props} />
      )} 
    />
    );
};

export default PublicRoute;