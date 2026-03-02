import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import HomePage from '../../../layout/pages/HomePage';
import { UserProvider } from '../../../context/user-context';

const currentUser = { _id: 'user123', firstName: 'Jane', isLoggedIn: true };

beforeEach(() => {
  localStorage.setItem('user', JSON.stringify(currentUser));
  global.fetch = jest.fn(() => Promise.resolve({ json: () => Promise.resolve([]) }));
});

afterEach(() => {
  localStorage.clear();
  jest.restoreAllMocks();
});

function renderPage() {
  return render(
    <MemoryRouter>
      <UserProvider>
        <HomePage />
      </UserProvider>
    </MemoryRouter>
  );
}

describe('HomePage', () => {
  it('renders the post list container', async () => {
    const { container } = renderPage();
    await waitFor(() => {
      expect(container.querySelector('#postList')).toBeInTheDocument();
    });
  });

  it('fetches posts for the currently logged-in user', async () => {
    renderPage();
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('api/posts/user123');
    });
  });

  it('passes self=true to PostList so edit controls are visible', async () => {
    const posts = [{ _id: 'p1', title: 'My Post', body: 'Body', userId: 'user123' }];
    global.fetch.mockResolvedValueOnce({ json: () => Promise.resolve(posts) });
    const { container } = renderPage();
    await waitFor(() => {
      // The edit icon link is rendered (self=true means hidden=false on the icon)
      const editLinks = container.querySelectorAll('.editPostBtn');
      expect(editLinks.length).toBe(1);
    });
  });
});
