import React from "react";
import { Link } from "react-router-dom";
import Navbar from "react-bootstrap/Navbar";

const TopNavbar = () => {
  return (
    <Navbar bg='light' expand='lg' className='justify-content-between'>
      <div id='left-section'>
      <Link to='/'>
        <Navbar.Brand>Junto</Navbar.Brand>
      </Link>
      <Link to='/friends'>
        <Navbar.Text>
          Friends
        </Navbar.Text>
      </Link>
      </div>
      <Link to='/'>
        <Navbar.Text>Mark Otto</Navbar.Text>
      </Link>
      <Link to='/post'>Post</Link>
    </Navbar>
  );
};

export default TopNavbar;
