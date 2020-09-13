import React, { useState } from 'react';

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useHistory } from 'react-router-dom';
import { useUserDispatch } from '../../context/user-context';

function LoginPage() {
  const dispatch = useUserDispatch();
  const history = useHistory();

  const [helperText, setHelperText] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    event.stopPropagation();
    const res = await fetch('/api/auth', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: event.target.email.value,
        password: event.target.password.value,
      }),
    });
    if (res.status !== 200) {
      setHelperText('Invalid Email or Password');
    } else {
      const user = await res.json();
      dispatch({type: 'set', payload: user})
      history.push('/');
      setHelperText('');
    }
  };

  return (
    <div id='loginForm'>
      <h1 id='loginHeader'>Login</h1>
      <Form onSubmit={handleSubmit}>
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
        <div id='loginHellerText'>{helperText}</div>
      </Form>
    </div>
  );
}

export default LoginPage;
