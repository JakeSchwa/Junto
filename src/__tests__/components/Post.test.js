import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Post from '../../components/Post';

const mockPost = { _id: 'post1', title: 'Test Title', body: 'Test body content', userId: 'u1' };

function renderPost(props = {}) {
  return render(
    <MemoryRouter>
      <Post post={mockPost} self={true} {...props} />
    </MemoryRouter>
  );
}

describe('Post — content', () => {
  it('renders the post title', () => {
    renderPost();
    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });

  it('renders the post body', () => {
    renderPost();
    expect(screen.getByText('Test body content')).toBeInTheDocument();
  });

  it("renders today's date in long format", () => {
    renderPost();
    const expectedDate = new Date().toLocaleDateString(undefined, {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    expect(screen.getByText(expectedDate)).toBeInTheDocument();
  });
});

describe('Post — edit link', () => {
  it('the edit link points to /edit/:postId', () => {
    renderPost({ self: true });
    const link = screen.getByRole('link', { name: '' }); // link wraps the icon
    expect(link).toHaveAttribute('href', '/edit/post1');
  });

  it('the edit icon is visible when self=true (hidden attribute absent)', () => {
    renderPost({ self: true });
    const svg = document.querySelector('svg');
    expect(svg).not.toHaveAttribute('hidden');
  });

  it('the edit icon is hidden when self=false (hidden attribute present)', () => {
    renderPost({ self: false });
    const svg = document.querySelector('svg');
    expect(svg).toHaveAttribute('hidden');
  });
});

describe('Post — card structure', () => {
  it('wraps content in a card element', () => {
    const { container } = renderPost();
    expect(container.querySelector('.card')).toBeInTheDocument();
  });

  it('places the date in the .postDate span', () => {
    renderPost();
    const span = document.querySelector('.postDate');
    expect(span).toBeInTheDocument();
    expect(span.textContent).not.toBe('');
  });
});
