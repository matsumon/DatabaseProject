import { render, screen } from '@testing-library/react';
import LogIn from './App';

test('renders learn react link', () => {
  render(<LogIn />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
