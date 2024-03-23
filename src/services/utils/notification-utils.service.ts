import { socketService } from '~/services/socket/sokcet.service';
import { INotification, INotificationDropdown, INotificationPreview } from '~/types/notification';
import { IUser } from '~/types/user';
import { Utils } from '~/services/utils/utils.service';
import { timeAgo } from '~/services/utils/timeago.utils';
import { notificationService } from '~/services/api/notification/notification.service';
import { store } from '~/redux/store';

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
        notifications = [...data];
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

    const response = await notificationService.markNotificationAsRead(id);
    return response;
  }

  static cleanup() {
    socketService.socket?.off('INSERT_NOTIFICATION');
    socketService.socket?.off('UPDATE_NOTIFICATION');
    socketService.socket?.off('DELETE_NOTIFICATION');
  }
}

type SetDialogState = React.Dispatch<React.SetStateAction<INotificationPreview>>;
