import React, { useState } from 'react';

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

function UserCreationPage() {
  const [validated, setValidated] = useState(false);
  const [firstNameHelper, setfirstNameHelper] = useState(
    'First Name must be between 2 and 50 characters long'
  );
  const [lastNameHelper, setLastNameHelper] = useState(
    'Last Name must be between 2 and 50 characters long'
  );
  const [emailHelper, setEmailHelper] = useState(
    'Email must be between 6 and 256 characters long'
  );
  const [passwordHelper, setPasswordHelper] = useState(
    'Password must be between 6 and 255 characters long'
  );
  const [passwordConfirmHelper, setPasswordConfirmHelper] = useState(
    'Must match password'
  );

  const handleSubmit = async (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (validateSubmit(event.target)) {
      console.log('made it');
      const res = await postUser(event);
      await res.json();
      setValidated(true);
    }
    setValidated(false);
  };

  async function postUser(event) {
    return await fetch('/api/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        firstName: event.target.firstName.value,
        lastName: event.target.lastName.value,
        email: event.target.email.value,
        password: event.target.password.value,
      }),
    });
  }

  const validateSubmit = (event) => {
    if (
      validateFirstName(event.firstName.value) &&
      validateLastName(event.lastName.value) &&
      validateEmail(event.email.value) &&
      validatePassword(event.password.value, event.password.value)
    )
      return true;
    else return false;
  };

  const validateFirstName = (name) => {
    if (name.length >= 2 && name.length <= 50) return true;
    else {
      if (name.length < 2)
        setfirstNameHelper('First Name must be longer than 1 character');
      if (name.legth > 50)
        setfirstNameHelper('First Name must be shorter than 50 character');
    }
    return false;
  };

  const validateLastName = (name) => {
    if (name.length >= 2 && name.length <= 50) return true;
    else {
      if (name.length < 2)
        setLastNameHelper('Last Name must be longer than 1 character');
      if (name.legth > 50)
        setLastNameHelper('Last Name must be shorter than 50 character');
    }
    return false;
  };

  const validateEmail = (email) => {
    if (email.length >= 6 && email.length <= 256) return true;
    else {
      if (email.length < 6)
        setEmailHelper('Email must be longer than 5 characters');
      if (email.length > 256)
        setEmailHelper('Email must be shorter than 257 characters');
    }
    return false;
  };

  const validatePassword = (password, confirmPassword) => {
    if (password.length < 6)
      setPasswordHelper('Password must be longer than 5 characters');
    if (password.length > 255)
      setPasswordHelper('Password must be less than 256 characters');
    if (password === confirmPassword) {
      if (password.length >= 5 && password.length <= 255) return true;
    } else {
      setPasswordConfirmHelper('Confirm Password does not match Password');
    }
    return false;
  };

  return (
    <Form validated={validated} onSubmit={handleSubmit}>
      <Form.Group controlId='firstName' placeholder='Enter First Name'>
        <Form.Label>First Name</Form.Label>
        <Form.Control type='input' placeholder='First Name' required />
        <Form.Text id='firstNameHelper' muted>
          {firstNameHelper}
        </Form.Text>
      </Form.Group>
      <Form.Group controlId='lastName' placeholder='Enter Last Name'>
        <Form.Label>Last Name</Form.Label>
        <Form.Control type='input' placeholder='Last Name' required />
        <Form.Text id='lastNameHelper' muted>
          {lastNameHelper}
        </Form.Text>
      </Form.Group>
      <Form.Group controlId='email' placeholder='Enter Email'>
        <Form.Label>Email</Form.Label>
        <Form.Control type='email' placeholder='Email' required />
        <Form.Text id='emailHelper' muted>
          {emailHelper}
        </Form.Text>
      </Form.Group>
      <Form.Group controlId='password'>
        <Form.Label>Password</Form.Label>
        <Form.Control type='password' placeholder='Password' />
        <Form.Text id='passwordHelper' muted>
          {passwordHelper}
        </Form.Text>
      </Form.Group>
      <Form.Group controlId='confirmPassword'>
        <Form.Label>Confirm Password</Form.Label>
        <Form.Control type='password' placeholder='Confirm Password' />
        <Form.Text id='passwordHelper' muted>
          {passwordConfirmHelper}
        </Form.Text>
      </Form.Group>
      <Button variant='primary' type='submit'>
        Submit
      </Button>
    </Form>
  );
}

export default UserCreationPage;
