import { render, screen } from '@testing-library/react';
import { App } from '../index.jsx';
import '@testing-library/jest-dom';

test('renders heading', () => {
  render(<App />);
  expect(screen.getByRole('heading', { name: /office booking/i })).toBeInTheDocument();
});
