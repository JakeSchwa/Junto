import React, { useEffect, useState } from "react";
import Post from "./Post";

const PostList = ({userId, self}) => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    getPosts(userId);
  },[userId]);

  const getPosts = async (userId) => {
    try {
      const res = await fetch(`/posts/?userId=${userId}`);
      const data = await res.json();
      setPosts(data);
    } catch (err) {
      console.error(err);
      console.log("error getting Posts");
    }
  };

  const displayPosts = () => {
    return posts.map((post) => (
      <Post key={post.id} post={post} self={self}/>
    ));
  };

  return <div id='postList'>{displayPosts()}</div>;
};

export default PostList;
