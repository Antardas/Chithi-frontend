import React, { useEffect, useState, useRef, useCallback } from 'react';
import { FaCaretDown, FaCaretUp, FaRegBell, FaRegEnvelope } from 'react-icons/fa';
import logo from '~/assets/images/logo.svg';
import '~/Components/Header/Header.scss';
import Avatar from '~/Components/Avatar';
import { Utils } from '~/services/utils/utils.service';
import useDetectOutsideClick from '~/hooks/useDetectOutsideClick';
import MessageSidebar from '~/Components/MessageSidebar';
import { INotification, INotificationDropdown } from '~/types/notification';
import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '~/redux/store';
import Dropdown from '~/Components/Dropdown';
import { IUser } from '~/types/user';
import { ISettingsDropdown } from '~/types/utils';
import useEffectOnce from '~/hooks/useEffectOnce';
import { ProfileUtils } from '~/services/utils/profile-utils.service';
import { useNavigate } from 'react-router-dom';
import { userService } from '~/services/api/user/user.service';
import useLocalStorage from '~/hooks/useLocalStorage';
import useSessionStorage from '~/hooks/useSessionStorage';
import HeaderSkeleton from '~/Components/Header/HeaderSkeleton';
import { AxiosError, isAxiosError } from 'axios';
import { IError } from '~/types/axios';
import { notificationService } from '~/services/api/notification/notification.service';
import { NotificationUtils } from '~/services/utils/notification-utils.service';
import NotificationPreview from '../Dialog/NotificationPreview';
import { IMessageData } from '~/types/message';
import { socketService } from '~/services/socket/sokcet.service';

