import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import Dropdown, { DropdownProps } from '~/Components/Dropdown';
import { renderWithRouter, screen } from '~/test.utils';
import { ISettingsDropdown } from '~/types/utils';

describe('Dropdown', () => {
  it('should display notification content', async () => {
    const user = userEvent.setup();
    const onMarkAsRead = vi.fn();
    const onDeleteNotification = vi.fn();
    const item: ISettingsDropdown = {
      topText: 'This is a test',
      subText: 'Subtext'
    };

    const props: DropdownProps = {
      data: [item, item, item],
      notificationCount: 1,
      title: 'Notifications',
      style: { right: '250px', top: '20px' },
      height: 300,
      onMarkAsRead,
      onDeleteNotification,
      onLogout: vi.fn(),
      onNavigate: vi.fn()
    };
    const { baseElement } = renderWithRouter(<Dropdown {...props} />);
    const smallElement = screen.getByText(1);
    const infoContainer = screen.getByTestId('info-container');
    const topTextElement = screen.getAllByText('This is a test');
    const trashIcon = baseElement.querySelector('.trash') as Element;
    await user.click(topTextElement[0]);
    await user.click(trashIcon);
    expect(smallElement).toBeInTheDocument();
    expect(infoContainer.childElementCount).toEqual(3);
    expect(onMarkAsRead).toHaveBeenCalledTimes(1);
    expect(onDeleteNotification).toHaveBeenCalledTimes(1);
  });
  it('should display settings content', async () => {
    const user = userEvent.setup();
    const onLogout = vi.fn();
    const onNavigate = vi.fn();
    const onMarkAsRead = vi.fn();
    const onDeleteNotification = vi.fn();
    const item: ISettingsDropdown = {
      topText: 'My Profile',
      subText: 'View profile'
    };

    const props: DropdownProps = {
      data: [item],
      notificationCount: 0,
      title: 'Settings',
      style: { right: '250px', top: '20px' },
      height: 300,
      onMarkAsRead,
      onDeleteNotification,
      onLogout,
      onNavigate
    };
    const { baseElement } = renderWithRouter(<Dropdown {...props} />);
    const buttonElement = baseElement.querySelector('.signOut') as Element;

    const infoContainer = screen.getByTestId('info-container');
    const topTextElement = screen.getAllByText('My Profile');
    await user.click(topTextElement[0]);
    await user.click(buttonElement);
    expect(buttonElement).toBeInTheDocument();
    expect(infoContainer.childElementCount).toEqual(1);
    expect(onNavigate).toHaveBeenCalledTimes(1);
    expect(onLogout).toHaveBeenCalledTimes(1);
  });
});
