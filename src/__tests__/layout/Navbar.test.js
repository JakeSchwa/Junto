import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import TopNavbar from '../../layout/Navbar';
import { UserProvider } from '../../context/user-context';

// Mock useNavigate so we can assert navigation without a full router stack
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

import { useNavigate } from 'react-router-dom';

const mockNavigate = jest.fn();
const loggedInUser = {
  _id: 'u1',
  firstName: 'Jane',
  lastName: 'Doe',
  email: 'jane@x.com',
  isLoggedIn: true,
};

function renderNavbar(user = null) {
  if (user) {
    localStorage.setItem('user', JSON.stringify(user));
  } else {
    localStorage.removeItem('user');
  }
  return render(
    <MemoryRouter>
      <UserProvider>
        <TopNavbar />
      </UserProvider>
    </MemoryRouter>
  );
}

beforeEach(() => {
  localStorage.clear();
  mockNavigate.mockClear();
  useNavigate.mockReturnValue(mockNavigate);
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe('TopNavbar — unauthenticated', () => {
  it('always renders the Junto brand', () => {
    renderNavbar();
    expect(screen.getByText('Junto')).toBeInTheDocument();
  });

  it('does not show the Friends link', () => {
    renderNavbar();
    expect(screen.queryByText('Friends')).not.toBeInTheDocument();
  });

  it('does not show the Post link', () => {
    renderNavbar();
    expect(screen.queryByText('Post')).not.toBeInTheDocument();
  });

  it('does not show the Logout button', () => {
    renderNavbar();
    expect(screen.queryByRole('button', { name: /logout/i })).not.toBeInTheDocument();
  });
});

describe('TopNavbar — authenticated', () => {
  it('displays the logged-in user full name', () => {
    renderNavbar(loggedInUser);
    expect(screen.getByText('Jane Doe')).toBeInTheDocument();
  });

  it('shows the Friends navigation link', () => {
    renderNavbar(loggedInUser);
    expect(screen.getByText('Friends')).toBeInTheDocument();
  });

  it('shows the Post navigation link', () => {
    renderNavbar(loggedInUser);
    expect(screen.getByText('Post')).toBeInTheDocument();
  });

  it('shows the Logout button', () => {
    renderNavbar(loggedInUser);
    expect(screen.getByRole('button', { name: /logout/i })).toBeInTheDocument();
  });
});

describe('TopNavbar — logout', () => {
  it('calls POST api/auth/logout when Logout is clicked', async () => {
    global.fetch = jest.fn(() => Promise.resolve({ status: 200 }));
    renderNavbar(loggedInUser);
    fireEvent.click(screen.getByRole('button', { name: /logout/i }));
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('api/auth/logout', { method: 'POST' });
    });
  });

  it('navigates to /login after a successful logout', async () => {
    global.fetch = jest.fn(() => Promise.resolve({ status: 200 }));
    renderNavbar(loggedInUser);
    fireEvent.click(screen.getByRole('button', { name: /logout/i }));
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/login');
    });
  });

  it('clears user from localStorage after a successful logout', async () => {
    global.fetch = jest.fn(() => Promise.resolve({ status: 200 }));
    renderNavbar(loggedInUser);
    fireEvent.click(screen.getByRole('button', { name: /logout/i }));
    await waitFor(() => {
      expect(localStorage.getItem('user')).toBeNull();
    });
  });

  it('does not navigate when the server returns a non-200 status', async () => {
    global.fetch = jest.fn(() => Promise.resolve({ status: 500 }));
    renderNavbar(loggedInUser);
    fireEvent.click(screen.getByRole('button', { name: /logout/i }));
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
    });
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});
