import { AxiosResponse, AxiosError, isAxiosError } from 'axios';
import { NotificationType } from '~/Components/Toast';
import { SetValue, RemoveValue } from '~/hooks/useLocalStorage';
import { addNotification, clearNotification } from '~/redux/reducers/notification/notification.reducer';
import { addUser, clearUser } from '~/redux/reducers/user/user.reducer';
import { AppDispatch } from '~/redux/store';
import { DefaultAvatarImageDataUrl, avatarColors } from '~/services/utils/static.data';
import { IFollower } from '~/types/follower';
import { ISignUpResponse, IUser } from '~/types/user';
import { ISettingsDropdown } from '~/types/utils';
import { IError } from '~/types/axios';
interface IClearStoreParams {
  dispatch: AppDispatch;
  removeStorageUsername: RemoveValue;
  removeSessionPageReload: RemoveValue;
  setLoggedIn: (value: string) => void;
}
export class Utils {
  static avatarColor() {
    const colorsIndex = Math.floor(Math.random() * avatarColors.length);
    const color: string = avatarColors[colorsIndex];
    return color;
  }

  static generateAvatar(text: string, background: string, foreground: string = 'white'): string {
    const canvas = document.createElement('canvas');
    canvas.width = 200;
    canvas.height = 200;
    const context = canvas.getContext('2d');
    if (context) {
      context.fillStyle = background;
      context?.fillRect(0, 0, canvas.width, canvas.height);

      // Draw the text
      context.font = 'normal 80px sans-serif';
      context.fillStyle = foreground;
      context.textAlign = 'center';
      context.textBaseline = 'middle';
      context.fillText(text, canvas.width / 2, canvas.height / 2);

      return canvas.toDataURL('image/png');
    } else {
      return DefaultAvatarImageDataUrl;
    }
  }

  static dispatchUser = (
    result: AxiosResponse<ISignUpResponse>,
    pageReload: SetValue,
    dispatch: AppDispatch,
    setUser: React.Dispatch<React.SetStateAction<IUser | null>>
  ) => {
    pageReload(JSON.stringify(true));
    dispatch(addUser({ token: result.data.token, profile: result.data.user }));
    setUser(result.data.user);
  };

  static dispatchNotification(message: string, type: NotificationType, dispatch: AppDispatch): void {
    dispatch(
      addNotification({
        message,
        type
      })
    );
  }
  static dispatchClearNotification(dispatch: AppDispatch): void {
    dispatch(clearNotification());
  }

  static clearStore({ dispatch, removeStorageUsername, removeSessionPageReload, setLoggedIn }: IClearStoreParams) {
    dispatch(clearUser());
    dispatch(clearNotification());
    removeStorageUsername();
    removeSessionPageReload();
    setLoggedIn(JSON.stringify(false));
  }

  static appEnvironment(): string {
    const env = import.meta.env.VITE_ENVIRONMENT;
    if (env === 'development') {
      return 'DEV';
    } else if (env === 'production') {
      return '';
    } else {
      return 'STG';
    }
  }

  static mapSettingsDropDownItems(setSettings: (items: Array<ISettingsDropdown>) => void): ISettingsDropdown[] {
    const items = [];
    const item = {
      topText: 'My Profile',
      subText: 'View personal profile'
    };

    items.push(item);

    setSettings(items);
    return items;
  }

  static generateString = (len: number) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    let result = ' ';
    const charactersLength = characters.length;
    for (let i = 0; i < len; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
  };

  static cloneDeep(item: object | Array<unknown>) {
    return JSON.parse(JSON.stringify(item));
  }

  // TODO:Use the Generic for better type
  static uniqueByKey<T>(items: T[], key: keyof T): T[] {
    return [...new Map(items.map((item: T) => [item[key], item])).values()];
  }

  static generateImageUrl(version: string, public_id: string): string {
    version = version.replace(/['"]+/g, '');
    public_id = public_id.replace(/['"]+/g, '');
    return `https://res.cloudinary.com/${import.meta.env.VITE_CLOUD_NAME}/image/upload/v${version}/${public_id}`;
  }

  static checkIfUserIsBlocked(blocked: string[], userId: string) {
    return blocked.some((id) => id === userId);
  }
  static checkIfUserIsFollowed(followers: string[], postCreatorId: string, userId: string) {
    return followers.some((id) => id === postCreatorId || postCreatorId === userId);
  }

  static checkIfUserIsOnline(username: string, onlineUsers: string[]) {
    return onlineUsers.some((item) => item && item.toLowerCase() === username && username.toLowerCase());
  }

  static firstLatterUpperCase(word: string): string {
    if (!word) {
      return '';
    }

    return `${word.charAt(0).toUpperCase()}${word.slice(1)}`;
  }

  static checkUrl(url: string, word: string) {
    return url.includes(word);
  }

  static addErrorNotification(error: unknown, dispatch: AppDispatch) {
    if (isAxiosError(error)) {
      const typedError: AxiosError<IError> = error;
      const message = typedError?.response?.data?.message || 'Something went wrong';
      Utils.dispatchNotification(message, 'error', dispatch);
    } else {
      Utils.dispatchNotification((error as Error).message || 'Something went wrong', 'error', dispatch);
    }
  }
}
