import { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import '~/App.scss';
import router from '~/routes';
import { socketService } from './services/socket/sokcet.service';
import Toast, { IToastItem } from '~/Components/Toast';
import checkIcon from '~/assets/images/check.svg';
import infoIcon from '~/assets/images/info.svg';
import warningIcon from '~/assets/images/warning.svg';
import errorIcon from '~/assets/images/error.svg';
import { useSelector } from 'react-redux';
import { RootState } from './redux/store';
function App(): JSX.Element {
  const notifications = useSelector((state:RootState) => state.notification);
  useEffect(() => {
    socketService.setupSocketConnection();
  }, []);
  return (
    <>
      {notifications && notifications.length? <Toast toastList={notifications} position="top-right" autoDelete={true} /> : null}
      <RouterProvider router={router} />
    </>
  );
}

export default App;
