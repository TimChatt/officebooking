import { render, screen } from '@testing-library/react';
import App from '../App.jsx';
import '@testing-library/jest-dom';

beforeAll(() => {
  global.fetch = jest.fn(() =>
    Promise.resolve({ ok: true, json: () => Promise.resolve([]) })
  );
});

test('renders heading', () => {
  render(<App />);
  expect(screen.getByRole('heading', { name: /office booking/i })).toBeInTheDocument();
});

afterAll(() => {
  global.fetch.mockRestore();
});
