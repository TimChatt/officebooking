import { render, screen } from '@testing-library/react';
import DashboardPage from '../pages/DashboardPage.jsx';
import '@testing-library/jest-dom';

beforeAll(() => {
  global.fetch = jest.fn(() =>
    Promise.resolve({ ok: true, json: () => Promise.resolve([]) })
  );
});

test('renders dashboard heading', () => {
  render(<DashboardPage />);
  expect(screen.getByRole('heading', { name: /dashboard/i })).toBeInTheDocument();
});

afterAll(() => {
  global.fetch.mockRestore();
});
