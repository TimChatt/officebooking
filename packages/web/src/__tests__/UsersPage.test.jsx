import { render, screen } from '@testing-library/react';
import UsersPage from '../pages/UsersPage.jsx';
import '@testing-library/jest-dom';

beforeAll(() => {
  global.fetch = jest.fn(() =>
    Promise.resolve({ ok: true, json: () => Promise.resolve([]) })
  );
});

test('renders users heading', () => {
  render(<UsersPage />);
  expect(screen.getByRole('heading', { name: /users/i })).toBeInTheDocument();
});

afterAll(() => {
  global.fetch.mockRestore();
});