// TODO: fix the types issue
const Header = () => {
  // State and Hooks
  const { profile } = useSelector((state: RootState) => state.user);
  const { socketConnected } = useSelector((state: RootState) => state.app);
  const [environment, setEnvironment] = useState<string>('');
  const [settings, setSettings] = useState<ISettingsDropdown[]>([]);
  const [notifications, setNotifications] = useState<INotification[]>([]);
  const [notificationCount, setNotificationCount] = useState<number>(0);
  const [notificationDialogContent, setNotificationDialogContent] = useState({
    post: '',
    imgUrl: '',
    comment: '',
    reaction: '',
    senderName: ''
  });
  const messageRef = useRef(null);
  const notificationRef = useRef(null);
  const settingsRef = useRef(null);
  const [isMessageActive, setIsMessageActive] = useDetectOutsideClick(messageRef, false);
  const [isNotificationActive, setIsNotificationActive] = useDetectOutsideClick(notificationRef, false);
  const [isSettingsActive, setIsSettingsActive] = useDetectOutsideClick(settingsRef, false);
  const backgroundColor = `${environment === 'DEV' ? '#50b5ff' : environment === 'STG' ? '#e9710f' : ''}`;
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [username, _setUsername, deleteUsername] = useLocalStorage('username');
  const [, setLoggedIn] = useLocalStorage('keepLoggedIn');
  const [, , deletePageReload] = useSessionStorage('pageReload');

  const getUserNotifications = useCallback(async () => {
    try {
      const response = await notificationService.getUserNotifications();
      const notificationsForDropdownItem = NotificationUtils.mapNotificationItemDropdown(response.data.data, setNotificationCount);
      setNotifications(notificationsForDropdownItem);
    } catch (error) {
      if (isAxiosError(error)) {
        const typedError: AxiosError<IError> = error;
        Utils.dispatchNotification(typedError.message, 'error', dispatch);
      }
    }
  }, [dispatch]);

  const onMarkAsRead = async (notification: INotificationDropdown) => {
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

  const onDeleteNotification = useCallback(
    async (notificationId: string) => {
      try {
        const response = await notificationService.deleteNotification(notificationId);
        Utils.dispatchNotification(response.data.message, 'success', dispatch);
      } catch (error) {
        if (isAxiosError(error)) {
          const typedError: AxiosError<IError> = error;
          Utils.dispatchNotification(typedError.message, 'error', dispatch);
        }
      }
    },
    [dispatch]
  );

  const openChatPage = (notification: IMessageData) => {};
  const onLogout = async () => {
    try {
      Utils.clearStore({
        dispatch,
        removeSessionPageReload: deletePageReload,
        removeStorageUsername: deleteUsername,
        setLoggedIn
      });

      await userService.logoutUser();
      Utils.dispatchNotification('Log Out Successful', 'success', dispatch);
      navigate('/');
    } catch (error) {
      console.log(error);
      if (isAxiosError(error)) {
        const typedError: AxiosError<IError> = error;
        Utils.dispatchNotification(typedError?.response?.data?.message || 'Something went wrong', 'error', dispatch);
      } else {
        Utils.dispatchNotification('Something went wrong', 'error', dispatch);
      }
    }
    await userService.logoutUser();
  };

  useEffect(() => {
    const env = Utils.appEnvironment();
    setEnvironment(env);
  }, []);

  useEffectOnce(() => {
    Utils.mapSettingsDropDownItems(setSettings);
    getUserNotifications();
  });

  // For sending the User is Online Or Offline
  useEffect(() => {
    if (socketConnected) {
      socketService.socket.emit('SETUP', { userId: username });
    }
  }, [socketConnected, username]);

  useEffect(() => {
    if (socketConnected) {
      NotificationUtils.socketIONotifications(profile as IUser, notifications, setNotifications, 'header', setNotificationCount);
      return () => {
        NotificationUtils.cleanup();
      };
    }
  }, [notifications, profile, socketConnected]);
  // All Utility and extra function

  if (!profile) {
    return <HeaderSkeleton />;
  }
  return (
    <div>
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
      <div className="header-nav-wrapper" data-testid="header-wrapper">
        {isMessageActive ? (
          <div ref={messageRef}>
            <MessageSidebar profile={profile as IUser} messageCount={0} messageNotifications={[]} openChatPage={openChatPage} />
          </div>
        ) : null}
        <div className="header-navbar">
          <div
            className="header-image"
            data-testid="header-image"
            onClick={() => {
              navigate('/app/social/streams');
            }}
          >
            <img src={logo} className="img-fluid" alt="" />
            <div className="app-name">
              Chithi
              {environment ? (
                <span
                  style={{
                    backgroundColor: backgroundColor
                  }}
                  className="environment"
                >
                  DEV
                </span>
              ) : (
                ''
              )}
            </div>
          </div>
          <div className="header-menu-toggle">
            <span className="bar"></span>
            <span className="bar"></span>
            <span className="bar"></span>
          </div>
          <ul className="header-nav">
            <li className="header-nav-item active-item">
              <span
                className="header-list-name"
                onClick={() => {
                  setIsNotificationActive(true);
                  // setIsMessageActive(false);
                  // setIsSettingsActive(false);
                }}
              >
                <FaRegBell className="header-list-icon" />
                <span className="bg-danger-dots dots" data-testid="notification-dots">
                  5
                </span>
              </span>
              {isNotificationActive ? (
                <ul className="dropdown-ul" ref={notificationRef}>
                  <li className="dropdown-li">
                    <Dropdown
                      height={300}
                      style={{
                        right: '250px',
                        top: '20px'
                      }}
                      data={notifications as ISettingsDropdown[]}
                      notificationCount={notificationCount}
                      title="Notifications"
                      onMarkAsRead={onMarkAsRead}
                      onDeleteNotification={onDeleteNotification}
                      // onLogout={}
                    />
                  </li>
                </ul>
              ) : null}
              &nbsp;
            </li>
            <li
              className="header-nav-item active-item"
              onClick={() => {
                setIsMessageActive(true);
                // setIsNotificationActive(false);
                // setIsSettingsActive(false);
              }}
            >
              <span className="header-list-name">
                <FaRegEnvelope className="header-list-icon" />
                <span className="bg-danger-dots dots" data-testid="messages-dots"></span>
              </span>
              &nbsp;
            </li>
            <li
              className="header-nav-item"
              onClick={() => {
                // setIsMessageActive(false);
                // setIsNotificationActive(false);
                setIsSettingsActive(!isMessageActive);
              }}
            >
              <span className="header-list-name profile-image">
                <Avatar
                  name={`${profile.username ?? ''}`}
                  bgColor={profile?.avatarColor}
                  size={30}
                  textColor="#ffffff"
                  avatarSrc={profile?.profilePicture}
                />
              </span>
              <span className="header-list-name profile-name">
                {profile?.username ?? ''}
                {!isSettingsActive ? <FaCaretDown className="header-list-icon caret" /> : <FaCaretUp className="header-list-icon caret" />}
              </span>

              {isSettingsActive ? (
                <ul className="dropdown-ul" ref={settingsRef}>
                  <li className="dropdown-li">
                    <Dropdown
                      height={300}
                      style={{
                        right: '150px',
                        top: '40px'
                      }}
                      data={settings}
                      title="Settings"
                      onLogout={onLogout}
                      onNavigate={() => {
                        if (profile) {
                          ProfileUtils.navigateToProfile(profile, navigate);
                        }
                      }}
                    />
                  </li>
                </ul>
              ) : null}
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Header;
