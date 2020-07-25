import React from "react";
import { withRouter } from "react-router-dom";

import PostForm from "../../components/PostForm";

const AddPostPage = ({ history }) => {
  const handleSubmit = async (event, title, body) => {
    event.preventDefault();
    const res = await fetch("/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: title,
        body: body,
      }),
    });
    const data = await res.json();
    console.log("Adding new post...", title, body);
    history.push("/");
  };

  return <PostForm handleSubmit={handleSubmit} isEditing={false} />;
};

export default withRouter(AddPostPage);
