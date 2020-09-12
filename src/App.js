import React from 'react';
import { Switch, Route } from 'react-router-dom';
import './App.css';

import TopNavbar from './layout/Navbar';
import HomePage from './layout/pages/HomePage';
import AddPostPage from './layout/pages/AddPostPage';
import ErrorPage from './layout/pages/ErrorPage';
import EditPostPage from './layout/pages/EditPostPage';
import FriendsListPage from './layout/pages/FriendsListPage';
import FriendsPage from './layout/pages/FriendsPage';
import UserCreationPage from './layout/pages/UserCreationPage';
import loginPage from './layout/pages/LoginPage';

import Container from 'react-bootstrap/Container';

import { UserProvider } from './context/user-context';

const App = () => {
  return (
    <div className='App'>
      <UserProvider>
        <TopNavbar />
        <Container fluid='sm'>
          <Switch>
            <Route exact path='/' component={HomePage} />
            <Route exact path='/newUser' component={UserCreationPage} />
            <Route exact path='/login' component={loginPage} />
            <Route exact path='/post' component={AddPostPage} />
            <Route exact path='/edit/:postId' component={EditPostPage} />
            <Route exact path='/friends' component={FriendsListPage} />
            <Route exact path='/friends/:userId' component={FriendsPage} />
            <Route component={ErrorPage} />
          </Switch>
        </Container>
      </UserProvider>
    </div>
  );
};

export default App;
