import React, { useEffect, useState } from 'react';
import { FaArrowRight } from 'react-icons/fa';
import './Login.scss';
import Input from '~/Components/Input';
import Button from '~/Components/Button';
import { Link, NavigateFunction, useNavigate } from 'react-router-dom';
import { ISignUpResponse, IUser } from '~/types/user';
import { authService } from '~/services/api/auth/auth.service';
import { AxiosError, AxiosResponse, isAxiosError } from 'axios';
import { IError } from '~/types/axios';
import useLocalStorage from '~/hooks/useLocalStorage';
import useSessionStorage from '~/hooks/useSessionStorage';
import { Utils } from '~/services/utils/utils.service';
import { useAppDispatch } from '~/redux/store';
const Login = () => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [alertType, setAlertType] = useState<string>('');
  const [hasError, setHasError] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [keepLoggedIn, setKeepLoggedIn] = useState<boolean>(false);
  const [user, setUser] = useState<IUser | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_username, setStoredUsername] = useLocalStorage('username');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_loggedIn, setLoggedIn] = useLocalStorage('keepLoggedIn');
  const [, setPageReload] = useSessionStorage('pageReload');
  const navigate: NavigateFunction = useNavigate();
  const dispatch = useAppDispatch();
  const loginUser = async (event: React.FormEvent<HTMLFormElement>) => {
    setLoading(true);
    event.preventDefault();

    try {
      const result: AxiosResponse<ISignUpResponse> = await authService.singIn({
        username,
        password,
        keepLoggedIn
      });
      setStoredUsername(`${result.data.user.username || ''}`);
      setLoggedIn(JSON.stringify(true));
      setKeepLoggedIn(true);
      setLoading(false);
      setErrorMessage('');
      setHasError(false);
      setAlertType('alert-success');
      Utils.dispatchUser(result, setPageReload, dispatch, setUser);
    } catch (error: unknown) {
      setHasError(true);
      setLoading(false);
      setAlertType('alert-error');
      if (isAxiosError(error)) {
        const typedError: AxiosError<IError> = error;
        setErrorMessage(typedError?.response?.data?.message || 'Something went wrong');
      } else {
        setErrorMessage('Something Went Wrong');
      }
    }
  };

  useEffect(() => {
    if (loading && !user) {
      return;
    }
    if (user) {
      navigate('/app/social/streams');
    }
  }, [loading, user, navigate]);
  return (
    <div className="auth-inner">
      {hasError && errorMessage ? (
        <div className={`alerts ${alertType}`} role="alert">
          {errorMessage}
        </div>
      ) : (
        ''
      )}
      <form className="auth-form" onSubmit={loginUser}>
        <div className="form-input-container">
          {/* username field */}
          <Input
            id="username"
            name="username"
            type="text"
            value={username}
            style={{
              border: `${hasError ? '1px solid #fa9b8a' : ''}`
            }}
            handleChange={(e) => setUsername(e.target.value)}
            placeHolder="Username"
            labelText="Username"
          />
          {/* password field */}
          <Input
            id="password"
            name="password"
            type="password"
            value={password}
            style={{
              border: `${hasError ? '1px solid #fa9b8a' : ''}`
            }}
            placeHolder="Enter your password"
            handleChange={(e) => setPassword(e.target.value)}
            labelText="Password"
          />
          <label className="checkmark-container" htmlFor="checkbox">
            <Input
              id="checkbox"
              name="checkbox"
              type="checkbox"
              className="checkBox"
              checked={keepLoggedIn}
              handleChange={() => {
                setKeepLoggedIn(!keepLoggedIn);
              }}
            />
            Keep me signed in
          </label>
        </div>
        {/* button component */}
        <Button label={`${loading ? 'Login in progress' : 'Login'}`} className="auth-button button" disabled={!username || !password} type="submit" />
        <Link to={'/forget-password'}>
          <span className="forgot-password">
            Forgot password?
            <FaArrowRight className="arrow-right" />
          </span>
        </Link>
      </form>
    </div>
  );
};

export default Login;
