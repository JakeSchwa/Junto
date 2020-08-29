import React, { useState } from 'react';

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

function UserCreationPage() {
  const [validated, setValidated] = useState(false);

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
      }),
    });
  }

  const validateSubmit = (event) => {
    if (
      validateName(event.firstName.value) &&
      validateName(event.lastName.value) &&
      validateEmail(event.email.value)
    )
      return true;
    else return false;
  };

  const validateName = (name) => {
    if (name.length >= 2 && name.length <= 50) return true;
    else return false;
  };

  const validateEmail = (email) => {
    if (email.length >= 6 && email.length <= 256) return true;
    else return false;
  };

  return (
    <div>
      <Form validated={validated} onSubmit={handleSubmit}>
        <Form.Group controlId='firstName' placeholder='Enter First Name'>
          <Form.Label>First Name</Form.Label>
          <Form.Control type='input' placeholder='First Name' required />
          <Form.Control.Feedback type='invalid'>
            Please provide a First Name.
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group controlId='lastName' placeholder='Enter Last Name'>
          <Form.Label>Last Name</Form.Label>
          <Form.Control type='input' placeholder='Last Name' required />
          <Form.Control.Feedback type='invalid'>
            Please provide a Last Name.
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group controlId='email' placeholder='Enter Email'>
          <Form.Label>Email</Form.Label>
          <Form.Control type='email' placeholder='Email' required />
          <Form.Control.Feedback type='invalid'>
            Please provide a Email.
          </Form.Control.Feedback>
        </Form.Group>
        <Button variant='primary' type='submit'>
          Submit
        </Button>
      </Form>
    </div>
  );
}

export default UserCreationPage;
