import React, { useState } from "react";
import { withRouter } from "react-router-dom";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

const EditPostPage = ({ history, match: { params }, location: { state } }) => {
  const [title, setTitle] = useState(state.post ? state.post.title : "");
  const [body, setBody] = useState(state.post ? state.post.body : "");

  const handleChangeTitle = (event) => {
    setTitle(event.target.value);
  };

  const handleChangeBody = (event) => {
    setBody(event.target.value);
  };

  const submitEditDisabled = () => {
    if(title === "" || body === "") {
      return true
    } else {
      return false
    }
  }

  const handleEditPost = async (event) => {
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
    await res.json();
    history.push("/");
  };

  const handleDeletePost = async (event) => {
    event.preventDefault();
    const res = await fetch(`/posts/${params.postId}`, {
      method: "DELETE",
    });
    await res.json();
    history.push("/");
  };

  return (
    <div>
      <Form onSubmit={handleEditPost}>
        <br />
        <Form.Group controlId='formBasicPost'>
          <Form.Control
            size='lg'
            type='text'
            placeholder='Title'
            value={title}
            onChange={handleChangeTitle}
          />
          <br />
          <Form.Control
            as='textarea'
            placeholder='Body'
            value={body}
            onChange={handleChangeBody}
          />
        </Form.Group>
        <div id="editFormBtns">
          <Button variant='success' type='submit' disabled={submitEditDisabled()}>
            Save
          </Button>
          <Button variant='outline-danger' onClick={handleDeletePost}>
            Delete
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default withRouter(EditPostPage);
