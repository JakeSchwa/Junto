import React from 'react';
import PostList from '../../components/PostList';
import { useUserState } from '../../context/user-context';

const HomePage = () => {
  const { user } = useUserState();
  return <PostList userId={user._id} self={true} />;
};

export default HomePage;
