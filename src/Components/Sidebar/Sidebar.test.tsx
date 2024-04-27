import userEvent from '@testing-library/user-event';
import { afterAll, beforeEach, describe, expect, it, vi } from 'vitest';
import Sidebar from '~/Components/Sidebar';
import { socketIOMock } from '~/mocks/handlers/sokcet';
import { server } from '~/mocks/server';
import { socketService } from '~/services/socket/sokcet.service';
import { sideBarItems } from '~/services/utils/static.data';
import { prettyDOM, renderWithRouter, routeObject, screen, waitFor, within } from '~/test.utils';

const user = userEvent.setup({});
describe('Sidebar', () => {
  beforeEach(() => {
    server.use(socketIOMock);
    socketService.setupSocketConnection();
    vi.spyOn(socketService?.socket, 'off');
  });

  afterAll(() => {
    socketService?.socket?.disconnect();
  });

  it('should have its list elements', () => {
    renderWithRouter(<Sidebar />);
    const listElement = screen.getByRole('list');
    const { getAllByRole } = within(listElement);
    const items = getAllByRole('listitem');
    expect(items.length).toBeGreaterThan(0);
  });

  it('should change url when clicked', async () => {
    renderWithRouter(<Sidebar />, [
      {
        element: 'Hello',
        path: '/app/social/chat/messages'
      }
    ]);
    const listItem = screen.getAllByTestId('sidebar-list');
    await user.click(listItem[1]);
    const url = sideBarItems[1].url;
    await waitFor(() => expect(routeObject.state.location.pathname).toEqual(url));
  });

  it('should have active class on selected item', async () => {
    renderWithRouter(<Sidebar />, [
      {
        element: 'Hello',
        path: '/app/social/chat/messages'
      }
    ]);
    const listItem = screen.getAllByTestId('sidebar-list');
    await user.click(listItem[1]);
    waitFor(() => expect(listItem[1]).toHaveClass('active'));
  });
});
