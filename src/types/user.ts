import { IPost } from './post';

interface IBasicInfo {
  quote: string;
  work: string;
  school: string;
  location: string;
}

interface ISocialLinks {
  facebook: string;
  instagram: string;
  twitter: string;
  youtube: string;
}

interface INotificationSettings {
  messages: boolean;
  reactions: boolean;
  comments: boolean;
  follows: boolean;
}

interface IUser {
  _id: string;
  authId: string;
  username?: string;
  email?: string;
  password?: string;
  avatarColor?: string;
  uId?: string;
  postsCount: number;
  work: string;
  school: string;
  quote: string;
  location: string;
  blocked: string[];
  blockedBy: string[];
  followersCount: number;
  followingCount: number;
  notifications: INotificationSettings;
  social: ISocialLinks;
  bgImageVersion: string;
  bgImageId: string;
  profilePicture: string;
  createdAt?: string;
}

interface ISignUpResponse {
  message: string;
  user: IUser;
  token: string;
}

interface IUserState {
  token: string;
  profile: IUser | null;
}
interface ISuggestionUser {
  isLoading: boolean;
  users: IUser[];
}

interface ICurrentUser {
  token: string;
  user: IUser;
  isUser: boolean;
}
interface IGetUserById {
  data: IUser;
  message: string;
}
interface IGetUserByUsername {
  data: {
    posts: IPost[];
    user: IUser;
  };
  message: string;
}

interface ISocketBlockedData {
  blockedUser: string;
  blockedBy: string;
}

interface ISearchUser {
  _id: string;
  profilePicture: string;
  username: string;
  email: string;
  avatarColor: string;
}

interface ISearchUserResponse {
  data: ISearchUser[];
  message: string;
}

interface IUpdatePassword {
  newPassword: string;
  confirmPassword: string;
  currentPassword: string;
}
interface SocialLinks {
  instagram: string;
  twitter: string;
  facebook: string;
  youtube: string;
}
interface BasicInfo {
  quote: string;
  work: string;
  school: string;
  location: string;
}
export type {
  ISignUpResponse,
  IUser,
  INotificationSettings,
  IUserState,
  ISuggestionUser,
  ICurrentUser,
  ISocketBlockedData,
  ISearchUser,
  ISearchUserResponse,
  IGetUserById,
  IGetUserByUsername,
  IUpdatePassword,
  BasicInfo,
  SocialLinks,
  BasicInfo as IBasicInfo,
  SocialLinks as ISocialLinks
};
