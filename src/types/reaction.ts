export interface IReaction {
  senderName: string;
  type: string;
}

export interface IReactionPost {
  _id?: string;
  username: string;
  avatarColor: string;
  type: string;
  postId: string;
  profilePicture: string;
  createdAt: string;
  userTo: string;
  comment: string;
}

export interface IReactionsCount {
  like: number;
  love: number;
  happy: number;
  wow: number;
  sad: number;
  angry: number;
}

export interface UserReactionsResponse {
  message: string;
  reactions: IReactionPost[];
  count: number;
}
export interface PostReactionResponse extends Omit<UserReactionsResponse, 'reactions'> {
  message: string;
  reactions: IReactionPost;
  count: number;
}
export type ReactionType = 'like' | 'love' | 'wow' | 'happy' | 'sad' | 'angry';

export interface AddReactionBody {
  userTo: string;
  postId: string;
  type: ReactionType;
  previousReaction?: ReactionType;
  postReactions: IReactionsCount;
  profilePicture: string;
}

export interface SocketReactionResponse extends AddReactionBody {
  username: string;
  avatarColor: string;
}
