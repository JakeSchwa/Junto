import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import FriendsList from '../../components/FriendsList';

const mockUsers = [
  { id: 2, name: 'Alice Smith' },
  { id: 3, name: 'Bob Jones' },
];

function renderList() {
  return render(
    <MemoryRouter>
      <FriendsList />
    </MemoryRouter>
  );
}

beforeEach(() => {
  global.fetch = jest.fn(() =>
    Promise.resolve({ json: () => Promise.resolve(mockUsers) })
  );
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe('FriendsList — fetching', () => {
  it('fetches from /users?id_ne=1 on mount', async () => {
    renderList();
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/users?id_ne=1');
    });
  });

  it('only fetches once on mount (no re-fetch loop)', async () => {
    renderList();
    await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1));
  });
});

describe('FriendsList — rendering', () => {
  it('renders the #friendsList container', async () => {
    const { container } = renderList();
    await waitFor(() => {
      expect(container.querySelector('#friendsList')).toBeInTheDocument();
    });
  });

  it('renders a Friend item for every user returned', async () => {
    renderList();
    await waitFor(() => {
      expect(screen.getByText('Alice Smith')).toBeInTheDocument();
      expect(screen.getByText('Bob Jones')).toBeInTheDocument();
    });
  });

  it('renders links to each friend\'s page', async () => {
    renderList();
    await waitFor(() => {
      const links = screen.getAllByRole('link');
      const hrefs = links.map((l) => l.getAttribute('href'));
      expect(hrefs).toContain('/friend/2');
      expect(hrefs).toContain('/friend/3');
    });
  });

  it('renders an empty container when the API returns no users', async () => {
    global.fetch.mockResolvedValueOnce({ json: () => Promise.resolve([]) });
    const { container } = renderList();
    await waitFor(() => {
      expect(container.querySelector('#friendsList').children).toHaveLength(0);
    });
  });
});

describe('FriendsList — error handling', () => {
  it('logs an error and renders an empty list when fetch rejects', async () => {
    const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    global.fetch.mockRejectedValueOnce(new Error('Network failure'));
    const { container } = renderList();
    await waitFor(() => expect(logSpy).toHaveBeenCalled());
    expect(container.querySelector('#friendsList').children).toHaveLength(0);
    logSpy.mockRestore();
  });
});
