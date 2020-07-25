import React, { useEffect, useState } from "react";
import Post from "./Post";

const PostList = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    getPosts();
  }, []);

  const getPosts = async () => {
    try {
      const res = await fetch("/posts");
      const data = await res.json();
      setPosts(data);
    } catch (err) {
      console.error(err);
      console.log("error getting Posts");
    }
  };

  const displayPosts = () => {
    return posts.map((post) => (
      <Post key={post.id} post={post} />
    ));
  };

  return <div id='postList'>{displayPosts()}</div>;
};

export default PostList;
