import { BASE_URL } from '~/services/axios';
import { HttpResponse, http } from 'msw';
import { postReactionOne, postReactionTwo } from '../data/post.mock';

export const getReactionsByUsernameMock = http.get(`${BASE_URL}/post/single/reactions/Manny`, () => {


  const result = {
    message: 'Single post reaction by username',
    reactions: [postReactionOne],
    count: 1
  };
  return HttpResponse.json(result, { status: 200 });
});

export const getPostReactionsMock = http.get(`${BASE_URL}/post/reactions/6027f77087c9d9ccb1555268`, () => {
  const result = {
    message: 'Post reactions',
    reactions: [postReactionOne, postReactionTwo],
    count: 2
  };
  return HttpResponse.json(result, { status: 200 });
});

export const getSinglePostReactionMock = http.get(`${BASE_URL}/post/single/reaction/Manny/6027f77087c9d9ccb1555268`, () => {
  const result = {
    message: 'Single post reaction',
    reactions: postReactionOne,
    count: 1
  };
  return HttpResponse.json(result, { status: 200 });
});

export const addReactionMock = http.post(`${BASE_URL}/post/reaction`, () => {
  const result = {
    message: 'Reaction added successfully'
  };
  return HttpResponse.json(result, { status: 200 });
});

export const reactionHandlers = [getReactionsByUsernameMock, getPostReactionsMock, getSinglePostReactionMock, addReactionMock];
