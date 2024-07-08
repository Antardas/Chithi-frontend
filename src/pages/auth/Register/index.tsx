import React, { useEffect } from 'react';
import { useState } from 'react';
import { AxiosError, AxiosResponse, isAxiosError } from 'axios';
import './Register.scss';
import { IError } from '~/types/axios';
import { Utils } from '~/services/utils/utils.service';
import { authService } from '~/services/api/auth/auth.service';
import { ISignUpResponse, IUser } from '~/types/user';
import Input from '~/Components/Input';
import Button from '~/Components/Button';
import { NavigateFunction, useNavigate } from 'react-router-dom';
import { AppDispatch, useAppDispatch } from '~/redux/store';
import useSessionStorage from '~/hooks/useSessionStorage';
import useLocalStorage from '~/hooks/useLocalStorage';
import axiosInstance from '~/services/axios';

const Register = () => {
  const [username, setUsername] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [alertType, setAlertType] = useState<string>('');
  const [hasError, setHasError] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [user, setUser] = useState<IUser | null>(null);
  const navigate: NavigateFunction = useNavigate();
  const dispatch: AppDispatch = useAppDispatch();
  const [, setPageReload] = useSessionStorage('pageReload');
  const [, setToken, removeToken] = useLocalStorage('token');
  const [, setKeepLoggedIn] = useLocalStorage('keepLoggedIn');

  const registerUser = async (event: React.FormEvent<HTMLFormElement>) => {
    setLoading(true);
    event.preventDefault();

    try {
      const avatarColor: string = Utils.avatarColor();

      const avatarImage = Utils.generateAvatar(username.charAt(0).toUpperCase(), avatarColor);

      const result: AxiosResponse<ISignUpResponse> = await authService.singUp({
        avatarColor,
        avatarImage,
        username,
        email,
        password
      });

      setLoading(false);
      setErrorMessage('');
      setHasError(false);
      setAlertType('alert-success');
			setKeepLoggedIn('true');
      console.log(axiosInstance.defaults.headers);
      Utils.dispatchUser(result, setPageReload, dispatch, setUser, setToken);
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

      setLoading(false);
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
      <form className="auth-form" onSubmit={registerUser}>
        <div className="form-input-container">
          {/* username field */}
          <Input
            id="Email"
            name="Email"
            type="email"
            value={email}
            placeHolder="Enter Email"
            handleChange={(e) => {
              setEmail(e.target.value);
            }}
            style={{
              border: `${hasError ? '1px solid #fa9b8a' : ''}`
            }}
            labelText="Email"
          />
          <Input
            id="username"
            name="username"
            type="text"
            value={username}
            style={{
              border: `${hasError ? '1px solid #fa9b8a' : ''}`
            }}
            handleChange={(e) => {
              setUsername(e.target.value);
            }}
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
            handleChange={(e) => {
              setPassword(e.target.value);
            }}
            placeHolder="Enter your password"
            labelText="Password"
          />
        </div>
        {/* button component */}
        <Button
          label={`${loading ? 'Sign Up in Progress' : 'Sign Up'}`}
          type="submit"
          className="auth-button button"
          disabled={!username || !email || !password}
        />
      </form>
    </div>
  );
};

export default Register;
