import React, { useEffect, useState } from 'react';
import { FaArrowRight } from 'react-icons/fa';
import './Login.scss';
import Input from '../../../Components/Input';
import Button from '../../../Components/Button';
import { Link } from 'react-router-dom';
import { ISignUpResponse, IUser } from '../../../types/user';
import { authService } from '../../../services/api/auth/auth.service';
import { AxiosError, AxiosResponse, isAxiosError } from 'axios';
import { IError } from '../../../types/axios';

const Login = () => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [alertType, setAlertType] = useState<string>('');
  const [hasError, setHasError] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [keepLoggedIn, setKeepLoggedIn] = useState<boolean>(false);
  const [user, setUser] = useState<IUser | null>(null);

  const loginUser = async (event: React.FormEvent<HTMLFormElement>) => {
    setLoading(true);
    event.preventDefault();

    try {
      const result: AxiosResponse<ISignUpResponse> = await authService.singIn({
        username,
        password,
        keepLoggedIn
      });
      setUser(result.data.user);
      setLoading(false);
      setErrorMessage('');
      setHasError(false);
      setAlertType('alert-success');
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
      setLoading(false);
    }
  }, [loading, user]);
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
            handleChange={(e) => setUsername(e.target.value)}
            placeHolder="Username"
          />
          {/* password field */}
          <Input
            id="password"
            name="password"
            type="password"
            value={password}
            placeHolder="Enter your password"
            handleChange={(e) => setPassword(e.target.value)}
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
