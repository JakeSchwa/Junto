import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Friend from '../../components/Friend';

const mockFriend = { id: 2, name: 'Alice Smith' };

function renderFriend(friend = mockFriend) {
  return render(
    <MemoryRouter>
      <Friend friend={friend} />
    </MemoryRouter>
  );
}

describe('Friend', () => {
  it('renders the friend name', () => {
    renderFriend();
    expect(screen.getByText('Alice Smith')).toBeInTheDocument();
  });

  it('links to /friend/:id using the friend id', () => {
    renderFriend();
    expect(screen.getByRole('link')).toHaveAttribute('href', '/friend/2');
  });

  it('applies the friendsPage CSS class to the link', () => {
    renderFriend();
    expect(screen.getByRole('link')).toHaveClass('friendsPage');
  });

  it('renders inside a list group item', () => {
    const { container } = renderFriend();
    expect(container.querySelector('.list-group-item')).toBeInTheDocument();
  });

  it('renders a different friend correctly', () => {
    renderFriend({ id: 99, name: 'Bob Jones' });
    expect(screen.getByText('Bob Jones')).toBeInTheDocument();
    expect(screen.getByRole('link')).toHaveAttribute('href', '/friend/99');
  });
});
