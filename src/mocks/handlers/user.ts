
import { BASE_URL } from '~/services/axios';
import { HttpResponse, http } from 'msw';
import { existingUser, existingUserThree, existingUserTwo } from '../data/user.mock';
import { postMockData } from '../data/post.mock';

export const getSuggestionsMock = http.get(`${BASE_URL}/users/suggestions`, () => {
  const result = { message: 'User suggestions', users: [existingUser] };
  return HttpResponse.json(result, { status: 200 });
});

export const getUserProfileByIdMock = http.get(`${BASE_URL}/user/profile/123456`, () => {
  const result = { message: 'Get user profile', user: existingUser };
  return HttpResponse.json(result, { status: 200 });
});

export const getUserProfileByIdUserTwoMock = http.get(`${BASE_URL}/user/profile/60263f14648fed5246e322d9`, () => {
  const result = { message: 'Get user profile', user: existingUserTwo };
  return HttpResponse.json(result, { status: 200 });
});

export const getAllUsersMock = http.get(`${BASE_URL}/user/all/1`, () => {
  const result = {
    message: 'Get users',
    users: [existingUserTwo, existingUserThree],
    followers: [existingUserThree],
    totalUsers: 2
  };
  return HttpResponse.json(result, { status: 200 });
});

export const emptyUsersMock = http.get(`${BASE_URL}/user/all/1`, () => {
  const result = {
    message: 'Get users',
    users: [],
    followers: [],
    totalUsers: 0
  };
  return HttpResponse.json(result, { status: 200 });
});

export const getUserProfileByUsernameMock = http.get(`${BASE_URL}/user/profile/posts/Manny/60263f14648fed5246e322d9/1621613119252066`, () => {
  const result = {
    message: 'Get user profile and posts',
    user: existingUser,
    posts: [postMockData]
  };
  return HttpResponse.json(result, { status: 200 });
});

export const changePasswordMock = http.put(`${BASE_URL}/user/profile/change-password`, () => {
  const result = {
    message: 'Password updated successfully. You will be redirected shortly to the login page'
  };
  return HttpResponse.json(result, { status: 200 });
});

export const userHandlers = [
  getSuggestionsMock,
  getUserProfileByIdMock,
  getUserProfileByIdUserTwoMock,
  getAllUsersMock,
  getUserProfileByUsernameMock,
  emptyUsersMock,
  changePasswordMock
];
