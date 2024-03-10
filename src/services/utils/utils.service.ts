import { AxiosResponse } from 'axios';
import { SetValue, RemoveValue } from '~/hooks/useLocalStorage';
import { addUser, clearUser } from '~/redux/reducers/user/user.reducer';
import { AppDispatch } from '~/redux/store';
import { DefaultAvatarImageDataUrl, avatarColors } from '~/services/utils/static.data';
import { ISignUpResponse, IUser } from '~/types/user';

interface IClearStoreParams {
  dispatch: AppDispatch;
  removeStorageUsername: RemoveValue;
  removeSessionPageReload: RemoveValue;
  setLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
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

  static clearStore({ dispatch, removeStorageUsername, removeSessionPageReload, setLoggedIn }: IClearStoreParams) {
    dispatch(clearUser());
    removeStorageUsername();
    removeSessionPageReload();
    setLoggedIn(false);
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
}
