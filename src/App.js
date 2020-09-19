import React from 'react';
import { Switch } from 'react-router-dom';
import './App.css';
import PrivateRoute from './routes/PrivateRoute';
import PublicRoute from './routes/PublicRoute';

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

import { UserProvider } from './context/user-context';

const App = () => {
  return (
    <div className='App'>
      <UserProvider>
        <TopNavbar />
        <Container fluid='sm'>
          <Switch>
            <PrivateRoute exact path='/' component={HomePage} />
            <PublicRoute exact path='/login' restricted={true} component={LoginPage} />
            <PublicRoute exact path='/register' restricted={true} component={UserCreationPage} />
            <PrivateRoute exact path='/post' component={AddPostPage} />
            <PrivateRoute exact path='/edit/:postId' component={EditPostPage} />
            <PrivateRoute exact path='/friends' component={FriendsListPage} />
            <PrivateRoute exact path='/friends/:userId' component={FriendsPage} />
            <PublicRoute restricted={false} component={ErrorPage} />
          </Switch>
        </Container>
      </UserProvider>
    </div>
  );
};

export default App;
