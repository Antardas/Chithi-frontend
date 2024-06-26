import { IReaction } from './reaction';

export interface IMessageList {
  // in backend it's name IMessageData
  _id: string;
  conversationId: string;
  receiverId: string;
  receiverUsername: string;
  receiverAvatarColor: string;
  receiverProfilePicture: string;
  senderUsername: string;
  senderId: string;
  senderAvatarColor: string;
  senderProfilePicture: string;
  body: string;
  isRead: boolean;
  gifUrl: string;
  selectedImage: string;
  reaction: IReaction[];
  createdAt: string;
  deleteForMe: boolean;
  deleteForEveryone: boolean;
  message?: string;
}

export interface GetConversationList {
  message: string;
  data: IMessageList[];
}

export interface ISenderReceiver {
  senderId: string;
  receiverId: string;
  senderName: string;
  receiverName: string;
}
export interface ISocketMessageReaction {
  username: string;
  setChatMessages: (messages: IMessageList[]) => void;
}

export interface IConversationUsers {
  sender: string;
  receiver: string;
}

export interface ISendMessageBody {
  conversationId: string;
  receiverId: string;
  receiverUsername: string;
  receiverAvatarColor: string;
  receiverProfilePicture: string;
  body: string;
  gifUrl: string;
  selectedImage: string;
  isRead: boolean;
}

export interface IUpdateMessageReaction {
  messageId: string;
  reaction: string;
  type: 'add' | 'remove';
  conversationId: string;
}

export interface IMarkMessageAsDeleted {
  senderId: string;
  receiverId: string;
  messageId: string;
  type: 'me' | 'everyone';
}
