import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import { withRouter } from 'react-router-dom';

const TopNavbar = ({ history }) => {
  const logout = async () => {
    await fetch('api/auth/logout', {
      method: 'POST',
    });
    history.push('/login');
  };

  return (
    <Navbar bg='light' expand='lg' className='justify-content-between'>
      <div id='left-section'>
        <Link to='/'>
          <Navbar.Brand>Junto</Navbar.Brand>
        </Link>
        <Link to='/friends'>
          <Navbar.Text>Friends</Navbar.Text>
        </Link>
      </div>
      <Link to='/'>
        <Navbar.Text>Mark Otto</Navbar.Text>
      </Link>
      <div id='right-section'>
        <Button id='logoutBtn' onClick={logout}>
          Logout
        </Button>
        <Link to='/post'>Post</Link>
      </div>
    </Navbar>
  );
};

export default withRouter(TopNavbar);
