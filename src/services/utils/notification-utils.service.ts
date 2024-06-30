import { socketService } from '~/services/socket/sokcet.service';
import { INotification, INotificationDropdown, INotificationPreview } from '~/types/notification';
import { IUser } from '~/types/user';
import { Utils } from '~/services/utils/utils.service';
import { timeAgo } from '~/services/utils/timeago.utils';
import { notificationService } from '~/services/api/notification/notification.service';
import { AppDispatch, store } from '~/redux/store';
import { IMessageList } from '~/types/chat';
import { SetState } from '~/types/utils';
import { Location } from 'react-router-dom';
import { ChatUtils } from './chat-utils.service';

export class NotificationUtils {
  private static state = store.getState();

  static socketIONotifications(
    profile: IUser,
    notifications: INotification[],
    setNotifications: (items: INotification[]) => void,
    type: string,
    setNotificationsCount: (count: number) => void
  ) {
    socketService.socket.on('INSERT_NOTIFICATION', (data: INotification[], { userTo }: { userTo: string }) => {
      if (profile._id === userTo) {
        notifications = [...data].sort((a, b) => {
          const aCreatedAt = new Date(a.createdAt);
          const bCreatedAt = new Date(b.createdAt);
          if (aCreatedAt > bCreatedAt) {
            return -1;
          } else if (aCreatedAt < bCreatedAt) {
            return 1;
          } else {
            return 0;
          }
        });
        if (type === 'notificationPage') {
          setNotifications(notifications);
        } else {
          const mappedNotification = NotificationUtils.mapNotificationItemDropdown(notifications, setNotificationsCount);
          setNotifications(mappedNotification);
        }
      }
    });
    socketService.socket.on('UPDATE_NOTIFICATION', (notificationId: string) => {
      notifications = Utils.cloneDeep(notifications);
      const notificationIndex = notifications.findIndex((item) => item._id === notificationId);
      // console.log(notifications, notificationId);
      if (notificationIndex >= 0) {
        notifications[notificationIndex].read = true;
        if (type === 'notificationPage') {
          setNotifications(notifications);
        } else {
          const mappedNotification = NotificationUtils.mapNotificationItemDropdown(notifications, setNotificationsCount);
          setNotifications(mappedNotification);
        }
      }
    });

    socketService.socket.on('DELETE_NOTIFICATION', (notificationId: string) => {
      notifications = Utils.cloneDeep(notifications);
      notifications = notifications.filter((item) => item._id !== notificationId) as unknown as INotification[] | INotificationDropdown[];
      if (type === 'notificationPage') {
        setNotifications(notifications);
      } else {
        const mappedNotification = NotificationUtils.mapNotificationItemDropdown(notifications, setNotificationsCount);
        setNotifications(mappedNotification);
      }
    });
  }

  static mapNotificationItemDropdown(notificationData: INotification[], setNotificationCount: (count: number) => void): INotification[] {
    const items: INotification[] = [];
    let unreadNotificationCount = 0;

    for (const notification of notificationData) {
      const { message, createdAt, imgId, imgVersion, gifUrl, read } = notification;
      notification.imgUrl = imgId ? Utils.generateImageUrl(imgVersion || '', imgId) : gifUrl ?? '';
      notification.topText = (notification?.topText || message) ?? '';
      notification.subText = timeAgo.transform(createdAt);
      // const item: INotificationDropdown = {
      //   _id: notification._id,
      //   topText: (notification?.topText || message) ?? '',
      //   subText: timeAgo.transform(createdAt),
      //   createdAt,
      //   username: userFrom.username,
      //   avatarColor: userFrom.avatarColor,
      //   profilePicture: userFrom.profilePicture,
      //   read,
      //   post,
      //   imgUrl: imgId ? Utils.generateImageUrl(imgVersion || '', imgId) : gifUrl ?? '',
      //   comment,
      //   reaction,
      //   senderName: userFrom.username,
      //   notificationType
      // } as INotificationDropdown;

      if (!read) {
        unreadNotificationCount++;
      }

      items.push(notification);
    }

    setNotificationCount(unreadNotificationCount);
    return items;
  }

  static async markAsRead(id: string, notification: INotification, setNotificationDialogContent: SetDialogState) {
    if (notification.notificationType !== 'follows') {
      const data = {
        post: notification.post,
        imgUrl: notification.imgUrl ?? '',
        comment: notification.comment,
        reaction: notification.reaction,
        senderName: notification.userFrom.username
      };
      setNotificationDialogContent(data);
    }
    if (notification.read) {
      return null;
    }

    const response = await notificationService.markNotificationAsRead(id);
    return response;
  }

  static socketIOMessageNotification({
    profile,
    messageNotification,
    setMessageNotification,
    setMessageCount,
    dispatch
  }: ISocketIOMessageNotification) {
    socketService.socket.on('MESSAGE_RECEIVED', (data: IMessageList) => {
      const clonedMessageNotification = Utils.cloneDeep(messageNotification) as IMessageList[];
      if (data.receiverUsername === profile.username) {
        const notificationData: IMessageList = {
          senderId: data.senderId,
          senderUsername: data.senderUsername,
          senderAvatarColor: data.senderAvatarColor,
          senderProfilePicture: data.senderProfilePicture,
          receiverId: data.receiverId,
          receiverUsername: data.receiverUsername,
          receiverAvatarColor: data.receiverAvatarColor,
          receiverProfilePicture: data.receiverProfilePicture,
          messageId: data._id,
          conversationId: data.conversationId,
          body: data.body,
          isRead: data.isRead
        } as unknown as IMessageList;

        const messageIndex = clonedMessageNotification.findIndex((msg) => msg.conversationId === data.conversationId);

        if (messageIndex > -1) {
          clonedMessageNotification.splice(messageIndex, 1);
        }
        clonedMessageNotification.unshift(notificationData);
        const sum = clonedMessageNotification.reduce((acc: number, cur: IMessageList) => {
          if (!cur.isRead && cur.receiverUsername === profile?.username) {
            acc += 1;
          }
          return acc;
        }, 0);
        setMessageCount(sum);
        if (!Utils.checkUrl(window.location.pathname, 'chat')) {
          Utils.dispatchNotification('You have new messages', 'success', dispatch);
        }
        setMessageNotification(clonedMessageNotification);
      }
    });
  }
  static cleanup() {
    socketService.socket?.off('INSERT_NOTIFICATION');
    socketService.socket?.off('UPDATE_NOTIFICATION');
    socketService.socket?.off('DELETE_NOTIFICATION');
    socketService.socket?.off('MESSAGE_RECEIVED');
  }
}

type SetDialogState = React.Dispatch<React.SetStateAction<INotificationPreview>>;

interface ISocketIOMessageNotification {
  profile: IUser;
  messageNotification: IMessageList[];
  setMessageNotification: SetState<IMessageList[]>;
  setMessageCount: SetState<number>;
  dispatch: AppDispatch;
  location?: Location;
}
