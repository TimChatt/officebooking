import { render, screen } from '@testing-library/react';
import SettingsPage from '../pages/SettingsPage.jsx';
import { ChatProvider } from '../context/ChatContext.jsx';
import '@testing-library/jest-dom';

test('renders settings heading', () => {
  render(
    <ChatProvider>
      <SettingsPage />
    </ChatProvider>
  );
  expect(screen.getByRole('heading', { name: /settings/i })).toBeInTheDocument();
});
