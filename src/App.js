import React from "react";
import { Switch, Route } from "react-router-dom";
import "./App.css";

import TopNavbar from "./layout/Navbar";
import HomePage from "./layout/pages/HomePage";
import AddPostPage from "./layout/pages/AddPostPage";
import ErrorPage from "./layout/pages/ErrorPage";
import EditPostPage from "./layout/pages/EditPostPage";
import FriendsListPage from "./layout/pages/FriendsListPage";
import FriendsPage from "./layout/pages/FriendsPage"

import Container from "react-bootstrap/Container";

const App = () => {
  return (
    <div className='App'>
      <TopNavbar />
      <Container fluid='sm'>
        <Switch>
          <Route exact path='/' component={HomePage} />
          <Route path='/post' component={AddPostPage} />
          <Route path='/edit/:postId' component={EditPostPage} />
          <Route path='/friends' component={FriendsListPage} />
          <Route path='/friend/:userId' component={FriendsPage} />
          <Route component={ErrorPage} />
        </Switch>
      </Container>
    </div>
  );
};

export default App;
