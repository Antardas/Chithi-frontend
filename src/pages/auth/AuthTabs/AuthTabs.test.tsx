import { describe, expect, it } from 'vitest';
import { renderWithRouter, screen, within } from '~/test.utils';
import { AuthTabs } from '~/pages/auth';
import userEvent from '@testing-library/user-event';

describe('AuthTabs', () => {
  it('sign in tab should be displayed', () => {
    renderWithRouter(<AuthTabs />);
    const listElement = screen.getByRole('list');
    const { getAllByRole } = within(listElement);

    const items = getAllByRole('listitem');

    expect(items[0]).toHaveTextContent('Sign In');
    expect(items[0]).toHaveClass('active');
  });
  it('sign up tab should be displayed', async () => {
    const user = userEvent.setup();
    renderWithRouter(<AuthTabs />);
    const listElement = screen.getByRole('list');
    const { getAllByRole } = within(listElement);

    const items = getAllByRole('listitem');

    await user.click(items[1]);
    expect(items[1]).toHaveTextContent('Sign Up');
    expect(items[1]).toHaveClass('active');
  });
});
