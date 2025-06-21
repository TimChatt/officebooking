import { render, screen, act, waitFor } from '@testing-library/react';
import UsersPage from '../pages/UsersPage.jsx';
import { ChatProvider } from '../context/ChatContext.jsx';
import '@testing-library/jest-dom';

beforeAll(() => {
  global.fetch = jest.fn(() =>
    Promise.resolve({ ok: true, json: () => Promise.resolve([]) })
  );
});

test('renders users heading', async () => {
  await act(async () => {
    render(
      <ChatProvider>
        <UsersPage />
      </ChatProvider>
    );
  });
  await waitFor(() => expect(global.fetch).toHaveBeenCalled());
  expect(screen.getByRole('heading', { name: /users/i })).toBeInTheDocument();
});

afterAll(() => {
  global.fetch.mockRestore();
});
