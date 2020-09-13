import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import './App.css';

import TopNavbar from './layout/Navbar';
import HomePage from './layout/pages/HomePage';
import AddPostPage from './layout/pages/AddPostPage';
import ErrorPage from './layout/pages/ErrorPage';
import EditPostPage from './layout/pages/EditPostPage';
import FriendsListPage from './layout/pages/FriendsListPage';
import FriendsPage from './layout/pages/FriendsPage';
import UserCreationPage from './layout/pages/UserCreationPage';
import LoginPage from './layout/pages/LoginPage';

import Container from 'react-bootstrap/Container';

import { UserProvider, useUserState } from './context/user-context';

const App = () => {
  return (
    <div className='App'>
      <UserProvider>
        <TopNavbar />
        <Container fluid='sm'>
          <Switch>
            <Route exact path='/login' component={LoginPage} />
            <Route exact path='/register' component={UserCreationPage} />
            <PrivateRoute exact path='/' component={HomePage} />
            <PrivateRoute exact path='/post' component={AddPostPage} />
            <PrivateRoute exact path='/edit/:postId' component={EditPostPage} />
            <PrivateRoute exact path='/friends' component={FriendsListPage} />
            <PrivateRoute exact path='/friends/:userId' component={FriendsPage} />
            <PrivateRoute component={ErrorPage} />
          </Switch>
        </Container>
      </UserProvider>
    </div>
  );
};

function PrivateRoute ({component: Component, ...rest}) {
  const { user } = useUserState();
  return (
    <Route
      {...rest}
      render={(props) => user.isLoggedIn === true
        ? <Component {...props} />
        : <Redirect to={{pathname: '/login', state: {from: props.location}}} />}
    />
  )
}

export default App;
