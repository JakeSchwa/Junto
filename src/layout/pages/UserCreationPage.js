import React, { useState } from 'react';

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

function UserCreationPage() {
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

  const [firstNameValid, setFirstNameValid] = useState(true);
  const [lastNameValid, setLastNameValid] = useState(true);
  const [emailValid, setEmailValid] = useState(true);
  const [passwordValid, setPasswordValid] = useState(true);
  const [passwordConfNameValid, setPasswordConfValid] = useState(true);

  const handleSubmit = async (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (validateSubmit(event.target)) {
      const res = await postUser(event);
      res.json();
    }
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
    })
      .then((response) => {
        if (response.status === 400) {
          setEmailHelper('Email is already in use. Use a diffrent email.');
          setPasswordValid(false);
        }
      })
      .catch((error) => {
        console.log(error.message);
      });
  }

  const validateSubmit = (event) => {
    if (
      validateFirstName(event.firstName.value) &&
      validateLastName(event.lastName.value) &&
      validateEmail(event.email.value) &&
      validatePassword(event.password.value, event.confirmPassword.value)
    )
      return true;
    else return false;
  };

  const validateFirstName = (name) => {
    if (name.length >= 2 && name.length <= 50) {
      setFirstNameValid(true);
      return true;
    } else {
      setFirstNameValid(false);
      if (name.length < 2)
        setfirstNameHelper('First Name must be longer than 1 character');
      if (name.legth > 50)
        setfirstNameHelper('First Name must be shorter than 50 character');
    }
    return false;
  };

  const validateLastName = (name) => {
    if (name.length >= 2 && name.length <= 50) {
      setLastNameValid(true);
      return true;
    } else {
      setLastNameValid(false);
      if (name.length < 2)
        setLastNameHelper('Last Name must be longer than 1 character');
      if (name.legth > 50)
        setLastNameHelper('Last Name must be shorter than 50 character');
    }
    return false;
  };

  const validateEmail = (email) => {
    if (email.length >= 6 && email.length <= 256) {
      setEmailHelper(true);
      return true;
    } else {
      if (email.length < 6)
        setEmailHelper('Email must be longer than 5 characters');
      if (email.length > 256)
        setEmailHelper('Email must be shorter than 257 characters');
    }
    setEmailValid(false);
    return false;
  };

  const validatePassword = (password, confirmPassword) => {
    if (password.length < 6)
      setPasswordHelper('Password must be longer than 5 characters');
    if (password.length > 255)
      setPasswordHelper('Password must be less than 256 characters');
    if (password === confirmPassword) {
      if (password.length >= 5 && password.length <= 255) {
        setPasswordValid(true);
        setPasswordConfValid(true);
        return true;
      }
    } else {
      setPasswordConfValid(false);
      setPasswordConfirmHelper('Confirm Password does not match Password');
    }
    setPasswordValid(false);
    return false;
  };

  return (
    <div id='createUserForm'>
      <h1 id='createUserHeader'>Create User</h1>
      <Form onSubmit={handleSubmit} noValidate>
        <Form.Group controlId='firstName' placeholder='Enter First Name'>
          <Form.Control type='input' placeholder='First Name' required />
          <Form.Text
            id='firstNameValid'
            className={firstNameValid ? 'valid' : 'invalid'}
            muted
          >
            {firstNameHelper}
          </Form.Text>
        </Form.Group>
        <Form.Group controlId='lastName' placeholder='Enter Last Name'>
          <Form.Control type='input' placeholder='Last Name' required />
          <Form.Text
            id='lastNameHelper'
            className={lastNameValid ? 'valid' : 'invalid'}
            muted
          >
            {lastNameHelper}
          </Form.Text>
        </Form.Group>
        <Form.Group controlId='email' placeholder='Enter Email'>
          <Form.Control type='email' placeholder='Email' required />
          <Form.Text
            id='emailHelper'
            className={emailValid ? 'valid' : 'invalid'}
            muted
          >
            {emailHelper}
          </Form.Text>
        </Form.Group>
        <Form.Group controlId='password'>
          <Form.Control type='password' placeholder='Password' />
          <Form.Text
            id='passwordHelper'
            className={passwordValid ? 'valid' : 'invalid'}
            muted
          >
            {passwordHelper}
          </Form.Text>
        </Form.Group>
        <Form.Group controlId='confirmPassword'>
          <Form.Control type='password' placeholder='Confirm Password' />
          <Form.Text
            id='passwordHelper'
            className={passwordConfNameValid ? 'valid' : 'invalid'}
            muted
          >
            {passwordConfirmHelper}
          </Form.Text>
        </Form.Group>
        <Button variant='primary' type='submit'>
          Submit
        </Button>
      </Form>
    </div>
  );
}

export default UserCreationPage;
