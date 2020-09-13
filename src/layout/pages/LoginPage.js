import React, { useState } from 'react';
import { useHistory, Link } from 'react-router-dom';
import { useUserDispatch } from '../../context/user-context';

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

function LoginPage() {
  const dispatch = useUserDispatch();
  const history = useHistory();

  const [errorText, setErrorText] = useState('');

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
      setErrorText('Invalid Email or Password');
    } else {
      const user = await res.json();
      dispatch({type: 'set', payload: user});
      history.push('/');
      setErrorText('');
    }
  };

  return (
    <div id='loginRegisterFormContainer'>
      <h1 id='loginRegisterFormHeader'>Login</h1>
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
      </Form>
      <div id="loginRegisterLink">
        <Link to="/newUser">New user?</Link>
      </div>
      <div id='loginRegisterErrorText'>{errorText}</div>
    </div>
  );
}

export default LoginPage;
