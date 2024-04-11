export interface IComment {
  _id?: string;
  username: string;
  avatarColor: string;
  postId: string;
  profilePicture: string;
  comment: string;
  createdAt?: string;
  userTo?: string;
}
