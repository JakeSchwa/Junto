import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import FriendsListPage from '../../../layout/pages/FriendsListPage';

beforeEach(() => {
  global.fetch = jest.fn(() => Promise.resolve({ json: () => Promise.resolve([]) }));
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe('FriendsListPage', () => {
  it('renders the friends list container', async () => {
    const { container } = render(
      <MemoryRouter>
        <FriendsListPage />
      </MemoryRouter>
    );
    await waitFor(() => {
      expect(container.querySelector('#friendsList')).toBeInTheDocument();
    });
  });

  it('delegates to FriendsList which fetches users on mount', async () => {
    render(
      <MemoryRouter>
        <FriendsListPage />
      </MemoryRouter>
    );
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/users?id_ne=1');
    });
  });
});
