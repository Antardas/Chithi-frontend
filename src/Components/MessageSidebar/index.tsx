import doubleCheckmark from '~/assets/images/double-checkmark.png';
import Avatar from '~/Components/Avatar';
import { FaCheck, FaCircle } from 'react-icons/fa';

import '~/Components/MessageSidebar/MessageSidebar.scss';
import { Utils } from '~/services/utils/utils.service';
import { IUser } from '~/types/user';
// import { INotification } from '~/types/notification';
import { IMessageData } from '~/types/message';
import { IMessageList } from '~/types/chat';
interface MessageSidebarProps {
  profile: IUser; // Optional: Add specific properties if known
  messageCount: number;
  messageNotifications: Array<IMessageList>; // Optional: Refine type based on notification structure
  openChatPage: (notification: IMessageData) => void;
}
const MessageSidebar = ({ profile, messageCount, messageNotifications, openChatPage }: MessageSidebarProps) => {
  return (
    <div className="message-dropdown" data-testid="message-sidebar" key={'message-sidebar'}>
      <div className="message-card">
        <div className="message-card-body">
          <div className="message-bg-primary">
            <h5 className="text-white">
              Messages
              {messageCount > 0 && <small className="message-count">{messageCount}</small>}
            </h5>
          </div>

          <div className="message-card-body-info">
            <div data-testid="info-container" className="message-card-body-info-container">
              {messageNotifications.map((notification) => (
                <div className="message-sub-card" key={notification._id} onClick={() => openChatPage(notification)}>
                  <div className="content-avatar">
                    <Avatar
                      name={notification.receiverUsername === profile?.username ? profile?.username : notification?.senderUsername}
                      bgColor={
                        notification.receiverUsername === profile?.username ? notification.receiverAvatarColor : notification?.senderAvatarColor
                      }
                      textColor="#ffffff"
                      size={40}
                      avatarSrc={
                        notification.receiverUsername !== profile?.username ? notification.receiverProfilePicture : notification?.senderProfilePicture
                      }
                    />
                  </div>
                  <div className="content-body">
                    <h6 className="title">
                      {notification.receiverUsername !== profile?.username ? notification.receiverUsername : notification.senderUsername}
                    </h6>
                    <p className="subtext">{notification?.body ? notification?.body : notification?.message}</p>
                  </div>
                  <div className="content-icons">
                    {!notification?.isRead ? (
                      <>
                        {notification.receiverUsername === profile?.username ? (
                          <FaCircle className="circle" />
                        ) : (
                          <FaCheck className="circle not-read" />
                        )}
                      </>
                    ) : (
                      <>{notification.senderUsername === profile?.username && <img src={doubleCheckmark} alt="" className="circle read" />}</>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageSidebar;
