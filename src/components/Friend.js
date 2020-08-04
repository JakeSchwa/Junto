import React from 'react';

import ListGroupItem from 'react-bootstrap/ListGroupItem';
import { Link } from 'react-router-dom';

const Friend = ({ friend }) => {
  return (
    <ListGroupItem>
      <Link
        className='friendsPage'
        to={{ pathname: `/friend/${friend.id}`, state: { friend } }}
      >
        {friend.name}
      </Link>
    </ListGroupItem>
  );
};

export default Friend;
