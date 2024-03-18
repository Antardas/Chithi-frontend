import { createBrowserRouter } from 'react-router-dom';
import { AuthTabs, ForgetPassword, ResetPassword } from '~/pages/auth';
import Social from '~/pages/social';
import Streams from '~/pages/social/Streams';
import Chat from '~/pages/social/chat';
import Peoples from '~/pages/social/peoples';
import Followers from '~/pages/social/followers';
import Followings from '~/pages/social/followings';
import Photos from '~/pages/social/photos';
import Notifications from '~/pages/social/notification';
import Profiles from '~/pages/social/profiles';
import ProtectedRoutes from '~/pages/ProtectedRoutes';
const router = createBrowserRouter([
  {
    path: '/',
    element: <AuthTabs />
  },
  {
    path: '/forget-password',
    element: <ForgetPassword />
  },
  {
    path: '/reset-password',
    element: <ResetPassword />
  },
  {
    path: '/app/social',
    element: (
      <ProtectedRoutes>
        <Social />
      </ProtectedRoutes>
    ),
    children: [
      {
        path: 'streams',
        element: <Streams />
      },
      {
        path: 'chat/messages',
        element: <Chat />
      },
      {
        path: 'people',
        element: <Peoples />
      },
      {
        path: 'followers',
        element: <Followers />
      },
      {
        path: 'following',
        element: <Followings />
      },
      {
        path: 'photos',
        element: <Photos />
      },
      {
        path: 'notifications',
        element: <Notifications />
      },
      {
        path: 'profile/:username',
        element: <Profiles />
      }
    ]
  }
]);

export default router;
