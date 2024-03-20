export interface INotification {
  _id: string;
  userTo: string;
  userFrom: {
    profilePicture: string;
    username: string;
    avatarColor: string;
    uId: string;
  };
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

export interface IGetALlNotificationResponse {
  data: INotification[];
  message: string;
}
