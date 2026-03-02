import React from "react";
import { useParams } from "react-router-dom";
import PostList from "../../components/PostList"

const FriendsPage = () => {
  const { userId } = useParams();
  return <PostList userId={userId} self={false}/>;
};

export default FriendsPage;
