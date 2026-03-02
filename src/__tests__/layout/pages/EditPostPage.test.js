import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import EditPostPage from '../../../layout/pages/EditPostPage';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

import { useNavigate } from 'react-router-dom';

const mockNavigate = jest.fn();
const mockPost = { _id: 'post1', title: 'Old Title', body: 'Old Body', userId: 'user1' };

// Renders EditPostPage at /edit/:postId with location state containing the post
function renderPage(post = mockPost) {
  return render(
    <MemoryRouter initialEntries={[{ pathname: '/edit/post1', state: { post } }]}>
      <Routes>
        <Route path="/edit/:postId" element={<EditPostPage />} />
      </Routes>
    </MemoryRouter>
  );
}

beforeEach(() => {
  mockNavigate.mockClear();
  useNavigate.mockReturnValue(mockNavigate);
  global.fetch = jest.fn(() => Promise.resolve({ json: () => Promise.resolve({}) }));
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe('EditPostPage — rendering', () => {
  it('pre-fills the title input from location state', () => {
    renderPage();
    expect(screen.getByDisplayValue('Old Title')).toBeInTheDocument();
  });

  it('pre-fills the body textarea from location state', () => {
    renderPage();
    expect(screen.getByDisplayValue('Old Body')).toBeInTheDocument();
  });

  it('renders the Save button', () => {
    renderPage();
    expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument();
  });

  it('renders the Delete button', () => {
    renderPage();
    expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument();
  });

  it('initialises title and body to empty strings when post is falsy', () => {
    // location state has no post (null state.post)
    render(
      <MemoryRouter initialEntries={[{ pathname: '/edit/post1', state: { post: null } }]}>
        <Routes>
          <Route path="/edit/:postId" element={<EditPostPage />} />
        </Routes>
      </MemoryRouter>
    );
    expect(screen.getByPlaceholderText('Title')).toHaveValue('');
    expect(screen.getByPlaceholderText('Body')).toHaveValue('');
  });
});

describe('EditPostPage — Save button state', () => {
  it('is disabled when the title is cleared', () => {
    renderPage();
    fireEvent.change(screen.getByDisplayValue('Old Title'), { target: { value: '' } });
    expect(screen.getByRole('button', { name: /save/i })).toBeDisabled();
  });

  it('is disabled when the body is cleared', () => {
    renderPage();
    fireEvent.change(screen.getByDisplayValue('Old Body'), { target: { value: '' } });
    expect(screen.getByRole('button', { name: /save/i })).toBeDisabled();
  });

  it('is enabled when both fields have content', () => {
    renderPage();
    expect(screen.getByRole('button', { name: /save/i })).not.toBeDisabled();
  });
});

describe('EditPostPage — saving a post', () => {
  it('sends a PUT request to /api/posts with the updated payload', async () => {
    renderPage();
    fireEvent.change(screen.getByDisplayValue('Old Title'), { target: { value: 'New Title' } });
    fireEvent.change(screen.getByDisplayValue('Old Body'), { target: { value: 'New Body' } });
    fireEvent.submit(screen.getByRole('button', { name: /save/i }).closest('form'));
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/posts',
        expect.objectContaining({
          method: 'PUT',
          body: JSON.stringify({
            _id: 'post1',
            userId: 'user1',
            title: 'New Title',
            body: 'New Body',
          }),
        })
      );
    });
  });

  it('navigates to / after saving', async () => {
    renderPage();
    fireEvent.submit(screen.getByRole('button', { name: /save/i }).closest('form'));
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });
});

describe('EditPostPage — deleting a post', () => {
  it('sends a DELETE request for the correct postId', async () => {
    renderPage();
    fireEvent.click(screen.getByRole('button', { name: /delete/i }));
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/posts/delete/post1', { method: 'DELETE' });
    });
  });

  it('navigates to / after deletion', async () => {
    renderPage();
    fireEvent.click(screen.getByRole('button', { name: /delete/i }));
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });

  it('does not fire the PUT (save) request when Delete is clicked', async () => {
    renderPage();
    fireEvent.click(screen.getByRole('button', { name: /delete/i }));
    await waitFor(() => expect(global.fetch).toHaveBeenCalled());
    // Only one fetch call (DELETE), not two
    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/posts/delete/'),
      expect.anything()
    );
  });
});
