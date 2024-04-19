import { beforeEach, describe, expect, it } from 'vitest';
import reducer, { addReactions } from '../userReactions.reducer';
import { postReactionOne } from '~/mocks/data/post.mock';
import { UnknownAction } from '@reduxjs/toolkit';

const initialState = {
  reactions: []
};

describe('user posts reaction reducer', () => {
  beforeEach(() => {
    initialState.reactions = [];
  });

  it('should return the initial state', () => {
    expect(reducer(undefined, {} as UnknownAction)).toEqual(initialState);
  });

  it('should reactions to list', () => {
    expect(reducer(initialState, addReactions([postReactionOne]))).toEqual({
      reactions: [postReactionOne]
    });
  });
});
