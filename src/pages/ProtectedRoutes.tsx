import { AxiosResponse } from 'axios';
import React, { useCallback, useState } from 'react';
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
import { ICurrentUser, IUser } from '~/types/user';

const ProtectedRoutes: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [_username, _setStoredUsername, removeStorageUsername] = useLocalStorage('username');
  const [loggedIn, setLoggedIn, _deleteLoggedIn] = useLocalStorage('keepLoggedIn');
  const [pageReload, _setPageReload, removeSessionPageReload] = useSessionStorage('pageReload');
  const dispatch = useAppDispatch();
  const { profile, token } = useSelector((state: RootState) => state.user);
  const navigate = useNavigate();
  // const [userData, setUserData] = useState<IUser | null>(null);
  const checkUser = useCallback(async () => {
    try {
      const response: AxiosResponse<ICurrentUser> = await userService.currentUser();
      // setUserData(response.data.user);
      //TODO dispatch the conversation list
      dispatch(
        addUser({
          token: response.data.token,
          profile: response.data.user
        })
      );
      dispatch(getConversationList());
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

  useEffectOnce(async () => {
    await checkUser();
  });

  if ((profile?._id && token) || JSON.parse(loggedIn ?? 'false') || (pageReload && JSON.parse(pageReload))) {
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
