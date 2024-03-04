/* eslint-disable @typescript-eslint/no-unused-vars */
import { HttpResponse, http } from 'msw';
import { existingUser, userJwt } from '~/mocks/data/user.mock';
const BASE_URL: string = `http://localhost:5000/api/v1`;
// {  _request, _params, _cookies    }
export const signupMock = http.post(`${BASE_URL}/singup`, () => {
  const result = { message: 'User Created Successfully', user: existingUser, token: userJwt };
  return HttpResponse.json(result);
});

export const authHandler = [signupMock];
