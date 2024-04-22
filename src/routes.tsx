/* eslint-disable react-refresh/only-export-components */
import { createBrowserRouter } from 'react-router-dom';
import { AuthTabs, ForgetPassword, ResetPassword } from '~/pages/auth';
// import Social from '~/pages/social';
// import Streams from '~/pages/social/Streams';
// import Chat from '~/pages/social/chat';
// import Peoples from '~/pages/social/peoples';
// import Followers from '~/pages/social/followers';
// import Followings from '~/pages/social/followings';
// import Photos from '~/pages/social/photos';
// import Notifications from '~/pages/social/notification';
// import Profiles from '~/pages/social/profiles';
import ProtectedRoutes from '~/pages/ProtectedRoutes';
import Error from '~/pages/Error';
import { Suspense, lazy } from 'react';
import StreamSkeleton from '~/pages/social/Streams/StreamSkeleton';
import NotificationSkeleton from '~/pages/social/notification/NotificationSkeleton';
import CardSkeleton from './Components/CardElement/CardSkeleton';
import PhotosSkeleton from './pages/social/photos/PhotosSkeleton';

const Social = lazy(() => import('~/pages/social'));
const Streams = lazy(() => import('~/pages/social/Streams'));
const Chat = lazy(() => import('~/pages/social/chat'));
const Peoples = lazy(() => import('~/pages/social/peoples'));
const Followers = lazy(() => import('~/pages/social/followers'));
const Followings = lazy(() => import('~/pages/social/followings'));
const Photos = lazy(() => import('~/pages/social/photos'));
const Notifications = lazy(() => import('~/pages/social/notification'));
const Profiles = lazy(() => import('~/pages/social/profiles'));
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
        element: (
          <Suspense fallback={<StreamSkeleton />}>
            <Streams />
          </Suspense>
        )
      },
      {
        path: 'chat/messages',
        element: <Chat />
      },
      {
        path: 'people',
        element: (
          <Suspense fallback={<CardSkeleton />}>
            <Peoples />
          </Suspense>
        )
      },
      {
        path: 'followers',
        element: (
          <Suspense fallback={<CardSkeleton />}>
            {' '}
            <Followers />
          </Suspense>
        )
      },
      {
        path: 'following',
        element: (
          <Suspense fallback={<CardSkeleton />}>
            <Followings />
          </Suspense>
        )
      },
      {
        path: 'photos',
        element: (
          <Suspense fallback={<PhotosSkeleton/>}>
            <Photos />
          </Suspense>
        )
      },
      {
        path: 'notifications',
        element: (
          <Suspense fallback={<NotificationSkeleton />}>
            <Notifications />
          </Suspense>
        )
      },
      {
        path: 'profile/:username',
        element: (
          <Suspense fallback={<CardSkeleton />}>
            <Profiles />
          </Suspense>
        )
      }
    ]
  },
  {
    path: '*',
    element: <Error />
  }
]);

export default router;
