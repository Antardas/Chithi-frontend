import { AxiosResponse } from 'axios';
import React, { useCallback, useState } from 'react';
import { FaSpinner } from 'react-icons/fa';
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
  const [, , removeToken] = useLocalStorage('token');
  const [pageReload, _setPageReload, removeSessionPageReload] = useSessionStorage('pageReload');
  const dispatch = useAppDispatch();
  const { profile, token } = useSelector((state: RootState) => state.user);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  // const [userData, setUserData] = useState<IUser | null>(null);
  const checkUser = useCallback(async () => {
    setLoading(true);
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
          removeStorageUsername,
          removeToken
        });

        await userService.logoutUser();
        navigate('/');
      }, 1000);
    }
    setLoading(false);
  }, [removeSessionPageReload, removeStorageUsername, setLoggedIn, dispatch, navigate]);

  useEffectOnce(async () => {
    await checkUser();
  });

  if (loading) {
    return (
      <div className="initial-loader">
        <FaSpinner />
      </div>
    );
  }

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
