export interface INotification {
  _id: string;
  userTo: string;
  userFrom: string;
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
  read?: boolean;
  createdAt?: string;
}
