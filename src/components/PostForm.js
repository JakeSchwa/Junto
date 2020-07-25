import React, { useState } from "react";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

const PostForm = ({ handleSubmit, isEditing, post }) => {
  const [title, setTitle] = useState(post ? post.title : "");
  const [body, setBody] = useState(post ? post.body : "");

  const handleChangeTitle = (event) => {
    setTitle(event.target.value);
  };

  const handleChangeBody = (event) => {
    setBody(event.target.value);
  };

  const handleFormSubmit = (event) => {
    handleSubmit(event, title, body);
  };

  return (
    <div>
      <Form onSubmit={handleFormSubmit}>
        <br />
        <Form.Group controlId='formBasicEmail'>
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
        {isEditing ? (
          <Button variant='success' type='submit'>
            Save
          </Button>
        ) : (
          <Button variant='primary' type='submit'>
            Submit
          </Button>
        )}
      </Form>
    </div>
  );
};

export default PostForm;
