import { notificationData } from '~/mocks/data/notification.mock';
import { emptyNotificationsMock, getUserNotificationsMock } from '~/mocks/handlers/notification';
import { server } from '~/mocks/server';
import Notification from '~/pages/social/notification';
import { prettyDOM, render, renderWithRouter, screen } from '~/test.utils';
import { notificationService } from '~/services/api/notification/notification.service';
import { NotificationUtils } from '~/services/utils/notification-utils.service';
import userEvent from '@testing-library/user-event';
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { socketService } from '~/services/socket/sokcet.service';
import { Socket } from 'socket.io-client';

const onListener = vi.fn();
const offListener = vi.fn();
const emitListener = vi.fn();
describe('Notification', () => {
  beforeAll(() => {
    socketService.socket = {} as Socket;
    socketService.socket.on = onListener;
    socketService.socket.off = offListener;
    socketService.socket.emit = emitListener;
  });

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterAll(() => {
    vi.clearAllMocks();
  });

  it('should display empty notification message', async () => {
    server.use(emptyNotificationsMock);
    renderWithRouter(<Notification />);
    const cardElementItems = screen.queryByTestId('notification-box');

    const emptyPage = await screen.findByTestId('empty-page');
    expect(cardElementItems).toBeNull();
    expect(emptyPage).toBeInTheDocument();
    expect(emptyPage.textContent).toEqual('You have no notification');
  });

  it('should have 1 card element item', async () => {
    renderWithRouter(<Notification />);
    const cardElementItems = await screen.findAllByTestId('notification-box');
    expect(cardElementItems.length).toEqual(1);
  });

  it('should show notification preview modal', async () => {
    const user = userEvent.setup();
    renderWithRouter(<Notification />);
    const cardElementItems = await screen.findAllByTestId('notification-box');
    await user.click(cardElementItems[0]);
    const notificationPreview = await screen.findByTestId('notification-preview');
    expect(notificationPreview).toBeInTheDocument();
  });

  it('should handle mark as read', async () => {
    const user = userEvent.setup();

    vi.spyOn(NotificationUtils, 'markAsRead');
    renderWithRouter(<Notification />);
    const cardElementItems = await screen.findAllByTestId('notification-box');
    await user.click(cardElementItems[0]);
    expect(NotificationUtils.markAsRead).toHaveBeenCalledWith(notificationData._id, notificationData, expect.any(Function));
  });

  it('should handle delete', async () => {
    const user = userEvent.setup();
    vi.spyOn(notificationService, 'deleteNotification');
    renderWithRouter(<Notification />);
    const subtitleElement = await screen.findAllByTestId('subtitle');
    await user.click(subtitleElement[0]);
    expect(notificationService.deleteNotification).toHaveBeenCalledWith('12345');
  });
});
