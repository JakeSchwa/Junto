import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import UserCreationPage from '../../../layout/pages/UserCreationPage';
import { UserProvider } from '../../../context/user-context';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

import { useNavigate } from 'react-router-dom';

const mockNavigate = jest.fn();

function renderPage() {
  localStorage.clear();
  return render(
    <MemoryRouter>
      <UserProvider>
        <UserCreationPage />
      </UserProvider>
    </MemoryRouter>
  );
}

// Fill every field; callers can override individual values to trigger validation errors.
function fillForm({
  firstName = 'Jane',
  lastName = 'Doe',
  email = 'jane@example.com',
  password = 'password',
  confirmPassword = 'password',
} = {}) {
  fireEvent.change(screen.getByPlaceholderText('First Name'), { target: { value: firstName } });
  fireEvent.change(screen.getByPlaceholderText('Last Name'), { target: { value: lastName } });
  fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: email } });
  fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: password } });
  fireEvent.change(screen.getByPlaceholderText('Confirm Password'), {
    target: { value: confirmPassword },
  });
}

// Workaround: JSDOM v16 (bundled with react-scripts 5 / jest 27) does not update the
// form.elements collection when name attributes are set dynamically. Assigning the
// input elements as own properties on the form lets the handler's event.target.fieldName
// lookups succeed without modifying the production source code.
function submit() {
  const form = screen.getByRole('button', { name: /submit/i }).closest('form');
  Object.assign(form, {
    firstName: screen.getByPlaceholderText('First Name'),
    lastName: screen.getByPlaceholderText('Last Name'),
    email: screen.getByPlaceholderText('Email'),
    password: screen.getByPlaceholderText('Password'),
    confirmPassword: screen.getByPlaceholderText('Confirm Password'),
  });
  fireEvent.submit(form);
}

beforeEach(() => {
  localStorage.clear();
  mockNavigate.mockClear();
  useNavigate.mockReturnValue(mockNavigate);
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe('UserCreationPage — rendering', () => {
  it('renders the Create User heading', () => {
    renderPage();
    expect(screen.getByRole('heading', { name: /create user/i })).toBeInTheDocument();
  });

  it('renders all five form fields', () => {
    renderPage();
    expect(screen.getByPlaceholderText('First Name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Last Name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Confirm Password')).toBeInTheDocument();
  });

  it('shows a link back to the login page', () => {
    renderPage();
    expect(screen.getByText('Already a user?').closest('a')).toHaveAttribute('href', '/login');
  });
});

describe('UserCreationPage — validation', () => {
  it('shows an error when first name is too short (< 2 chars)', async () => {
    renderPage();
    fillForm({ firstName: 'J' });
    submit();
    await waitFor(() => {
      expect(screen.getByText('First Name must be longer than 1 character')).toBeInTheDocument();
    });
  });

  it('shows an error when last name is too short (< 2 chars)', async () => {
    renderPage();
    fillForm({ lastName: 'D' });
    submit();
    await waitFor(() => {
      expect(screen.getByText('Last Name must be longer than 1 character')).toBeInTheDocument();
    });
  });

  it('shows an error when email is too short (< 6 chars)', async () => {
    renderPage();
    fillForm({ email: 'a@b' }); // 3 chars
    submit();
    await waitFor(() => {
      expect(screen.getByText('Email must be longer than 5 characters')).toBeInTheDocument();
    });
  });

  it('shows an error when password is too short (< 6 chars)', async () => {
    renderPage();
    fillForm({ password: 'abc', confirmPassword: 'abc' });
    submit();
    await waitFor(() => {
      expect(screen.getByText('Password must be longer than 5 characters')).toBeInTheDocument();
    });
  });

  it('shows an error when password is too long (> 255 chars)', async () => {
    renderPage();
    const longPassword = 'a'.repeat(256);
    fillForm({ password: longPassword, confirmPassword: longPassword });
    submit();
    await waitFor(() => {
      expect(screen.getByText('Password must be less than 256 characters')).toBeInTheDocument();
    });
  });

  it('shows an error when confirm password does not match', async () => {
    renderPage();
    fillForm({ password: 'password1', confirmPassword: 'password2' });
    submit();
    await waitFor(() => {
      expect(screen.getByText('Confirm Password does not match Password')).toBeInTheDocument();
    });
  });

  it('does not submit when validation fails', async () => {
    global.fetch = jest.fn();
    renderPage();
    fillForm({ firstName: 'J' }); // invalid
    submit();
    await waitFor(() =>
      expect(screen.getByText('First Name must be longer than 1 character')).toBeInTheDocument()
    );
    expect(global.fetch).not.toHaveBeenCalled();
  });
});

describe('UserCreationPage — successful registration', () => {
  const serverUser = { _id: 'u1', firstName: 'Jane', lastName: 'Doe', email: 'jane@example.com' };

  beforeEach(() => {
    global.fetch = jest.fn(() =>
      Promise.resolve({ status: 200, json: () => Promise.resolve(serverUser) })
    );
  });

  it('posts user data to /api/users', async () => {
    renderPage();
    fillForm();
    submit();
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/users',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({
            firstName: 'Jane',
            lastName: 'Doe',
            email: 'jane@example.com',
            password: 'password',
          }),
        })
      );
    });
  });

  it('navigates to / on success', async () => {
    renderPage();
    fillForm();
    submit();
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });

  it('stores the user in context/localStorage on success', async () => {
    renderPage();
    fillForm();
    submit();
    await waitFor(() => {
      const stored = JSON.parse(localStorage.getItem('user'));
      expect(stored._id).toBe('u1');
    });
  });
});

describe('UserCreationPage — server errors', () => {
  it('shows "email already in use" message on status 400', async () => {
    global.fetch = jest.fn(() => Promise.resolve({ status: 400 }));
    renderPage();
    fillForm();
    submit();
    await waitFor(() => {
      // Matches the exact (typo-inclusive) string from the source
      expect(
        screen.getByText('Email is already in use. Use a diffrent email.')
      ).toBeInTheDocument();
    });
  });

  it('shows a generic error message on network failure', async () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    global.fetch = jest.fn(() => Promise.reject(new Error('Network Error')));
    renderPage();
    fillForm();
    submit();
    await waitFor(() => {
      expect(
        screen.getByText('Could not create new user. Please try again.')
      ).toBeInTheDocument();
    });
    consoleSpy.mockRestore();
  });

  it('shows a generic error on an unexpected status code', async () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    global.fetch = jest.fn(() =>
      Promise.resolve({
        status: 500,
        json: () => { throw new Error('There was a network error on submitting new user.'); },
      })
    );
    renderPage();
    fillForm();
    submit();
    await waitFor(() => {
      expect(
        screen.getByText('Could not create new user. Please try again.')
      ).toBeInTheDocument();
    });
    consoleSpy.mockRestore();
  });
});
