import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import '~/Components/NotificationSetting/NotificationSetting.scss';
import { RootState, useAppDispatch } from '~/redux/store';
import { userService } from '~/services/api/user/user.service';
import { notificationItems } from '~/services/utils/static.data';
import { Utils } from '~/services/utils/utils.service';
import { INotificationType } from '~/types/notification';
import Button from '../Button';
import Toggle from '../Toggle';
import { INotificationSettings, IUser } from '~/types/user';
import { updaterUserProfile } from '~/redux/reducers/user/user.reducer';
const NotificationSetting = () => {
  const { profile } = useSelector((state: RootState) => state.user);
  const [notificationTypes, setNotificationTypes] = useState<INotificationType[]>([]);
  const [profileNotificationSettings, setProfileNotificationSettings] = useState(profile?.notifications);
  const dispatch = useAppDispatch();
  const mapNotificationTypesToggle = useCallback(
    (notifications: INotificationType[]) => {
      if (profileNotificationSettings) {
        for (const notification of notifications) {
          const toggled = profileNotificationSettings[notification.type];
          notification.toggle = toggled;
        }
      }

      setNotificationTypes(notifications);
    },
    [profileNotificationSettings]
  );

  const updateNotificationTypesToggle = (itemIndex: number) => {
    const updatedData = notificationTypes.map((item, index) => {
      if (index === itemIndex) {
        return {
          ...item,
          toggle: !item.toggle
        };
      }
      return item;
    });
    setNotificationTypes(updatedData);
  };

  const sendNotificationSettings = async () => {
    try {
      const response = await userService.updateNotificationSettings(profileNotificationSettings as INotificationSettings);
      const clonedProfile = Utils.cloneDeep(profile as IUser) as IUser;
      clonedProfile.notifications = response.data.data;
      dispatch(updaterUserProfile(clonedProfile));
      Utils.dispatchNotification(response.data.message, 'success', dispatch);
    } catch (error) {
      Utils.addErrorNotification(error, dispatch);
    }
  };

  useEffect(() => {
    mapNotificationTypesToggle(notificationItems);
  }, [mapNotificationTypesToggle]);
  useEffect(() => {
    console.log("profileNotificationSettings", profileNotificationSettings);

  }, [profileNotificationSettings])
  return (
    <>
      <div className="notification-settings">
        {notificationTypes.map((data, index) => (
          <div className="notification-settings-container" key={`toggle-container-${data.index}`} data-testid="notification-settings-item">
            <div className="notification-settings-container-sub-card">
              <div className="notification-settings-container-sub-card-body">
                <h6 className="title">{`${data.title}`}</h6>
                <div className="subtitle-body">
                  <p className="subtext">{data.description}</p>
                </div>
              </div>
              <div className="toggle" data-testid="toggle-container">
                <Toggle
                  key={`toggle-item-${index}`}
                  toggle={data.toggle}
                  onClick={(event) => {
                    const newNotificationSettings = Utils.cloneDeep(profileNotificationSettings as INotificationSettings) as INotificationSettings;
                    newNotificationSettings[data.type] = !newNotificationSettings[data.type];
                    console.log('🚀 ~ NotificationSetting ~ toggled:',   newNotificationSettings[data.type], index );
                    setProfileNotificationSettings(newNotificationSettings);
                    updateNotificationTypesToggle(index);
                  }}
                />
              </div>
            </div>
          </div>
        ))}
        <div className="btn-group">
          <Button label="Update" className="update" disabled={false} handleClick={sendNotificationSettings} />
        </div>
      </div>
      <div style={{ height: '1px' }}></div>
    </>
  );
};

export default NotificationSetting;
