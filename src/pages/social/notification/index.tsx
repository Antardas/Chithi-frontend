import { AxiosError, isAxiosError } from 'axios';
import React, { useCallback, useEffect, useState } from 'react';
import { FaCircle, FaRegCircle, FaRegTrashAlt } from 'react-icons/fa';
import Avatar from '~/Components/Avatar';
import useEffectOnce from '~/hooks/useEffectOnce';
import { RootState, useAppDispatch } from '~/redux/store';
import { notificationService } from '~/services/api/notification/notification.service';
import { Utils } from '~/services/utils/utils.service';
import { IError } from '~/types/axios';
import { INotification, INotificationPreview } from '~/types/notification';
import '~/pages/social/notification/Notifications.scss';
import { NotificationUtils } from '~/services/utils/notification-utils.service';
import { useSelector } from 'react-redux';
import { IUser } from '~/types/user';
import NotificationPreview from '~/Components/Dialog/NotificationPreview';
const Notifications = () => {
  const [notifications, setNotifications] = useState<INotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [notificationDialogContent, setNotificationDialogContent] = useState<INotificationPreview>({
    post: '',
    imgUrl: '',
    comment: '',
    reaction: '',
    senderName: ''
  });
  const { profile } = useSelector((state: RootState) => state.user);
  const dispatch = useAppDispatch();

  const getUserNotifications = useCallback(async () => {
    setLoading(true);
    try {
      const response = await notificationService.getUserNotifications();
      setNotifications(response.data.data);
    } catch (error) {
      if (isAxiosError(error)) {
        const typedError: AxiosError<IError> = error;
        Utils.dispatchNotification(typedError.message, 'error', dispatch);
      }
    }
    setLoading(false);
  }, [dispatch]);

  const markAsRead = async (notification: INotification) => {
    try {
      const response = await NotificationUtils.markAsRead(notification._id, notification, setNotificationDialogContent);
      Utils.dispatchNotification(response.data.message, 'success', dispatch);
    } catch (error) {
      if (isAxiosError(error)) {
        const typedError: AxiosError<IError> = error;
        Utils.dispatchNotification(typedError.message, 'error', dispatch);
      }
    }
  };

  const deleteNotification = useCallback(
    async (notificationId: string) => {
      setLoading(true);
      try {
        const response = await notificationService.deleteNotification(notificationId);
        Utils.dispatchNotification(response.data.message, 'success', dispatch);
      } catch (error) {
        if (isAxiosError(error)) {
          const typedError: AxiosError<IError> = error;
          Utils.dispatchNotification(typedError.message, 'error', dispatch);
        }
      }
      setLoading(false);
    },
    [dispatch]
  );


  useEffectOnce(() => {
    getUserNotifications();
  });

  useEffect(() => {
    NotificationUtils.socketIONotifications(profile as IUser, notifications, setNotifications, 'notificationPage', () => {});
    return () => {
      NotificationUtils.cleanup();
    };
  }, [notifications, profile]);


  return (
    <div>
      {' '}
      {notificationDialogContent?.senderName ? (
        <NotificationPreview
          title="Your Post"
          post={notificationDialogContent.post}
          comment={notificationDialogContent.comment}
          imgUrl={notificationDialogContent.imgUrl}
          reaction={notificationDialogContent.reaction}
          senderName={notificationDialogContent.senderName}
          secondButtonText={'Close'}
          secondBtnHandler={() => {
            setNotificationDialogContent({ post: '', imgUrl: '', comment: '', reaction: '', senderName: '' });
          }}
        />
      ) : null}
      <div className="notifications-container">
        <div className="notifications">Notifications</div>
        <div className={notifications.length ? 'notifications-box' : ''}>
          {notifications.map((notification, index) => (
            <div className="notification-box" data-testid="notification-box" key={index} onClick={() => markAsRead(notification)}>
              <div className="notification-box-sub-card">
                <div className="notification-box-sub-card-media">
                  <div className="notification-box-sub-card-media-image-icon">
                    <Avatar
                      name={notification?.userFrom?.username}
                      bgColor={notification?.userFrom?.avatarColor}
                      textColor="#ffffff"
                      size={40}
                      avatarSrc={notification?.userFrom?.profilePicture}
                    />
                  </div>
                  <div className="notification-box-sub-card-media-body">
                    <h6 className="title">
                      {notification?.message}
                      <small
                        data-testid="subtitle"
                        className="subtitle"
                        onClick={(e) => {
                          e.preventDefault();
                          deleteNotification(notification._id);
                        }}
                      >
                        <FaRegTrashAlt className="trash" />
                      </small>
                    </h6>
                    <div className="subtitle-body">
                      <small className="subtitle">{!notification?.read ? <FaCircle className="icon" /> : <FaRegCircle className="icon" />}</small>
                      <p className="subtext">1 hr ago</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* <div className="notifications-box"></div> */}
        {!loading && !notifications.length ? (
          <h3 className="empty-page" data-testid="empty-page">
            You have no notification
          </h3>
        ) : null}
      </div>
    </div>
  );
};

export default Notifications;
