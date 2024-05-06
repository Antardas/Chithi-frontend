import { INotificationSettings } from './user';

export interface IUserFrom {
  profilePicture: string;
  username: string;
  avatarColor: string;
  uId: string;
}

export interface INotification {
  _id: string;
  userTo: string;
  userFrom: IUserFrom;
  message: string;
  notificationType: string;
  entityId: string;
  createdItemId: string;
  comment: string;
  reaction: string;
  post: string;
  imgId: string;
  imgVersion: string;
  gifUrl: string;
  read: boolean;
  createdAt: string;
  topText?: string;
  subText?: string;
  imgUrl?: string;
}
export interface INotificationPreview {
  post: string;
  imgUrl: string;
  comment: string;
  reaction: string;
  senderName: string;
}

export interface INotificationDropdown extends INotification {
  topText: string;
  subText: string;
  imgUrl: string;
}

export interface IGetALlNotificationResponse {
  data: INotification[];
  message: string;
}

export interface INotificationType {
  index: number;
  title: string;
  description: string;
  toggle: boolean;
  type: 'messages' | 'reactions' | 'comments' | 'follows';
}

export interface INotificationUpdateResponse {
  message: string;
  data: INotificationSettings;
}
