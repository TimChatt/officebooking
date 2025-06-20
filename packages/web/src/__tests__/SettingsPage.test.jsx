import { render, screen } from '@testing-library/react';
import SettingsPage from '../pages/SettingsPage.jsx';
import '@testing-library/jest-dom';

test('renders settings heading', () => {
  render(<SettingsPage />);
  expect(screen.getByRole('heading', { name: /settings/i })).toBeInTheDocument();
});
