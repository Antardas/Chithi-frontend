import { createBrowserRouter } from 'react-router-dom';
import { AuthTabs, ForgetPassword, ResetPassword } from '~/pages/auth';
import Streams from '~/pages/social/Streams';
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
    path: '/app/social/streams',
    element: <Streams />
  }
]);

export default router;
