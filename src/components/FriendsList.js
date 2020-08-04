import React, { useEffect, useState } from 'react';
import Friend from '../components/Friend';

const FriendsList = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    getUsers();
  }, []);

  const getUsers = async () => {
    try {
      const res = await fetch('/users?id_ne=1');
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.log(err);
      console.log('error getting Users');
    }
  };

  const displayUsers = () => {
    return users.map((user) => <Friend key={user.id} friend={user} />);
  };

  return <div id='friendsList'>{displayUsers()}</div>;
};

export default FriendsList;
