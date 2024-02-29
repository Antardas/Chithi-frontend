import { createBrowserRouter } from 'react-router-dom';
import { AuthTabs, ForgetPassword, ResetPassword } from './pages/auth';
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
  {}
]);

export default router;
