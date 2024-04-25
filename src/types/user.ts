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

export type {
  ISignUpResponse,
  IUser,
  INotificationSettings,
  IBasicInfo,
  ISocialLinks,
  IUserState,
  ISuggestionUser,
  ICurrentUser,
  ISocketBlockedData,
  ISearchUser,
  ISearchUserResponse,
  IGetUserById
};
