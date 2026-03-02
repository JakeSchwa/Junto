import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import PostList from '../../components/PostList';

const mockPosts = [
  { _id: 'p1', title: 'First Post', body: 'Body one', userId: 'u1' },
  { _id: 'p2', title: 'Second Post', body: 'Body two', userId: 'u1' },
];

function renderList(props = {}) {
  return render(
    <MemoryRouter>
      <PostList userId="u1" self={true} {...props} />
    </MemoryRouter>
  );
}

beforeEach(() => {
  global.fetch = jest.fn(() =>
    Promise.resolve({ json: () => Promise.resolve(mockPosts) })
  );
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe('PostList — fetching', () => {
  it('fetches posts for the given userId on mount', async () => {
    renderList({ userId: 'u1' });
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('api/posts/u1');
    });
  });

  it('re-fetches when userId prop changes', async () => {
    const { rerender } = renderList({ userId: 'u1' });
    await waitFor(() => expect(global.fetch).toHaveBeenCalledWith('api/posts/u1'));

    rerender(
      <MemoryRouter>
        <PostList userId="u2" self={true} />
      </MemoryRouter>
    );
    await waitFor(() => expect(global.fetch).toHaveBeenCalledWith('api/posts/u2'));
  });
});

describe('PostList — rendering', () => {
  it('renders the #postList container', async () => {
    const { container } = renderList();
    await waitFor(() => {
      expect(container.querySelector('#postList')).toBeInTheDocument();
    });
  });

  it('renders a Post card for every post returned by the API', async () => {
    renderList();
    await waitFor(() => {
      expect(screen.getByText('First Post')).toBeInTheDocument();
      expect(screen.getByText('Second Post')).toBeInTheDocument();
    });
  });

  it('renders an empty container when the API returns no posts', async () => {
    global.fetch.mockResolvedValueOnce({ json: () => Promise.resolve([]) });
    const { container } = renderList();
    await waitFor(() => {
      expect(container.querySelector('#postList').children).toHaveLength(0);
    });
  });

  it('passes self=true down so edit icons are shown', async () => {
    renderList({ self: true });
    await waitFor(() => {
      const svgs = document.querySelectorAll('svg');
      svgs.forEach((svg) => expect(svg).not.toHaveAttribute('hidden'));
    });
  });

  it('passes self=false down so edit icons are hidden', async () => {
    renderList({ self: false });
    await waitFor(() => {
      const svgs = document.querySelectorAll('svg');
      svgs.forEach((svg) => expect(svg).toHaveAttribute('hidden'));
    });
  });
});

describe('PostList — error handling', () => {
  it('logs an error and renders an empty list when fetch rejects', async () => {
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    global.fetch.mockRejectedValueOnce(new Error('Network failure'));

    const { container } = renderList();
    await waitFor(() => {
      expect(errorSpy).toHaveBeenCalled();
    });
    expect(container.querySelector('#postList').children).toHaveLength(0);
    errorSpy.mockRestore();
    logSpy.mockRestore();
  });
});
