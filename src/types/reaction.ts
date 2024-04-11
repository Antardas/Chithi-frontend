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