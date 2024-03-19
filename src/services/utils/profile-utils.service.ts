import { createSearchParams } from 'react-router-dom';
import { IUser } from '~/types/user';

export class ProfileUtils {
  static navigateToProfile(data: IUser, navigate: (url: string) => void) {
    const url = `/app/social/profile/${data?.username}?${createSearchParams({
      id: `${data?._id ?? ''}`,
      uId: `${data?.uId ?? ''}`
    })}`;
    navigate(url);
  }
}
