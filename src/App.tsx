import { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import '~/App.scss';
import router from '~/routes';
import { socketService } from './services/socket/sokcet.service';

function App(): JSX.Element {
  useEffect(() => {
    socketService.setupSocketConnection();
  }, []);
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
