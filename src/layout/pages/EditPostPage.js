import React from "react";
import { withRouter } from "react-router-dom";

import PostForm from "../../components/PostForm";

const EditPostPage = ({ history, match: { params }, location: { state } }) => {
  const handleSubmit = async (event, title, body) => {
    event.preventDefault();
    const res = await fetch(`/posts/${params.postId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: title,
        body: body,
      }),
    });
    const data = await res.json();
    console.log("Editing post...", title, body);
    history.push("/");
  };

  return <PostForm handleSubmit={handleSubmit} isEditing={true} post={state.post} />;
};

export default withRouter(EditPostPage);
