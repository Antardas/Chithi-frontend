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

export const forgetPasswordMock = http.post(`${BASE_URL}/forgot-password`, () => {
  const result = { message: 'Email Send Successfully' };
  return HttpResponse.json(result, {
    status: 200
  });
});

export const resetPasswordMock = http.post(`${BASE_URL}/reset-password/1234567890`, () => {
  const result = { message: 'Password successfully updated.' };
  return HttpResponse.json(result, {
    status: 200
  });
});

export const signInMock = http.post(`${BASE_URL}/signin`, () => {
  const result = { message: 'User logged in successfully', user: existingUser, token: userJwt };
  return HttpResponse.json(result, {
    status: 200
  });
});

export const signInMockError = http.post(`${BASE_URL}/signin`, () => {
  const result = { message: 'username and password wrong' };
  return HttpResponse.json(result, {
    status: 400
  });
});

export const forgetPasswordMockError = http.post(`${BASE_URL}/forgot-password`, () => {
  const result = { message: 'Field must be valid' };
  return HttpResponse.json(result, {
    status: 400
  });
});

export const resetPasswordMockError = http.post(`${BASE_URL}/reset-password/1234567890`, () => {
  const result = { message: 'Reset Token has expired', error: "teest" };
  return HttpResponse.json(result, {
    status: 404
  });
});

export const authHandler = [
  signupMock,
  signupMockError,
  forgetPasswordMock,
  resetPasswordMock,
  signInMock,
  signInMockError,
  forgetPasswordMockError,
  resetPasswordMockError
];
