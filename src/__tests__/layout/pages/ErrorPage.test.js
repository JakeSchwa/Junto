import React from 'react';
import { render, screen } from '@testing-library/react';
import ErrorPage from '../../../layout/pages/ErrorPage';

describe('ErrorPage', () => {
  it('renders the 404 heading', () => {
    render(<ErrorPage />);
    expect(screen.getByRole('heading', { name: /oops! page not found!/i })).toBeInTheDocument();
  });

  it('heading is an h1', () => {
    const { container } = render(<ErrorPage />);
    expect(container.querySelector('h1')).toHaveTextContent('Oops! Page not found!');
  });
});
