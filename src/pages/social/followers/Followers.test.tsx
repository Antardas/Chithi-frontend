import { afterAll, afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { existingUser, existingUserTwo, userJwt } from '~/mocks/data/user.mock';
import { emptyUserFollowersMock } from '~/mocks/handlers/follow';
import { server } from '~/mocks/server';
import { addUser } from '~/redux/reducers/user/user.reducer';
import { store } from '~/redux/store';
import { socketService } from '~/services/socket/sokcet.service';
import Followers from '~/pages/social/followers';
import { prettyDOM, render, renderWithRouter, screen } from '~/test.utils';
import { Utils } from '~/services/utils/utils.service';
import { FollowerUtils } from '~/services/utils/followers-utils.service';
import userEvent from '@testing-library/user-event';

socketService.setupSocketConnection();
const user = userEvent.setup();
describe('Followers', () => {
  beforeEach(() => {
    store.dispatch(addUser({ token: userJwt, profile: existingUser }));
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  afterAll(() => {
    socketService.socket.disconnect();
  });

  it('should display empty message', async () => {
    server.use(emptyUserFollowersMock);
    renderWithRouter(<Followers />);
    const cardElementItems = screen.queryByTestId('card-element-item');
    const emptyPage = await screen.findByTestId('empty-page');
    expect(cardElementItems).toBeNull();
    expect(emptyPage).toBeInTheDocument();
    expect(emptyPage.textContent).toEqual('you have no followers');
  });

  it('should have 2 card element item', async () => {
    renderWithRouter(<Followers />);
    const cardElementItems = await screen.findAllByTestId('card-element-item');
    expect(cardElementItems.length).toEqual(2);
  });

  it('should have card element stats values', async () => {
    renderWithRouter(<Followers />);
    const cardElementItems = await screen.findAllByTestId('info');
    console.log(prettyDOM(cardElementItems[0]));

    expect(cardElementItems[0].textContent).toEqual('2');
    expect(cardElementItems[1].textContent).toEqual('1');
    expect(cardElementItems[2].textContent).toEqual('2');
  });

  it('should have card element buttons', async () => {
    renderWithRouter(<Followers />);
    const cardElementButtons = await screen.findAllByTestId('card-element-buttons');
    expect(cardElementButtons[0]).toBeInTheDocument();
    expect(cardElementButtons[0].childElementCount).toEqual(2);
    expect(cardElementButtons[0].children[0].textContent).toEqual('Block');
    expect(cardElementButtons[0].children[1].textContent).toEqual('Profile');
  });

  it('should handle block button', async () => {
    vi.spyOn(Utils, 'checkIfUserIsBlocked').mockReturnValueOnce(false);
    vi.spyOn(FollowerUtils, 'blockUser');
    vi.spyOn(socketService.socket, 'emit');
    vi.spyOn(FollowerUtils, 'socketIOBlockAndUnblock');
    renderWithRouter(<Followers />);
    const cardElementButtons = await screen.findAllByTestId('card-element-buttons');
    await user.click(cardElementButtons[0].children[0]);
    expect(cardElementButtons[0].children[0].textContent).toEqual('Block');
    expect(socketService.socket.emit).toHaveBeenCalledWith('BLOCK_USER', {
      blockedUser: existingUserTwo._id,
      blockedBy: existingUser._id
    });
    expect(FollowerUtils.blockUser).toHaveBeenCalledWith(FollowerUtils.getFollowObj(existingUserTwo), expect.any(Function));

    expect(FollowerUtils.socketIOBlockAndUnblock).toHaveBeenCalledWith(existingUser, userJwt, expect.any(Function), expect.any(Function));
  });

  it('should handle unblock button', async () => {
    vi.spyOn(Utils, 'checkIfUserIsBlocked').mockReturnValue(true);
    vi.spyOn(socketService.socket, 'emit');
    vi.spyOn(FollowerUtils, 'unblockUser');
    vi.spyOn(FollowerUtils, 'socketIOBlockAndUnblock');
    renderWithRouter(<Followers />);
    const cardElementButtons = await screen.findAllByTestId('card-element-buttons');
    await user.click(cardElementButtons[0].children[0]);
    expect(cardElementButtons[0].children[0].textContent).toEqual('Unblock');
    expect(socketService.socket.emit).toHaveBeenCalledWith('UNBLOCK_USER', {
      blockedUser: existingUserTwo._id,
      blockedBy: existingUser._id
    });
    expect(FollowerUtils.unblockUser).toHaveBeenCalledWith(FollowerUtils.getFollowObj(existingUserTwo), expect.any(Function));
    expect(FollowerUtils.socketIOBlockAndUnblock).toHaveBeenCalledWith(existingUser, userJwt, expect.any(Function), expect.any(Function));
  });

  it('should change url when profile button is clicked', async () => {
    renderWithRouter(<Followers />, [
      {
        element: 'Hi',
        path: '/app/social/profile/Danny'
      }
    ]);
    const cardElementButtons = await screen.findAllByTestId('card-element-buttons');
    await user.click(cardElementButtons[0].children[1]);
    const newUrl = '/app/social/profile/Danny';
    console.log(newUrl);

    const isProfileUrl = Utils.checkUrl(newUrl, 'profile');
    expect(isProfileUrl).toBeTruthy();
  });
});
