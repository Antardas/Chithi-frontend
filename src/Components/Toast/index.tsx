import '~/Components/Toast/Toast.scss';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Utils } from '~/services/utils/utils.service';
import { useAppDispatch } from '~/redux/store';

const Toast = (props: IToastProps) => {
  const { toastList, position, autoDelete, autoDeleteTime = 2000 } = props;

  const [list, setList] = useState(toastList);
  const listDataRef = useRef([]);
  const dispatch = useAppDispatch();

  const deleteToast = useCallback(() => {
    listDataRef.current = Utils.cloneDeep(list);
    const removedItem = listDataRef.current.splice(0, 1);
    console.log(listDataRef, removedItem);

    setList([...listDataRef.current]);
    if (!listDataRef.current.length) {
      list.length = 0;
      Utils.dispatchClearNotification(dispatch);
    }
  }, [list]);

  useEffect(() => {
    setList([...toastList]);
  }, [toastList]);

  useEffect(() => {
    const tick = () => {
      console.log('Interval Called');
      deleteToast();
    };
    let interval: ReturnType<typeof setInterval>;
    if (autoDelete && toastList && toastList.length && list.length) {
      interval = setInterval(tick, autoDeleteTime);
      return () => clearInterval(interval);
    }
  }, [autoDelete, toastList, list, deleteToast, autoDeleteTime]);

  return (
    <div className={`toast-notification-container ${position}`}>
      {list.map((toast, index) => (
        <div
          data-testid="toast-notification"
          key={index}
          className={`toast-notification toast ${position} `}
          style={{
            backgroundColor: toast.backgroundColor
          }}
        >
          <button className="cancel-button" onClick={() => deleteToast()}>
            X
          </button>
          <div className={`toast-notification-image ${toast.description.length <= 73 ? 'toast-icon' : ''}`}>
            <img src={toast.icon} alt="" />
          </div>
          <div className={`toast-notification-message ${toast.description.length <= 73 ? 'toast-message' : ''}`}>{toast.description} </div>
        </div>
      ))}
    </div>
  );
};

export default Toast;

export type NotificationType = 'success' | 'error' | 'info' | 'warning';
export interface IToastItem {
  backgroundColor: string;
  description: string;
  icon: string;
  id: number | string;
  type: NotificationType;
}

interface IToastProps {
  toastList: Array<IToastItem>;
  position: string;
  autoDelete: boolean;
  autoDeleteTime?: number;
}
