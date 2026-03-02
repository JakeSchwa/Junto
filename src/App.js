import React from 'react';
import { Routes, Route } from 'react-router-dom';
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
          <Routes>
            <Route path='/' element={<PrivateRoute><HomePage /></PrivateRoute>} />
            <Route path='/login' element={<PublicRoute restricted={true}><LoginPage /></PublicRoute>} />
            <Route path='/register' element={<PublicRoute restricted={true}><UserCreationPage /></PublicRoute>} />
            <Route path='/post' element={<PrivateRoute><AddPostPage /></PrivateRoute>} />
            <Route path='/edit/:postId' element={<PrivateRoute><EditPostPage /></PrivateRoute>} />
            <Route path='/friends' element={<PrivateRoute><FriendsListPage /></PrivateRoute>} />
            <Route path='/friends/:userId' element={<PrivateRoute><FriendsPage /></PrivateRoute>} />
            <Route path='*' element={<PublicRoute restricted={false}><ErrorPage /></PublicRoute>} />
          </Routes>
        </Container>
      </UserProvider>
    </div>
  );
};

export default App;
