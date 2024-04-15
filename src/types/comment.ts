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

export interface IAddComment {
  userTo: string;
  postId: string;
  comment: string;
  profilePicture?: string;
  commentsCount?: number;
}
