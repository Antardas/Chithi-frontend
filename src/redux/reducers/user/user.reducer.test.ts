import { UnknownAction } from '@reduxjs/toolkit';
import { beforeEach, describe, expect, it } from 'vitest';
import { existingUser, existingUserTwo, userJwt } from '~/mocks/data/user.mock';
import reducer, { addUser, updaterUserProfile } from '~/redux/reducers/user/user.reducer';
import { IUserState } from '~/types/user';
const initialState: IUserState = { token: '', profile: null };
describe('user reducer', () => {
  beforeEach(() => {
    initialState.token = '';
    initialState.profile = null;
  });

  it('should return the initial state', () => {
    expect(reducer(undefined, {} as UnknownAction)).toEqual(initialState);
  });

  it('should add user and token state', () => {
    expect(reducer(initialState, addUser({ token: userJwt, profile: existingUser }))).toEqual({
      profile: existingUser,
      token: userJwt
    });
  });

  it('should update user and token state', () => {
    initialState.profile = existingUser;
    initialState.token = userJwt;

    expect(reducer(initialState, updaterUserProfile( existingUserTwo ))).toEqual({
      profile: existingUserTwo,
      token: userJwt
    });
  });
});
