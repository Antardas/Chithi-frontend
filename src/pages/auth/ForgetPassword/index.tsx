import React, { useState } from 'react';
import { FaArrowLeft } from 'react-icons/fa';
import './ForgetPassword.scss';
import Input from '../../../Components/Input';
import Button from '../../../Components/Button';
import { Link } from 'react-router-dom';
import backgroundImage from '../../../assets/images/background.jpg';
import { authService } from '../../../services/api/auth/auth.service';
import { AxiosError, AxiosResponse, isAxiosError } from 'axios';
import { IError } from '../../../types/axios';
import { IForgetPasswordRes } from '../../../types/auth';
const ForgetPassword = () => {
  const [email, setEmail] = useState<string>('');
  const [responseMessage, setResponseMessage] = useState<string>('');
  const [alertType, setAlertType] = useState<string>('');
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const forgetPassword = async (event: React.FormEvent<HTMLFormElement>) => {
    setLoading(true);
    event.preventDefault();

    try {
      const result: AxiosResponse<IForgetPasswordRes> = await authService.forgotPassword(email);
      console.log(result);

      setLoading(false);
      setResponseMessage(result.data.message);
      setEmail('');
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
    <div
      className="container-wrapper"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover'
      }}
    >
      {' '}
      <div className="environment">DEV</div>
      <div className="container-wrapper-auth">
        <div
          className="tabs forgot-password-tabs"
          style={{
            height: `${responseMessage ? '300px' : ''}`
          }}
        >
          <div className="tabs-auth">
            <ul className="tab-group">
              <li className="tab">
                <div className="login forgot-password">Forgot Password</div>
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
                <form className="auth-form" onSubmit={forgetPassword}>
                  <div className="form-input-container">
                    {/* username field */}
                    <Input
                      id="email"
                      name="email"
                      type="mail"
                      value={email}
                      style={{
                        border: `${showAlert ? '1px solid #fa9b8a' : ''}`
                      }}
                      placeHolder="Enter your Email"
                      handleChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  {/* button component */}
                  <Button
                    label={`${loading ? 'Forger Password in progress' : 'Forger Password'}`}
                    className="auth-button button"
                    disabled={loading || !email}
                    type="submit"
                  />
                  <Link to={'/'}>
                    <span className="forgot-password">
                      <FaArrowLeft className="arrow-right" />
                      Back to Login
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

export default ForgetPassword;
