import React, { useState } from 'react';
import { withRouter } from 'react-router-dom';

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useUserState } from '../../context/user-context';

const AddPostPage = ({ history }) => {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const { user } = useUserState();

  const handleChangeTitle = (event) => {
    setTitle(event.target.value);
  };

  const handleChangeBody = (event) => {
    setBody(event.target.value);
  };

  const submitPostDisabled = () => {
    if (title === '' || body === '') {
      return true;
    } else {
      return false;
    }
  };

  const handleAddPost = async (event) => {
    event.preventDefault();
    const res = await fetch('/api/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: title,
        body: body,
        userId: user._id,
      }),
    });
    await res.json();
    history.push('/');
  };

  return (
    <div>
      <Form onSubmit={handleAddPost}>
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
        <Button variant='primary' type='submit' disabled={submitPostDisabled()}>
          Submit
        </Button>
      </Form>
    </div>
  );
};

export default withRouter(AddPostPage);
