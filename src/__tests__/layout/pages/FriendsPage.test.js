import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import FriendsPage from '../../../layout/pages/FriendsPage';

beforeEach(() => {
  global.fetch = jest.fn(() => Promise.resolve({ json: () => Promise.resolve([]) }));
});

afterEach(() => {
  jest.restoreAllMocks();
});

function renderPage(userId = 'friend42') {
  return render(
    <MemoryRouter initialEntries={[`/friends/${userId}`]}>
      <Routes>
        <Route path="/friends/:userId" element={<FriendsPage />} />
      </Routes>
    </MemoryRouter>
  );
}

describe('FriendsPage', () => {
  it('renders the post list container', async () => {
    const { container } = renderPage();
    await waitFor(() => {
      expect(container.querySelector('#postList')).toBeInTheDocument();
    });
  });

  it('fetches posts for the userId in the URL param', async () => {
    renderPage('friend42');
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('api/posts/friend42');
    });
  });

  it('fetches posts for a different userId when the param changes', async () => {
    renderPage('abc123');
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('api/posts/abc123');
    });
  });

  it('does not show edit controls (self=false)', async () => {
    const posts = [{ _id: 'p1', title: 'Post', body: 'Body', userId: 'friend42' }];
    global.fetch.mockResolvedValueOnce({ json: () => Promise.resolve(posts) });
    const { container } = renderPage('friend42');
    await waitFor(() => {
      const icon = container.querySelector('svg');
      // hidden prop set to true when self=false
      expect(icon).toHaveAttribute('hidden');
    });
  });
});
