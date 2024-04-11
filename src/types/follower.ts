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
