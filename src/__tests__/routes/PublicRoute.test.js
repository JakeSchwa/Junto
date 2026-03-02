import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import PublicRoute from '../../routes/PublicRoute';
import { UserProvider } from '../../context/user-context';

function renderRoute({ user = null, restricted = false } = {}) {
  if (user) {
    localStorage.setItem('user', JSON.stringify(user));
  } else {
    localStorage.removeItem('user');
  }
  return render(
    <MemoryRouter initialEntries={['/public']}>
      <UserProvider>
        <Routes>
          <Route
            path="/public"
            element={
              <PublicRoute restricted={restricted}>
                <div>Public Content</div>
              </PublicRoute>
            }
          />
          <Route path="/" element={<div>Home Page</div>} />
        </Routes>
      </UserProvider>
    </MemoryRouter>
  );
}

const loggedInUser = { _id: 'u1', isLoggedIn: true };

beforeEach(() => {
  localStorage.clear();
});

describe('PublicRoute', () => {
  it('renders children when user is not logged in and route is restricted', () => {
    renderRoute({ restricted: true });
    expect(screen.getByText('Public Content')).toBeInTheDocument();
    expect(screen.queryByText('Home Page')).not.toBeInTheDocument();
  });

  it('renders children when user is not logged in and route is unrestricted', () => {
    renderRoute({ restricted: false });
    expect(screen.getByText('Public Content')).toBeInTheDocument();
  });

  it('redirects to / when user is logged in and route is restricted', () => {
    renderRoute({ user: loggedInUser, restricted: true });
    expect(screen.getByText('Home Page')).toBeInTheDocument();
    expect(screen.queryByText('Public Content')).not.toBeInTheDocument();
  });

  it('renders children when user is logged in but route is unrestricted', () => {
    renderRoute({ user: loggedInUser, restricted: false });
    expect(screen.getByText('Public Content')).toBeInTheDocument();
    expect(screen.queryByText('Home Page')).not.toBeInTheDocument();
  });
});
