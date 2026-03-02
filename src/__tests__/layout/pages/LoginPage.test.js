import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import LoginPage from '../../../layout/pages/LoginPage';
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
        <LoginPage />
      </UserProvider>
    </MemoryRouter>
  );
}

// Workaround: JSDOM v16 (bundled with react-scripts 5 / jest 27) does not update the
// form.elements collection when name attributes are set dynamically, so form['email']
// returns undefined. Assigning the elements as own properties on the form element lets
// the handler's event.target.email / event.target.password lookups succeed.
function submitForm() {
  const form = screen.getByRole('button', { name: /submit/i }).closest('form');
  Object.assign(form, {
    email: screen.getByPlaceholderText('User Email'),
    password: screen.getByPlaceholderText('Password'),
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

describe('LoginPage — rendering', () => {
  it('renders the Login heading', () => {
    renderPage();
    expect(screen.getByRole('heading', { name: /login/i })).toBeInTheDocument();
  });

  it('renders the email input', () => {
    renderPage();
    expect(screen.getByPlaceholderText('User Email')).toBeInTheDocument();
  });

  it('renders the password input', () => {
    renderPage();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
  });

  it('renders the Submit button', () => {
    renderPage();
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
  });

  it('shows a link to the register page', () => {
    renderPage();
    const link = screen.getByText('New user?').closest('a');
    expect(link).toHaveAttribute('href', '/register');
  });
});

describe('LoginPage — successful login', () => {
  const serverUser = { _id: 'u1', firstName: 'Jane', lastName: 'Doe', email: 'jane@x.com' };

  beforeEach(() => {
    global.fetch = jest.fn(() =>
      Promise.resolve({ status: 200, json: () => Promise.resolve(serverUser) })
    );
  });

  it('posts credentials to /api/auth with email and password', async () => {
    renderPage();
    fireEvent.change(screen.getByPlaceholderText('User Email'), {
      target: { value: 'jane@x.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'secret' } });
    submitForm();
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/auth',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ email: 'jane@x.com', password: 'secret' }),
        })
      );
    });
  });

  it('navigates to / on success', async () => {
    renderPage();
    submitForm();
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });

  it('stores the user in localStorage with isLoggedIn=true on success', async () => {
    renderPage();
    submitForm();
    await waitFor(() => {
      const stored = JSON.parse(localStorage.getItem('user'));
      expect(stored.isLoggedIn).toBe(true);
      expect(stored._id).toBe('u1');
    });
  });
});

describe('LoginPage — failed login', () => {
  beforeEach(() => {
    global.fetch = jest.fn(() => Promise.resolve({ status: 401 }));
  });

  it('shows "Invalid Email or Password" on a non-200 response', async () => {
    renderPage();
    submitForm();
    await waitFor(() => {
      expect(screen.getByText('Invalid Email or Password')).toBeInTheDocument();
    });
  });

  it('does not navigate on failure', async () => {
    renderPage();
    submitForm();
    await waitFor(() => expect(global.fetch).toHaveBeenCalled());
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('clears the error message after a subsequent successful login', async () => {
    const serverUser = { _id: 'u1', firstName: 'Jane', lastName: 'Doe', email: 'jane@x.com' };
    global.fetch
      .mockResolvedValueOnce({ status: 401 })
      .mockResolvedValueOnce({ status: 200, json: () => Promise.resolve(serverUser) });

    renderPage();
    submitForm();
    await waitFor(() => expect(screen.getByText('Invalid Email or Password')).toBeInTheDocument());

    submitForm();
    await waitFor(() =>
      expect(screen.queryByText('Invalid Email or Password')).not.toBeInTheDocument()
    );
  });
});
