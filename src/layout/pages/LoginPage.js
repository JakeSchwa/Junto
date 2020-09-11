import React from 'react';

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

function LoginPage() {
  const handleSubmit = async (event) => {
    event.preventDefault();
    event.stopPropagation();
    await fetch('/api/users', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: event.target.email.value,
        password: event.target.password.value,
      }),
    });
  };

  return (
    <div id='loginForm'>
      <h1 id='loginHeader'>Login</h1>
      <Form onSubmit={handleSubmit} noValidate>
        <Form.Group controlId='email'>
          <Form.Control type='email' placeholder='User Email' required />
          <Form.Text id='emailHelper' muted>
            Input User Email
          </Form.Text>
        </Form.Group>
        <Form.Group controlId='password'>
          <Form.Control type='password' placeholder='Password' />
          <Form.Text id='passwordHelper' muted>
            Input User Password
          </Form.Text>
        </Form.Group>
        <Button variant='primary' type='submit'>
          Submit
        </Button>
      </Form>
    </div>
  );
}

export default LoginPage;
