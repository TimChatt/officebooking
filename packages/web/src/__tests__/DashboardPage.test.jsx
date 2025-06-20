import { render, screen, act, waitFor } from '@testing-library/react';
import DashboardPage from '../pages/DashboardPage.jsx';
import '@testing-library/jest-dom';

beforeAll(() => {
  global.fetch = jest.fn(() =>
    Promise.resolve({ ok: true, json: () => Promise.resolve([]) })
  );
});

test('renders dashboard heading', async () => {
  await act(async () => {
    render(<DashboardPage />);
  });
  await waitFor(() => expect(global.fetch).toHaveBeenCalled());
  expect(screen.getByRole('heading', { name: /dashboard/i })).toBeInTheDocument();
});

afterAll(() => {
  global.fetch.mockRestore();
});
