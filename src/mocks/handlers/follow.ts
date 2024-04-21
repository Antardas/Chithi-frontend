import { HttpResponse, http } from "msw";
import { BASE_URL } from "~/services/axios";
import { existingUserThree, existingUserTwo } from "../data/user.mock";
import { FollowerUtils } from "~/services/utils/followers-utils.service";



export const getUserFollowingMock = http.get(`${BASE_URL}/users/followings`, () => {
  const result = { message: 'User following', data: [FollowerUtils.getFollowObj(existingUserTwo), FollowerUtils.getFollowObj(existingUserThree)] };
  return HttpResponse.json( result, {status: 200});
});

export const emptyUserFollowingMock = http.get(`${BASE_URL}/users/followings`, () => {
  const result = { message: 'User following', data: [] };
  return HttpResponse.json( result, {status: 200});
});

export const getUserFollowersMock = http.get(`${BASE_URL}/users/followers`, () => {
  const result = { message: 'User followers', data: [FollowerUtils.getFollowObj(existingUserTwo), FollowerUtils.getFollowObj(existingUserThree)] };
  return HttpResponse.json( result, {status: 200});
});

export const emptyUserFollowersMock = http.get(
  `${BASE_URL}/users/followers`,
  () => {
    const result = { message: 'User followers', data: [] };
    return HttpResponse.json( result, {status: 200});
  }
);

export const followUserMock = http.put(`${BASE_URL}/users/follow/60263f14648fed5246e322d8`, () => {
  const result = { message: 'Following user now' };
  return HttpResponse.json( result, {status: 200});
});

export const unFollowUserMock = http.put(
  `${BASE_URL}/users/unfollow/60263f14648fed5246e322d8`,
  () => {
    const result = { message: 'Unfollowed user now' };
    return HttpResponse.json( result, {status: 200});
  }
);

export const blockUserMock = http.put(`${BASE_URL}/users/block/60263f14648fed5246e322d8`, () => {
  const result = { message: 'User blocked' };
  return HttpResponse.json( result, {status: 200});
});

export const unblockUserMock = http.put(`${BASE_URL}/users/unblock/60263f14648fed5246e322d8`, () => {
  const result = { message: 'User unblocked' };
  return HttpResponse.json( result, {status: 200});
});

export const followingHandlers = [
  getUserFollowingMock,
  followUserMock,
  unFollowUserMock,
  getUserFollowersMock,
  blockUserMock,
  unblockUserMock,
  emptyUserFollowingMock,
  emptyUserFollowersMock
];