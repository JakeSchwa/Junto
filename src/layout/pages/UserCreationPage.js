import React, { useState } from 'react';
import { useHistory, Link } from "react-router-dom";
import { useUserDispatch } from '../../context/user-context';

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

function UserCreationPage() {
  const dispatch = useUserDispatch();
  const history = useHistory();

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

  const [firstNameValid, setFirstNameValid] = useState('valid');
  const [lastNameValid, setLastNameValid] = useState('valid');
  const [emailValid, setEmailValid] = useState('valid');
  const [passwordValid, setPasswordValid] = useState('valid');
  const [passwordConfNameValid, setPasswordConfValid] = useState('valid');
  const [errorText, setErrorText] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (validateSubmit(event.target)) {
      try {
        const res = await postUser(event);
        if (res.status === 400) {
          setEmailValid('invalid');
          setEmailHelper('Email is already in use. Use a diffrent email.');
        } else if (res.status === 200) {
          const user = await res.json();
          dispatch({type: 'set', payload: user});
          history.push("/");
        } else throw new Error('There was a network error on submitting new user.')
      } catch (error) {
        setErrorText("Could not create new user. Please try again.")
        console.log(error);
      }
    }
  };

  const postUser = (event) => {
    return fetch('/api/users', {
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
      setFirstNameValid('valid');
      return true;
    } else {
      setFirstNameValid('invalid');
      if (name.length < 2)
        setfirstNameHelper('First Name must be longer than 1 character');
      if (name.legth > 50)
        setfirstNameHelper('First Name must be shorter than 50 character');
    }
    return false;
  };

  const validateLastName = (name) => {
    if (name.length >= 2 && name.length <= 50) {
      setLastNameValid('valid');
      return true;
    } else {
      setLastNameValid('invalid');
      if (name.length < 2)
        setLastNameHelper('Last Name must be longer than 1 character');
      if (name.legth > 50)
        setLastNameHelper('Last Name must be shorter than 50 character');
    }
    return false;
  };

  const validateEmail = (email) => {
    if (email.length >= 6 && email.length <= 256) {
      setEmailValid('valid');
      return true;
    } else {
      if (email.length < 6)
        setEmailHelper('Email must be longer than 5 characters');
      if (email.length > 256)
        setEmailHelper('Email must be shorter than 257 characters');
    }
    setEmailValid('invalid');
    return false;
  };

  const validatePassword = (password, confirmPassword) => {
    if (password.length < 6) {
      setPasswordValid('invalid');
      setPasswordHelper('Password must be longer than 5 characters');
    } else if (password.length > 255) {
      setPasswordValid('invalid');
      setPasswordHelper('Password must be less than 256 characters');
    } else {
      if (password === confirmPassword) {
        setPasswordValid('valid');
        setPasswordConfValid('valid');
        return true;
      } else {
        setPasswordValid('valid');
        setPasswordConfValid('invalid');
        setPasswordConfirmHelper('Confirm Password does not match Password');
      }
    }
    return false;
  };

  return (
    <div id='loginRegisterFormContainer'>
      <h1 id='loginRegisterFormHeader'>Create User</h1>
      <Form onSubmit={handleSubmit} noValidate>
        <Form.Group controlId='firstName'>
          <Form.Control type='input' placeholder='First Name' required />
          <Form.Text id='firstNameValid' className={firstNameValid} muted>
            {firstNameHelper}
          </Form.Text>
        </Form.Group>
        <Form.Group controlId='lastName'>
          <Form.Control type='input' placeholder='Last Name' required />
          <Form.Text id='lastNameHelper' className={lastNameValid} muted>
            {lastNameHelper}
          </Form.Text>
        </Form.Group>
        <Form.Group controlId='email'>
          <Form.Control type='email' placeholder='Email' required />
          <Form.Text id='emailHelper' className={emailValid} muted>
            {emailHelper}
          </Form.Text>
        </Form.Group>
        <Form.Group controlId='password'>
          <Form.Control type='password' placeholder='Password' />
          <Form.Text id='passwordHelper' className={passwordValid} muted>
            {passwordHelper}
          </Form.Text>
        </Form.Group>
        <Form.Group controlId='confirmPassword'>
          <Form.Control type='password' placeholder='Confirm Password' />
          <Form.Text
            id='passwordHelper'
            className={passwordConfNameValid}
            muted
          >
            {passwordConfirmHelper}
          </Form.Text>
        </Form.Group>
        <Button variant='primary' type='submit'>
          Submit
        </Button>
      </Form>
      <div id="loginRegisterLink">
        <Link to="/login">Already a user?</Link>
      </div>
      <div id='loginRegisterErrorText'>{errorText}</div>
    </div>
  );
}

export default UserCreationPage;
