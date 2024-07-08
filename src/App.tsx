import { RouterProvider } from 'react-router-dom';
import '~/App.scss';
import router from '~/routes';
import { socketService } from './services/socket/sokcet.service';
import Toast from '~/Components/Toast';
// import checkIcon from '~/assets/images/check.svg';
// import infoIcon from '~/assets/images/info.svg';
// import warningIcon from '~/assets/images/warning.svg';
// import errorIcon from '~/assets/images/error.svg';
import { useSelector } from 'react-redux';
import { RootState } from './redux/store';
import useEffectOnce from './hooks/useEffectOnce';
import { useEffect } from 'react';
import axiosInstance from './services/axios';
function App(): JSX.Element {
  const notifications = useSelector((state: RootState) => state.notification);
  const token = useSelector((state: RootState) => state.user.token);
  const localToken = localStorage.getItem('token');
  useEffectOnce(() => {
    socketService.setupSocketConnection();
  });
  useEffect(() => {
    axiosInstance.defaults.headers['Authorization'] = token;
    axiosInstance.defaults.headers.common['Authorization'] = token;
  }, [token,localToken]);
  return (
    <>
      {notifications && notifications.length ? <Toast toastList={notifications} position="top-right" autoDelete={true} /> : null}
      <RouterProvider router={router} />
    </>
  );
}

export default App;
