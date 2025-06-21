import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SettingsPage from '../pages/SettingsPage.jsx';
import { ChatProvider } from '../context/ChatContext.jsx';
import '@testing-library/jest-dom';

beforeAll(() => {
  global.fetch = jest.fn(() =>
    Promise.resolve({ ok: true, json: () => Promise.resolve({ profile: {}, integrations: {} }) })
  );
});

test('renders settings heading and saves profile', async () => {
  render(
    <ChatProvider>
      <SettingsPage />
    </ChatProvider>
  );

  expect(screen.getByRole('heading', { name: /settings/i })).toBeInTheDocument();

  fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'Bob' } });
  fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'bob@example.com' } });
  fireEvent.click(screen.getByRole('button', { name: /save profile/i }));

  await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(2));
  expect(global.fetch.mock.calls[1][0]).toBe('/api/settings/profile');
});

afterAll(() => {
  global.fetch.mockRestore();
});
