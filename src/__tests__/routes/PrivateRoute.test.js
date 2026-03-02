import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import PrivateRoute from '../../routes/PrivateRoute';
import { UserProvider } from '../../context/user-context';

function renderRoute(user = null) {
  if (user) {
    localStorage.setItem('user', JSON.stringify(user));
  } else {
    localStorage.removeItem('user');
  }
  return render(
    <MemoryRouter initialEntries={['/protected']}>
      <UserProvider>
        <Routes>
          <Route
            path="/protected"
            element={
              <PrivateRoute>
                <div>Protected Content</div>
              </PrivateRoute>
            }
          />
          <Route path="/login" element={<div>Login Page</div>} />
        </Routes>
      </UserProvider>
    </MemoryRouter>
  );
}

beforeEach(() => {
  localStorage.clear();
});

describe('PrivateRoute', () => {
  it('renders children when the user is logged in', () => {
    renderRoute({ _id: 'u1', isLoggedIn: true });
    expect(screen.getByText('Protected Content')).toBeInTheDocument();
    expect(screen.queryByText('Login Page')).not.toBeInTheDocument();
  });

  it('redirects to /login when there is no authenticated user', () => {
    renderRoute();
    expect(screen.getByText('Login Page')).toBeInTheDocument();
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });

  it('redirects to /login when isLoggedIn is explicitly false', () => {
    renderRoute({ _id: 'u1', isLoggedIn: false });
    expect(screen.getByText('Login Page')).toBeInTheDocument();
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });
});
