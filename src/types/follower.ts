import { IUser } from '~/types/user';
export interface IFollower {
  avatarColor: string;
  followersCount: number;
  followingCount: number;
  profilePicture: string;
  postCount: number;
  username: string;
  uId: string;
  _id: string;
  userProfile?: IUser;
}

export interface IAllUsers {
  users: IUser[];
  totalUsers: number;
}

export interface GetUsersResponse {
  message: string;
  data: {
    users: IUser[];
    totalUser: number;
    followers: IFollower[];
  };
}
export interface GetFollowingsResponse {
  message: string;
  data: IFollower[];
}
