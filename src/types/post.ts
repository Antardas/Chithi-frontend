export interface IPostData {
  post: string;
  bgColor: string;
  privacy: string;
  feelings: string;
  gifUrl: string;
  profilePicture: string;
  image: string;
}

export interface IPost {
  _id: string;
  post: string;
  bgColor: string;
  privacy: string;
  feelings?: string;
  gifUrl?: string;
  profilePicture: string;
  image: string;
  userId: string;
  username: string;
  email: string;
  avatarColor: string;
  commentsCount: string;
  reactions: unknown[];
  imgVersion?: string;
  imgId?: string;
  createdAt: string;
  [key: string]: unknown;
}

export interface IDropdownOption {
  topText: string;
  subText: string;
  icon: JSX.Element;
}
