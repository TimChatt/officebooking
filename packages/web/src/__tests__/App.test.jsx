import { render, screen, act, waitFor } from '@testing-library/react';
import App from '../App.jsx';
import '@testing-library/jest-dom';

beforeAll(() => {
  global.fetch = jest.fn(() =>
    Promise.resolve({ ok: true, json: () => Promise.resolve([]) })
  );
});

test('renders heading', async () => {
  await act(async () => {
    render(<App />);
  });
  await waitFor(() => expect(global.fetch).toHaveBeenCalled());
  expect(screen.getByRole('heading', { name: /office booking/i })).toBeInTheDocument();
});

afterAll(() => {
  global.fetch.mockRestore();
});
