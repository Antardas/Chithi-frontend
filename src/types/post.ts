export interface IPostData {
  post: string;
  bgColor: string;
  privacy: string;
  feelings: string;
  gifUrl: string;
  profilePicture: string;
  image: string;
  video: string;
}
export interface IPostDataEdit extends IPostData {
  imgVersion: string;
  imgId: string;
}

export interface IPost {
  _id: string;
  post: string;
  bgColor: string;
  privacy: string;
  feelings?: string;
  gifUrl?: string;
  profilePicture: string;
  image?: string;
  video?: string;
  userId: string;
  username: string;
  email: string;
  avatarColor: string;
  commentCount: number;
  reactions: {
    like: number;
    love: number;
    happy: number;
    wow: number;
    sad: number;
    angry: number;
  };
  imgVersion?: string;
  imgId?: string;
  createAt: string;
  [key: string]: unknown;
}

export interface IDropdownOption {
  topText: string;
  subText: string;
  icon: JSX.Element;
}

export interface IGetPostsApiResponse {
  message: string;
  posts: IPost[];
  totalPost: number;
}
