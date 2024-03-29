import { IUser } from '~/types/user';

export const existingUser: IUser = {
  notifications: {
    messages: true,
    reactions: true,
    comments: true,
    follows: true
  },
  social: {
    facebook: '',
    instagram: '',
    twitter: '',
    youtube: ''
  },
  quote: 'The earth is mine and the fullness thereof.',
  blocked: [],
  blockedBy: [],
  followersCount: 1,
  followingCount: 2,
  postsCount: 2,
  bgImageVersion: '',
  bgImageId: '',
  profilePicture: 'http://place-hold.it/500x500',
  _id: '60263f14648fed5246e322d9',
  uId: '1621613119252066',
  username: 'Manny',
  email: 'manny@me.com',
  avatarColor: 'red',
  work: 'KickChat Inc.',
  school: 'University of Benin',
  location: 'Dusseldorf, Germany',
  createdAt: '2022-06-15',
  authId: '60263f14648fed52469eka5o'
};

export const existingUserTwo: IUser = {
  notifications: {
    messages: false,
    reactions: true,
    comments: true,
    follows: false
  },
  social: {
    facebook: '',
    instagram: '',
    twitter: '',
    youtube: ''
  },
  // postCount: 7,
  // gender: '',
  quote: 'The earth is mine and the fullness thereof.',
  // about: 'I am a cool guy',
  // relationship: '',
  blocked: [],
  blockedBy: [],
  followersCount: 1,
  followingCount: 2,
  postsCount: 2,
  bgImageVersion: '',
  bgImageId: '',
  profilePicture: 'http://place-hold.it/500x500',
  _id: '60263f14648fed5246e322d8',
  uId: '1621613119252065',
  username: 'Danny',
  email: 'danny@me.com',
  avatarColor: '#9c27b1',
  work: 'KickChat Inc.',
  school: 'University of Benin',
  location: 'Dusseldorf, Germany',
  createdAt: '2022-06-15',
  authId: '60263f14648fed52469eka5n'
};

export const existingUserThree: IUser = {
  notifications: {
    messages: false,
    reactions: true,
    comments: true,
    follows: false
  },
  social: {
    facebook: '',
    instagram: '',
    twitter: '',
    youtube: ''
  },
  // postsCount: 7,
  // gender: '',
  quote: 'The earth is mine and the fullness thereof.',
  // about: 'I am a cool guy',
  // relationship: '',
  blocked: [],
  blockedBy: [],
  followersCount: 1,
  followingCount: 2,
  postsCount: 2,
  bgImageVersion: '',
  bgImageId: '',
  profilePicture: 'http://place-hold.it/500x500',
  _id: '60263f14648fed5246e322d7',
  uId: '1621613119252064',
  username: 'Sunny',
  email: 'sunny@me.com',
  avatarColor: '#9c27b1',
  work: 'KickChat Inc.',
  school: 'University of Benin',
  location: 'Dusseldorf, Germany',
  // quote: 'Sky is my limit',
  createdAt: '2022-06-15',
  authId: '60263f14648fed52469eka5m'
};

export const existingUserFour: IUser = {
  notifications: {
    messages: false,
    reactions: true,
    comments: true,
    follows: false
  },
  social: {
    facebook: '',
    instagram: '',
    twitter: '',
    youtube: ''
  },
  quote: 'The earth is mine and the fullness thereof.',
  blocked: [],
  blockedBy: [],
  followersCount: 1,
  followingCount: 2,
  postsCount: 2,
  bgImageVersion: '',
  bgImageId: '',
  profilePicture: 'http://place-hold.it/500x500',
  _id: '60263f14648fed5246e322d5',
  uId: '1621613119252062',
  username: 'Kenny',
  email: 'ken@me.com',
  avatarColor: '#9c27b1',
  work: 'KickChat Inc.',
  school: 'University of Benin',
  location: 'Dusseldorf, Germany',
  createdAt: '2022-06-15',
  authId: '60263f14648fed52469eka5s'
};

export const userJwt =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
