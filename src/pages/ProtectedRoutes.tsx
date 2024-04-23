import { AxiosResponse } from 'axios';
import React, { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useNavigate } from 'react-router-dom';
import useEffectOnce from '~/hooks/useEffectOnce';
import useLocalStorage from '~/hooks/useLocalStorage';
import useSessionStorage from '~/hooks/useSessionStorage';
import { getConversationList } from '~/redux/api/chat';
import { addUser } from '~/redux/reducers/user/user.reducer';
import { RootState, useAppDispatch } from '~/redux/store';
import { userService } from '~/services/api/user/user.service';
import { Utils } from '~/services/utils/utils.service';
import { ICurrentUser } from '~/types/user';

const ProtectedRoutes: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [username, setStoredUsername, removeStorageUsername] = useLocalStorage('username');
  const [loggedIn, setLoggedIn, deleteLoggedIn] = useLocalStorage('keepLoggedIn');
  const [pageReload, setPageReload, removeSessionPageReload] = useSessionStorage('pageReload');
  const dispatch = useAppDispatch();
  const { profile, token } = useSelector((state: RootState) => state.user);
  const navigate = useNavigate();
  const checkUser = useCallback(async () => {
    try {
      const response: AxiosResponse<ICurrentUser> = await userService.currentUser();
      //TODO dispatch the conversation list
      dispatch(
        addUser({
          token: response.data.token,
          profile: response.data.user
        })
      );
      dispatch(getConversationList())
    } catch (error) {
      console.log(error);
      setTimeout(async () => {
        Utils.clearStore({
          dispatch,
          removeSessionPageReload,
          setLoggedIn,
          removeStorageUsername
        });

        await userService.logoutUser();
        navigate('/');
      }, 1000);
    }
  }, [removeSessionPageReload, removeStorageUsername, setLoggedIn, dispatch, navigate]);

  useEffectOnce( async() => {
    await checkUser();
  });

  if (loggedIn || (!JSON.stringify(loggedIn) && profile && token) || pageReload) {
    return <>{children}</>;
  } else {
    return (
      <>
        <Navigate to={'/'} />
      </>
    );
  }
};

export default ProtectedRoutes;
