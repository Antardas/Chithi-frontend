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
import Peoples from '.';
import { emptyUsersMock } from '~/mocks/handlers/user';

socketService.setupSocketConnection();
const user = userEvent.setup();
describe('People', () => {
  afterAll(() => {
    socketService.socket.disconnect();
  });

  it('should display empty message', async () => {
    server.use(emptyUsersMock);
    renderWithRouter(<Peoples />);
    const cardElementItems = screen.queryByTestId('card-element-item');
    const emptyPage = await screen.findByTestId('empty-page');
    expect(cardElementItems).toBeNull();
    expect(emptyPage).toBeInTheDocument();
    expect(emptyPage.textContent).toEqual('No user available');
  });

  it('should have 2 card element items', async () => {
    renderWithRouter(<Peoples />);
    const cardElementItems = await screen.findAllByTestId('card-element-item');
    expect(cardElementItems.length).toEqual(2);
  });

  it('should have card element stats values', async () => {
    renderWithRouter(<Peoples />);
    const cardElementItems = await screen.findAllByTestId('info');
    expect(cardElementItems[0].textContent).toEqual('2');
    expect(cardElementItems[1].textContent).toEqual('1');
    expect(cardElementItems[2].textContent).toEqual('2');
  });

  it('should have card element buttons follow and profile', async () => {
    vi.spyOn(Utils, 'checkIfUserIsFollowed').mockReturnValue(false);
    renderWithRouter(<Peoples />);
    const cardElementButtons = await screen.findAllByTestId('card-element-buttons');
    expect(cardElementButtons[0].childElementCount).toEqual(2);
    expect(cardElementButtons[0]).toBeInTheDocument();
    expect(cardElementButtons[0].children[0].textContent).toEqual('Follow');
    expect(cardElementButtons[0].children[1].textContent).toEqual('Profile');
  });

  it('should have card element buttons unfollow and profile', async () => {
    vi.spyOn(Utils, 'checkIfUserIsFollowed').mockReturnValue(true);
    renderWithRouter(<Peoples />);
    const cardElementButtons = await screen.findAllByTestId('card-element-buttons');
    expect(cardElementButtons[0].childElementCount).toEqual(2);
    expect(cardElementButtons[0]).toBeInTheDocument();
    expect(cardElementButtons[1].children[0].textContent).toEqual('Unfollow');
    expect(cardElementButtons[1].children[1].textContent).toEqual('Profile');
  });

  it('should handle follow button', async () => {
    vi.spyOn(Utils, 'checkIfUserIsFollowed').mockReturnValueOnce(false);
    vi.spyOn(FollowerUtils, 'followUser');
    vi.spyOn(FollowerUtils, 'socketIOFollowAndUnfollow');
    renderWithRouter(<Peoples />);
    const cardElementButtons = await screen.findAllByTestId('card-element-buttons');
    await user.click(cardElementButtons[0].children[0]);
    expect(cardElementButtons[0].children[0].textContent).toEqual('Follow');
    expect(FollowerUtils.followUser).toHaveBeenCalledWith(existingUserTwo, expect.any(Function));
    expect(FollowerUtils.socketIOFollowAndUnfollow).toHaveBeenCalledWith([], [], expect.any(Function), expect.any(Function));
  });

  it('should handle unfollow button', async () => {
    vi.spyOn(Utils, 'checkIfUserIsFollowed').mockReturnValueOnce(true);
    vi.spyOn(socketService.socket, 'emit');
    vi.spyOn(FollowerUtils, 'unfollowUser');
    vi.spyOn(FollowerUtils, 'socketIOFollowAndUnfollow');
    renderWithRouter(<Peoples />);
    store.dispatch(addUser({ token: '123456', profile: existingUser }));

    const cardElementButtons = await screen.findAllByTestId('card-element-buttons');
    await user.click(cardElementButtons[0].children[0]);
    existingUserTwo.followersCount -= 1;
    expect(cardElementButtons[0].children[0].textContent).toEqual('Unfollow');
    expect(socketService.socket.emit).toHaveBeenCalledWith('UNFOLLOW_USER', FollowerUtils.getFollowObj(existingUserTwo));
    expect(FollowerUtils.unfollowUser).toHaveBeenCalledWith(existingUserTwo, expect.any(Function));
    expect(FollowerUtils.socketIOFollowAndUnfollow).toHaveBeenCalledWith([], [], expect.any(Function), expect.any(Function));
  });

  it('should change url when profile button is clicked', async () => {
    renderWithRouter(<Peoples />);
    const cardElementButtons = await screen.findAllByTestId('card-element-buttons');
    await user.click(cardElementButtons[0].children[1]);
    const newUrl = `${window.location.pathname}${window.location.search}`;
    const isProfileUrl = Utils.checkUrl(newUrl, 'profile');
    expect(isProfileUrl).toBeTruthy();
  });
});
