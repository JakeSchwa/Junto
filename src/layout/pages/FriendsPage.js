import React from "react";
import PostList from "../../components/PostList"

const FriendsPage = ( { match: { params }} ) => {
  return <PostList userId={params.userId} self={false}/>;
};

export default FriendsPage;
