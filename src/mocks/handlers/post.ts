import { BASE_URL } from '~/services/axios';
import { HttpResponse, http } from 'msw';
import { postComment, postMockData } from '../data/post.mock';

export const getPostsMock = http.get(`${BASE_URL}/post/all/1`, () => {

  const result = { message: 'All posts', posts: [postMockData, postMockData], totalPosts: 2 };
  return HttpResponse.json(result, {
    status: 200
  });
});

export const emptyPostsMock = http.get(`${BASE_URL}/post/all/1`, () => {
  const result = { message: 'All posts', posts: [], totalPosts: 0 };
  return HttpResponse.json(result, {
    status: 200
  });
});

export const getPostsWithImagesMock = http.get(`${BASE_URL}/post/images/1`, () => {
  const postWithImageOne = postMockData;
  postWithImageOne.imgVersion = '1652904922';
  postWithImageOne.imgId = 'sample.jpg';
  const result = { message: 'All posts with images', posts: [postWithImageOne] };
  return HttpResponse.json(result, {
    status: 200
  });
});

export const emptyPostsWithImagesMock = http.get(`${BASE_URL}/post/images/1`, () => {
  const result = { message: 'All posts with images', posts: [] };
  return HttpResponse.json(result, {
    status: 200
  });
});

export const getPostCommentsMock = http.get(`${BASE_URL}/comments/6027f77087c9d9ccb1555268`, () => {
  const result = { message: 'Post comments', comments: [postComment] };
  return HttpResponse.json(result, {
    status: 200
  });
});

export const getPostCommentsNamesMock = http.get(`${BASE_URL}/comments/names/6027f77087c9d9ccb1555268`, () => {
  const result = { message: 'Post comments names', comments: ['Danny', 'Kenny', 'Sunny'] };
  return HttpResponse.json(result, {
    status: 200
  });
});

export const addPostMock = http.post(`${BASE_URL}/post`, () => {
  const result = {
    message: 'Post created successfully'
  };
  return HttpResponse.json(result, {
    status: 200
  });
});

export const updatePostMock = http.put(`${BASE_URL}/post/6027f77087c9d9ccb1555269`, () => {
  const result = {
    message: 'Post updated successfully'
  };
  return HttpResponse.json(result, {
    status: 200
  });
});

export const postsHandlers = [
  getPostsMock,
  getPostsWithImagesMock,
  emptyPostsWithImagesMock,
  emptyPostsMock,
  getPostCommentsMock,
  getPostCommentsNamesMock,
  addPostMock,
  updatePostMock
];
