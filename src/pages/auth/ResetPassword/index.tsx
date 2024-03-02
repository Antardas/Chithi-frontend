import React, { useState } from 'react';
import { AxiosError, AxiosResponse, isAxiosError } from 'axios';
import './ResetPassword.scss';
import { Link, useSearchParams } from 'react-router-dom';
import Button from '../../../Components/Button';
import Input from '../../../Components/Input';
import { FaArrowLeft } from 'react-icons/fa';
import backgroundImage from '../../../assets/images/background.jpg';
import { authService } from '../../../services/api/auth/auth.service';
import { IError } from '../../../types/axios';
import { IForgetPasswordRes } from '../../../types/auth';

const ResetPassword = () => {
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [responseMessage, setResponseMessage] = useState<string>('');
  const [alertType, setAlertType] = useState<string>('');
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const resetPassword = async (event: React.FormEvent<HTMLFormElement>) => {
    setLoading(true);
    event.preventDefault();

    try {
      const result: AxiosResponse<IForgetPasswordRes> = await authService.resetPassword(`${token}`, {
        confirmPassword,
        password
      });
      console.log(result);

      setLoading(false);
      setResponseMessage(result.data.message);
      setPassword('');
      setConfirmPassword('');
      setShowAlert(false);
      setAlertType('alert-success');
    } catch (error: unknown) {
      setShowAlert(true);
      setLoading(false);
      setAlertType('alert-error');
      if (isAxiosError(error)) {
        const typedError: AxiosError<IError> = error;
        setResponseMessage(typedError?.response?.data?.message || 'Something went wrong');
      } else {
        setResponseMessage('Something Went Wrong');
      }
    }
  };
  return (
    <div className="container-wrapper" style={{ backgroundImage: `url(${backgroundImage})` }}>
      <div className="environment">DEV</div>
      <div className="container-wrapper-auth">
        <div className="tabs reset-password-tabs" style={{ height: `${responseMessage ? '400px' : ''}` }}>
          <div className="tabs-auth">
            <ul className="tab-group">
              <li className="tab">
                <div className="login reset-password">Reset Password</div>
              </li>
            </ul>
            <div className="tab-item">
              <div className="auth-inner">
                {responseMessage ? (
                  <div className={`alerts ${alertType}`} role="alert">
                    {responseMessage}
                  </div>
                ) : (
                  ''
                )}
                <form className="reset-password-form" onSubmit={resetPassword}>
                  <div className="form-input-container">
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      value={password}
                      style={{
                        border: `${showAlert ? '1px solid #fa9b8a' : ''}`
                      }}
                      labelText="New Password"
                      placeholder="New Password"
                      handleChange={(e) => setPassword(e.target.value)}
                    />
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      value={confirmPassword}
                      style={{
                        border: `${showAlert ? '1px solid #fa9b8a' : ''}`
                      }}
                      labelText="Confirm Password"
                      placeholder="Confirm Password"
                      handleChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>
                  <Button
                    label={`${loading ? 'RESET PASSWORD in progress' : 'RESET PASSWORD'}`}
                    className="auth-button button"
                    disabled={confirmPassword !== password || !password || !confirmPassword || !token || loading}
                  />

                  <Link to={'/'}>
                    <span className="login">
                      <FaArrowLeft className="arrow-left" /> Back to Login
                    </span>
                  </Link>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
