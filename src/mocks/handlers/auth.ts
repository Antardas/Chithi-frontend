/* eslint-disable @typescript-eslint/no-unused-vars */
import { HttpResponse, http } from 'msw';
import { existingUser, userJwt } from '~/mocks/data/user.mock';
const BASE_URL: string = `http://localhost:5000/api/v1`;
// {  _request, _params, _cookies    }
export const signupMock = http.post(`${BASE_URL}/signup`, () => {
  const result = { message: 'User Created Successfully', user: existingUser, token: userJwt };
  return HttpResponse.json(result, {
    status: 200
  });
});

export const signupMockError = http.post(`${BASE_URL}/signup`, () => {
  const result = { message: 'Invalid Credentials', status: 'BAD_REQUEST', statusCode: 400 };
  return HttpResponse.json(result, {
    status: 400
  });
});

export const authHandler = [signupMock, signupMockError];
