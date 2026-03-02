import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AddPostPage from '../../../layout/pages/AddPostPage';
import { UserProvider } from '../../../context/user-context';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

import { useNavigate } from 'react-router-dom';

const mockNavigate = jest.fn();
const currentUser = { _id: 'user1', firstName: 'Jane', isLoggedIn: true };

function renderPage() {
  localStorage.setItem('user', JSON.stringify(currentUser));
  return render(
    <MemoryRouter>
      <UserProvider>
        <AddPostPage />
      </UserProvider>
    </MemoryRouter>
  );
}

beforeEach(() => {
  localStorage.clear();
  mockNavigate.mockClear();
  useNavigate.mockReturnValue(mockNavigate);
  global.fetch = jest.fn(() => Promise.resolve({ json: () => Promise.resolve({}) }));
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe('AddPostPage — rendering', () => {
  it('renders the title input', () => {
    renderPage();
    expect(screen.getByPlaceholderText('Title')).toBeInTheDocument();
  });

  it('renders the body textarea', () => {
    renderPage();
    expect(screen.getByPlaceholderText('Body')).toBeInTheDocument();
  });

  it('renders the Submit button', () => {
    renderPage();
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
  });
});

describe('AddPostPage — submit button state', () => {
  it('is disabled when both fields are empty', () => {
    renderPage();
    expect(screen.getByRole('button', { name: /submit/i })).toBeDisabled();
  });

  it('is disabled when only the title is filled', () => {
    renderPage();
    fireEvent.change(screen.getByPlaceholderText('Title'), { target: { value: 'A title' } });
    expect(screen.getByRole('button', { name: /submit/i })).toBeDisabled();
  });

  it('is disabled when only the body is filled', () => {
    renderPage();
    fireEvent.change(screen.getByPlaceholderText('Body'), { target: { value: 'Some body' } });
    expect(screen.getByRole('button', { name: /submit/i })).toBeDisabled();
  });

  it('is enabled when both title and body have content', () => {
    renderPage();
    fireEvent.change(screen.getByPlaceholderText('Title'), { target: { value: 'A title' } });
    fireEvent.change(screen.getByPlaceholderText('Body'), { target: { value: 'Some body' } });
    expect(screen.getByRole('button', { name: /submit/i })).not.toBeDisabled();
  });
});

describe('AddPostPage — form submission', () => {
  it('posts to /api/posts with the correct payload', async () => {
    renderPage();
    fireEvent.change(screen.getByPlaceholderText('Title'), { target: { value: 'My Title' } });
    fireEvent.change(screen.getByPlaceholderText('Body'), { target: { value: 'My Body' } });
    fireEvent.submit(screen.getByRole('button', { name: /submit/i }).closest('form'));
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/posts',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ title: 'My Title', body: 'My Body', userId: 'user1' }),
        })
      );
    });
  });

  it('navigates to / after a successful post', async () => {
    renderPage();
    fireEvent.change(screen.getByPlaceholderText('Title'), { target: { value: 'My Title' } });
    fireEvent.change(screen.getByPlaceholderText('Body'), { target: { value: 'My Body' } });
    fireEvent.submit(screen.getByRole('button', { name: /submit/i }).closest('form'));
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });
});
