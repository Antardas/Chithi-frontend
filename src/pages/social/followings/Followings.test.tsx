import { afterAll, afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { existingUser, existingUserTwo, userJwt } from '~/mocks/data/user.mock';
import { emptyUserFollowersMock, emptyUserFollowingMock } from '~/mocks/handlers/follow';
import { server } from '~/mocks/server';
import { addUser } from '~/redux/reducers/user/user.reducer';
import { store } from '~/redux/store';
import { socketService } from '~/services/socket/sokcet.service';
import Followers from '~/pages/social/followers';
import { prettyDOM, render, renderWithRouter, screen } from '~/test.utils';
import { Utils } from '~/services/utils/utils.service';
import { FollowerUtils } from '~/services/utils/followers-utils.service';
import userEvent from '@testing-library/user-event';
import Followings from '~/pages/social/followings';

socketService.setupSocketConnection();
const user = userEvent.setup();
describe('Following', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  afterAll(() => {
    socketService.socket.disconnect();
  });

  it('should display empty message', async () => {
    server.use(emptyUserFollowingMock);
    renderWithRouter(<Followings />);
    const cardElementItems = screen.queryByTestId('card-element-item');
    const emptyPage = await screen.findByTestId('empty-page');
    expect(cardElementItems).toBeNull();
    expect(emptyPage).toBeInTheDocument();
    expect(emptyPage.textContent).toEqual('you have not following');
  });

  it('should have 2 card element item', async () => {
    renderWithRouter(<Followings />);
    const cardElementItems = await screen.findAllByTestId('card-element-item');
    expect(cardElementItems.length).toEqual(2);
  });

  it('should have card element stats values', async () => {
    renderWithRouter(<Followings />);
    const cardElementItems = await screen.findAllByTestId('info');
    expect(cardElementItems[0].textContent).toEqual('2');
    expect(cardElementItems[1].textContent).toEqual('1');
    expect(cardElementItems[2].textContent).toEqual('2');
  });

  it('should have card element buttons', async () => {
    renderWithRouter(<Followings />);
    const cardElementButtons = await screen.findAllByTestId('card-element-buttons');
    expect(cardElementButtons[0]).toBeInTheDocument();
    expect(cardElementButtons[0].childElementCount).toEqual(2);
    expect(cardElementButtons[0].children[0].textContent).toEqual('Unfollow');
    expect(cardElementButtons[0].children[1].textContent).toEqual('Profile');
  });

  it('should handle follow button', async () => {
    vi.spyOn(Utils, 'checkIfUserIsFollowed').mockReturnValueOnce(false);
    vi.spyOn(FollowerUtils, 'followUser');
    renderWithRouter(<Followings />);
    store.dispatch(addUser({ token: '123456', profile: existingUser }));

    const cardElementButtons = await screen.findAllByTestId('card-element-buttons');
    await user.click(cardElementButtons[0].children[0]);
    expect(cardElementButtons[0].children[0].textContent).toEqual('Follow');
    expect(FollowerUtils.followUser).toHaveBeenCalledWith(FollowerUtils.getFollowObj(existingUserTwo), expect.any(Function));
  });

  it('should handle unfollow button', async () => {
    vi.spyOn(Utils, 'checkIfUserIsFollowed').mockReturnValueOnce(true);
    const emitSpy = vi.spyOn(socketService.socket, 'emit');
    vi.spyOn(FollowerUtils, 'unfollowUser');
    vi.spyOn(FollowerUtils, 'socketIORemoveFollowing');
    store.dispatch(addUser({ token: '123456', profile: existingUser }));
    renderWithRouter(<Followings />);

    const cardElementButtons = await screen.findAllByTestId('card-element-buttons');
    await user.click(cardElementButtons[0].children[0]);
    expect(cardElementButtons[0].children[0].textContent).toEqual('Unfollow');
    // console.log(emitSpy.mock.calls);
    // delete emitSpy.mock.calls[0][1].userProfile
    // const obj = FollowerUtils.getFollowObj(existingUserTwo)
    // delete obj.userProfile
    // console.log(obj, emitSpy.mock.calls[0][1]);

    // console.log(JSON.stringify(obj) === JSON.stringify(FollowerUtils.getFollowObj(emitSpy.mock.calls[0][1])), 'dekhi to');

    expect(socketService.socket.emit).toHaveBeenCalledWith('UNFOLLOW_USER', FollowerUtils.getFollowObj(existingUserTwo));
    expect(FollowerUtils.unfollowUser).toHaveBeenCalledWith(FollowerUtils.getFollowObj(existingUserTwo), expect.any(Function));
    expect(FollowerUtils.socketIORemoveFollowing).toHaveBeenCalledWith([], expect.any(Function));
  });

  it('should change url when profile button is clicked', async () => {
    const newUrl = '/app/social/profile/Danny';
    renderWithRouter(<Followings />, [
      {
        element: 'hi',
        path: newUrl
      }
    ]);
    const cardElementButtons = await screen.findAllByTestId('card-element-buttons');
    userEvent.click(cardElementButtons[0].children[1]);

    const isProfileUrl = Utils.checkUrl(newUrl, 'profile');
    expect(isProfileUrl).toBeTruthy();
  });
});
