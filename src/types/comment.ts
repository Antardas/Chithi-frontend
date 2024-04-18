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
export interface ICommentSocketResponse extends IComment {
  commentsCount: number;
}

export interface IAddComment {
  userTo: string;
  postId: string;
  comment: string;
  profilePicture?: string;
  commentsCount?: number;
}

export interface ICommentNameList {
  count: number;
  names: string[];
}

export interface GetCommentsNames {
  message: string;
  comments: ICommentNameList;
}
export interface GetComments {
  message: string;
  comments: IComment[];
}
