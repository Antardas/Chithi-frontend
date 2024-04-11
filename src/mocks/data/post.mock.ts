import { IComment } from '~/types/comment';
import { IPost } from '~/types/post';
import { IReactionPost } from '~/types/reaction';

export const postMockData: IPost = {
  _id: '6027f77087c9d9ccb1555268',
  userId: '602740b43eaf201998cd9297',
  username: 'Danny',
  email: 'danny@test.com',
  avatarColor: '#4caf50',
  profilePicture: 'https://place-hold.it/500x500',
  post: 'how are you?',
  bgColor: '#f44336',
  imgId: '1',
  imgVersion: '2',
  feelings: 'happy',
  gifUrl: '',
  privacy: 'Public',
  commentCount: 3,
  createAt: '2022-05-16',
  reactions: {
    like: 1,
    love: 2,
    happy: 0,
    wow: 0,
    sad: 0,
    angry: 0
  }
};

export const editPostMockData: IPost = {
  _id: '6027f77087c9d9ccb1555269',
  userId: '602740b43eaf201998cd9297',
  username: 'Danny',
  email: 'danny@test.com',
  avatarColor: '#4caf50',
  profilePicture: 'https://place-hold.it/500x500',
  post: 'how are you? Hope you are good?',
  bgColor: '#f44336',
  imgId: '',
  imgVersion: '',
  feelings: 'happy',
  gifUrl: '',
  privacy: 'Public',
  commentCount: 3,
  createAt: '2022-05-16',
  reactions: {
    like: 1,
    love: 2,
    happy: 0,
    wow: 0,
    sad: 0,
    angry: 0
  }
};
// TODO: add Comment Type
export const postComment: IComment = {
  _id: '6027f77087c9d9ccb1555379',
  username: 'Danny',
  avatarColor: '#4caf50',
  postId: '6027f77087c9d9ccb1555268',
  profilePicture: 'https://place-hold.it/500x500',
  comment: 'I like it',
  createdAt: '2022-05-16',
  userTo: '60263f14648fed5246e322d9'
};

export const postReactionOne: IReactionPost = {
  _id: '6027f77087c9d9ccb1555380',
  username: 'Danny',
  avatarColor: '#4caf50',
  type: 'happy',
  postId: '6027f77087c9d9ccb1555268',
  profilePicture: 'https://place-hold.it/500x500',
  createdAt: '2022-05-16',
  userTo: '60263f14648fed5246e322d9',
  comment: ''
};

export const postReactionTwo: IReactionPost = {
  _id: '6027f77087c9d9ccb1555381',
  username: 'Sunny',
  avatarColor: '#4caf50',
  type: 'like',
  postId: '6027f77087c9d9ccb1555268',
  profilePicture: 'https://place-hold.it/500x500',
  createdAt: '2022-05-16',
  userTo: '60263f14648fed5246e322d9',
  comment: ''
};
