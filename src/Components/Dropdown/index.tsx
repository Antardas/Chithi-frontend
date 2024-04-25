import { CSSProperties } from 'react';
import Avatar from '~/Components/Avatar';
import Button from '~/Components/Button';
import { FaCircle, FaRegCircle, FaTrashAlt, FaUserAlt } from 'react-icons/fa';

import '~/Components/Dropdown/Dropdown.scss';
import { Utils } from '~/services/utils/utils.service';
import { ISettingsDropdown } from '~/types/utils';
import { INotificationDropdown } from '~/types/notification';

type TitleType = 'Notifications' | 'Settings';

interface NotificationProps {
  title: 'Notifications';
  onMarkAsRead: (item: INotificationDropdown) => Promise<void>;
  onDeleteNotification: (id: string) => void;
  notificationCount: number; // Add notificationCount here
}

interface SettingsProps {
  title: 'Settings';
  onLogout: () => void;
  onNavigate: () => void;
}

export type DropdownProps = ((NotificationProps & { title: 'Notifications' }) | (SettingsProps & { title: 'Settings' })) & {
  data: ISettingsDropdown[];
  style?: CSSProperties;
  height?: number;
};


const Dropdown = ({ data, title, style, height, ...rest }: DropdownProps) => {
  const { notificationCount, onMarkAsRead, onDeleteNotification } =
    title === 'Notifications' ? (rest as NotificationProps) : ({} as NotificationProps);
  const { onLogout, onNavigate } = title === 'Settings' ? (rest as SettingsProps) : ({} as SettingsProps);
  return (
    <div className="social-dropdown" style={style} data-testid="dropdown">
      <div className="social-card">
        <div className="social-card-body">
          <div className="social-bg-primary">
            <h5>
              {title}
              {title === 'Notifications' && notificationCount > 0 && <small className="social-count">{notificationCount}</small>}
            </h5>
          </div>

          <div className="social-card-body-info">
            <div data-testid="info-container" className="social-card-body-info-container" style={{ maxHeight: `${height}px` }}>
              {data.map((item) => (
                <div className="social-sub-card" key={Utils.generateString(10)}>

                  <div className="content-avatar">
                    {title === 'Notifications' ? (
                      <Avatar
                        name={item?.userFrom?.username || ''}
                        bgColor={item?.userFrom?.avatarColor || ''}
                        textColor="#ffffff"
                        size={40}
                        avatarSrc={item?.userFrom?.profilePicture || ''}
                      />
                    ) : (
                      <FaUserAlt className="userIcon" />
                    )}
                  </div>
                  <div
                    className="content-body"
                    onClick={() => {
                      if (title === 'Notifications') {
                        onMarkAsRead(item as INotificationDropdown);
                      } else {
                        onNavigate();
                      }
                    }}
                  >
                    <h6 className="title">{item?.topText}</h6>
                    <p className="subtext">{item?.subText}</p>
                  </div>
                  {title === 'Notifications' && (
                    <div className="content-icons">
                      <FaTrashAlt className="trash" onClick={() => onDeleteNotification(item?._id || '')} />
                      {item?.read ? <FaRegCircle className="circle" /> : <FaCircle className="circle" />}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {title === 'Settings' && (
              <div className="social-sub-button">
                <Button label="Sign out" className="button signOut" handleClick={onLogout} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dropdown;

// TODO: here make the dropdown props more dynamic using generic
// export interface DropdownProps {
//   data: ISettingsDropdown[];
//   notificationCount: number;
//   title: string;
//   style: CSSProperties;
//   height: number;
//   onMarkAsRead?: (notification: never) => void; // Optional callback function
//   onDeleteNotification?: (notification: never) => void; // Optional callback function
//   onLogout?: () => void; // Optional callback function
//   onNavigate?: (path: string) => void; // Optional callback function with optional string argument
// }
