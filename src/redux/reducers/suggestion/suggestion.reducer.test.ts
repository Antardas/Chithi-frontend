import reducer, { addToSuggestion } from '~/redux/reducers/suggestion/suggestion.reducer';
import { ISuggestionUser } from '~/types/user';
import { beforeEach, describe, expect, it } from 'vitest';
import { UnknownAction } from '@reduxjs/toolkit';

const initialState: ISuggestionUser = {
  users: [],
  isLoading: false
};

describe('suggestions reducer', () => {
  beforeEach(() => {
    initialState.users = [];
    initialState.isLoading = false;
  });

  it('should return the initial state', () => {
    expect(reducer(undefined, {} as UnknownAction)).toEqual({
      users: [],
      isLoading: false
    });
  });

  it('should add users to suggestions', () => {
    expect(reducer(initialState, addToSuggestion({ users: [1, 2, 3, 4, 5], isLoading: true }))).toEqual({
      users: [1, 2, 3, 4, 5],
      isLoading: true
    });
  });
});
