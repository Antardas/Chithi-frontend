import { createSlice } from '@reduxjs/toolkit';
import { IToastItem } from '~/Components/Toast';
import checkIcon from '~/assets/images/check.svg';
import infoIcon from '~/assets/images/info.svg';
import warningIcon from '~/assets/images/warning.svg';
import errorIcon from '~/assets/images/error.svg';
import { Utils } from '~/services/utils/utils.service';

const initialState: IToastItem[] = [];
let list: IToastItem[] = [];

const notifications: INotificationMap = {
  success: {
    id: 1,
    description: 'This is success message',
    type: 'success',
    icon: checkIcon,
    backgroundColor: '#5cb85c'
  },
  error: {
    id: 2,
    description: 'This is error message',
    type: 'error',
    icon: errorIcon,
    backgroundColor: '#d9534f'
  },
  info: {
    id: 3,
    description: 'This is info message',
    type: 'info',
    icon: infoIcon,
    backgroundColor: '#5bc0de'
  },
  warning: {
    id: 3,
    description: 'This is warning message',
    type: 'warning',
    icon: warningIcon,
    backgroundColor: '#f0ad4e'
  }
};

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    addNotification: (state, action) => {
      try {
        const { message, type } = action.payload;
        const notification = Utils.cloneDeep(notifications[type]);
        notification['description'] = '';
        notification.description = message;
        notification.id = state.length;
        list = Utils.cloneDeep(list);
        list.unshift(notification);
        // list = [...Utils.uniqueByKey(list, 'description')];
        state = list;
        return list;
      } catch (error) {
        console.log(error);
      }
    },

    clearNotification: () => {
      list = [];
      return list;
    }
  }
});

export const { addNotification, clearNotification } = notificationSlice.actions;
export default notificationSlice.reducer;

interface INotificationMap {
  [type: string]: IToastItem;
}
